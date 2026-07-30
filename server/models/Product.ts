import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';

const productSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: ['grill', 'accessory'], default: 'grill', required: true },
    brand: { type: String, default: 'MHP', trim: true },
    model: { type: String, default: '', trim: true },
    description: { type: String, default: '' },
    specs: { type: Map, of: String, default: {} },
    price: { type: Number, required: true, min: 0 },
    images: { type: [String], default: [] },
    stock: { type: Number, required: true, min: 0, default: 0 },
    isActive: { type: Boolean, default: true },
    isPlaceholder: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type ProductDoc = InferSchemaType<typeof productSchema> & { _id: import('mongoose').Types.ObjectId };

export const Product: Model<ProductDoc> =
  (mongoose.models.Product as Model<ProductDoc>) || mongoose.model<ProductDoc>('Product', productSchema);
