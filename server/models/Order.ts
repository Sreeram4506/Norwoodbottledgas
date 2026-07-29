import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending_payment', 'paid', 'fulfilled', 'cancelled'],
      default: 'pending_payment',
      required: true,
    },
    stripeSessionId: { type: String, default: null },
    contact: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: '' },
    },
    adminNotes: { type: String, default: '' },
    devMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type OrderDoc = InferSchemaType<typeof orderSchema> & { _id: import('mongoose').Types.ObjectId };

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
