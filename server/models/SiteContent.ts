import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';

const siteContentSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: 'main' },
    contact: {
      phoneHref: { type: String, default: 'tel:17817622331' },
      phoneDisplay: { type: String, default: '(781) 762-2331' },
      addressLine: { type: String, default: '305 Providence Highway, Route 1, Norwood, MA 02062' },
      email: { type: String, default: 'bengnbg@gmail.com' },
      winterHours: {
        type: String,
        default: 'Mon–Fri 8:00 AM–6:00 PM · Sat 8:00 AM–5:00 PM · Sun 10:00 AM–4:00 PM',
      },
    },
    discount: {
      title: { type: String, default: 'Limited-Time Offers' },
      messages: {
        type: [String],
        default: [
          '10% OFF refill bundles (ask us about deals!)',
          'Seasonal promo: bring your tank anytime',
          'Family & bulk discounts available',
        ],
      },
    },
  },
  { timestamps: true }
);

export type SiteContentDoc = InferSchemaType<typeof siteContentSchema> & {
  _id: import('mongoose').Types.ObjectId;
};

export const SiteContent: Model<SiteContentDoc> =
  (mongoose.models.SiteContent as Model<SiteContentDoc>) || mongoose.model<SiteContentDoc>('SiteContent', siteContentSchema);
