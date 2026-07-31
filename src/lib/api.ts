export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

// Set VITE_API_BASE_URL when the frontend and backend are deployed on
// different origins (e.g. this app on Vercel calling a backend on Render).
// Left unset, /api resolves relative to whatever origin served the page —
// the right default when one server serves both (Render, local dev via
// Vite's proxy).
const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '');

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}/api${path}`, {
    credentials: 'include',
    headers: init?.body ? { 'Content-Type': 'application/json' } : undefined,
    ...init,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    throw new ApiError((body && body.error) || res.statusText, res.status, body?.details);
  }

  // A 2xx response with no JSON body means something upstream served the
  // wrong thing (e.g. the SPA's index.html instead of the API route) rather
  // than a real API response — treat it as a failure instead of silently
  // returning null and letting callers crash on `res.user` / `res.products`.
  if (!isJson) {
    throw new ApiError('Unexpected response from server', res.status);
  }

  return body as T;
}

async function upload<T>(path: string, file: File): Promise<T> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_BASE}/api${path}`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    throw new ApiError((body && body.error) || res.statusText, res.status, body?.details);
  }

  if (!isJson) {
    throw new ApiError('Unexpected response from server', res.status);
  }

  return body as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'POST', body: data !== undefined ? JSON.stringify(data) : undefined }),
  put: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'PUT', body: data !== undefined ? JSON.stringify(data) : undefined }),
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'PATCH', body: data !== undefined ? JSON.stringify(data) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  upload,
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: 'grill' | 'accessory';
  brand: string;
  model: string;
  description: string;
  specs: Record<string, string>;
  price: number;
  images: string[];
  stock: number;
  inStock: boolean;
  isPlaceholder: boolean;
  // Only present on /admin/products responses.
  isActive?: boolean;
};

export type Order = {
  id: string;
  items: { productId: string; name: string; price: number; qty: number }[];
  subtotal: number;
  status: 'pending_payment' | 'paid' | 'fulfilled' | 'cancelled';
  contact: { name: string; email: string; phone: string };
  // Only present on /admin/orders responses.
  adminNotes?: string;
  devMode: boolean;
  createdAt: string;
};
