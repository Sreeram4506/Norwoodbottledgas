import { useEffect, useRef, useState } from 'react';
import { ImageOff, Star, X } from 'lucide-react';
import { api, ApiError, type Product } from '@/lib/api';

type FormState = {
  id?: string;
  name: string;
  category: 'grill' | 'accessory';
  brand: string;
  model: string;
  description: string;
  price: string;
  stock: string;
  images: string[];
  specs: string;
  isActive: boolean;
};

const EMPTY_FORM: FormState = {
  name: '',
  category: 'grill',
  brand: 'MHP',
  model: '',
  description: '',
  price: '',
  stock: '0',
  images: [],
  specs: '',
  isActive: true,
};

function productToForm(p: Product): FormState {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    brand: p.brand,
    model: p.model,
    description: p.description,
    price: String(p.price),
    stock: String(p.stock),
    images: p.images,
    specs: Object.entries(p.specs)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n'),
    isActive: true,
  };
}

function parseSpecs(text: string): Record<string, string> {
  const specs: Record<string, string> = {};
  for (const line of text.split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key) specs[key] = value;
  }
  return specs;
}

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    api
      .get<{ products: Product[] }>('/admin/products')
      .then((res) => setProducts(res.products))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0 || !form) return;
    setUploadError(null);
    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const res = await api.upload<{ url: string }>('/admin/uploads', file);
        setForm((current) => (current ? { ...current, images: [...current.images, res.url] } : current));
      }
    } catch (err) {
      setUploadError(err instanceof ApiError ? err.message : 'Upload failed. Try a smaller image or a different format.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const addImageUrl = () => {
    const url = urlInput.trim();
    if (!url || !form) return;
    setForm({ ...form, images: [...form.images, url] });
    setUrlInput('');
  };

  const removeImage = (index: number) => {
    if (!form) return;
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
  };

  const setPrimaryImage = (index: number) => {
    if (!form || index === 0) return;
    const next = [...form.images];
    const [chosen] = next.splice(index, 1);
    next.unshift(chosen);
    setForm({ ...form, images: next });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setError(null);
    setSaving(true);

    const payload = {
      name: form.name,
      category: form.category,
      brand: form.brand,
      model: form.model,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.images,
      specs: parseSpecs(form.specs),
      isActive: form.isActive,
    };

    try {
      if (form.id) {
        await api.put(`/admin/products/${form.id}`, payload);
      } else {
        await api.post('/admin/products', payload);
      }
      setForm(null);
      load();
    } catch {
      setError('Could not save this product. Check the fields and try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/admin/products/${id}`);
    load();
  };

  const handleQuickStock = async (id: string, stock: number) => {
    await api.patch(`/admin/products/${id}/stock`, { stock });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Inventory</h1>
        <button
          type="button"
          onClick={() => setForm(EMPTY_FORM)}
          className="bg-burnt-orange text-white rounded-pill px-5 py-2.5 text-sm font-medium hover:bg-burnt-orange-hover transition-colors"
        >
          + Add Product
        </button>
      </div>

      {form && (
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 space-y-4"
        >
          <p className="font-display text-xl mb-2">{form.id ? 'Edit Product' : 'New Product'}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/60 mb-1.5">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-burnt-orange focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1.5">Type</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as 'grill' | 'accessory' })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-burnt-orange focus:outline-none"
              >
                <option value="grill">Grill</option>
                <option value="accessory">Accessory</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1.5">Brand</label>
              <input
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-burnt-orange focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1.5">Model</label>
              <input
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-burnt-orange focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1.5">Price (USD)</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-burnt-orange focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1.5">Stock</label>
              <input
                required
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-burnt-orange focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-burnt-orange focus:outline-none resize-y"
            />
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1.5">Photos</label>
            <p className="text-xs text-white/40 mb-3">
              The first photo is the cover image shown on the catalog and product page. Upload a photo to preview
              it here immediately.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-3">
              {/* Main / primary preview */}
              <div className="w-full sm:w-44 shrink-0">
                <div className="aspect-square rounded-lg overflow-hidden border border-white/20 bg-white/5 flex items-center justify-center">
                  {form.images[0] ? (
                    <img src={form.images[0]} alt="Primary preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-white/30">
                      <ImageOff size={28} />
                      <span className="text-[11px]">No photo yet</span>
                    </div>
                  )}
                </div>
                {form.images[0] && (
                  <p className="text-[11px] text-white/40 mt-1.5 text-center">Cover photo preview</p>
                )}
              </div>

              {/* Thumbnail strip */}
              {form.images.length > 0 && (
                <div className="flex flex-wrap content-start gap-3 flex-1">
                  {form.images.map((src, i) => (
                    <div
                      key={src + i}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border bg-white/5 ${
                        i === 0 ? 'border-burnt-orange' : 'border-white/20'
                      }`}
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      {i === 0 ? (
                        <span className="absolute bottom-1 left-1 bg-burnt-orange text-white text-[9px] uppercase tracking-wide rounded px-1.5 py-0.5">
                          Cover
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(i)}
                          className="absolute bottom-1 left-1 bg-black/60 hover:bg-burnt-orange rounded-full p-0.5 transition-colors"
                          aria-label="Make cover photo"
                          title="Make cover photo"
                        >
                          <Star size={12} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 rounded-full p-0.5 transition-colors"
                        aria-label="Remove image"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="border border-white/20 rounded-lg px-4 py-2 text-sm hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                {uploading ? 'Uploading…' : 'Upload Photo'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                multiple
                onChange={(e) => handleFilesSelected(e.target.files)}
                className="hidden"
              />
              <span className="text-xs text-white/40">JPEG, PNG, WebP, GIF, or SVG — up to 5MB each</span>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="…or paste an image URL"
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm font-mono focus:border-burnt-orange focus:outline-none"
              />
              <button
                type="button"
                onClick={addImageUrl}
                className="border border-white/20 rounded-lg px-3 py-2 text-sm hover:bg-white/10 transition-colors"
              >
                Add
              </button>
            </div>

            {uploadError && <p className="font-body text-sm text-red-400 mt-2">{uploadError}</p>}
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1.5">Specs (one per line, "key: value")</label>
            <textarea
              value={form.specs}
              onChange={(e) => setForm({ ...form, specs: e.target.value })}
              rows={3}
              placeholder="fuel: Propane / Natural Gas"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm font-mono focus:border-burnt-orange focus:outline-none resize-y"
            />
          </div>

          {error && <p className="font-body text-sm text-red-400">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving || uploading}
              className="bg-burnt-orange text-white rounded-pill px-6 py-2.5 text-sm font-medium hover:bg-burnt-orange-hover transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Product'}
            </button>
            <button
              type="button"
              onClick={() => setForm(null)}
              className="border border-white/20 rounded-pill px-6 py-2.5 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="font-body text-white/60">Loading…</p>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-white/50 font-mono text-xs uppercase">
                <th className="p-4">Photo</th>
                <th className="p-4">Name</th>
                <th className="p-4">Type</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Placeholder</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-white/10 last:border-b-0">
                  <td className="p-4">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10">
                      {p.images[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                    </div>
                  </td>
                  <td className="p-4 font-body">{p.name}</td>
                  <td className="p-4 font-body capitalize">{p.category}</td>
                  <td className="p-4 font-mono">${p.price.toLocaleString()}</td>
                  <td className="p-4">
                    <input
                      type="number"
                      min="0"
                      defaultValue={p.stock}
                      onBlur={(e) => {
                        const val = Number(e.target.value);
                        if (val !== p.stock) handleQuickStock(p.id, val);
                      }}
                      className="w-20 bg-white/10 border border-white/20 rounded px-2 py-1 font-mono text-xs"
                    />
                  </td>
                  <td className="p-4">
                    {p.isPlaceholder ? <span className="text-burnt-orange text-xs">Yes</span> : <span className="text-white/40 text-xs">No</span>}
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <button
                      type="button"
                      onClick={() => setForm(productToForm(p))}
                      className="text-burnt-orange hover:underline text-xs"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
                      className="text-white/50 hover:text-red-400 text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
