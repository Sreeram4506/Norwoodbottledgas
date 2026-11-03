import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';

const contactSubmissionSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    message: { type: String, default: '', trim: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type ContactSubmissionDoc = InferSchemaType<typeof contactSubmissionSchema> & {
  _id: import('mongoose').Types.ObjectId;
};

export const ContactSubmission: Model<ContactSubmissionDoc> =
  (mongoose.models.ContactSubmission as Model<ContactSubmissionDoc>) ||
  mongoose.model<ContactSubmissionDoc>('ContactSubmission', contactSubmissionSchema);
