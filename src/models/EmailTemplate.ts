
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEmailTemplate extends Document {
    title: string;
    slug: string;
    fromName?: string;
    subject: string;
    content: string; // HTML content
    variables: string[]; // List of available variables for this template
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const EmailTemplateSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        fromName: { type: String },
        subject: { type: String, required: true },
        content: { type: String, required: true },
        variables: { type: [String], default: [] },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const EmailTemplate: Model<IEmailTemplate> =
    mongoose.models.EmailTemplate || mongoose.model<IEmailTemplate>('EmailTemplate', EmailTemplateSchema);

export default EmailTemplate;
