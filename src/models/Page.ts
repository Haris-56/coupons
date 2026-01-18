
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPage extends Document {
    title: string;
    slug: string;
    content: string; // HTML or Markdown
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const PageSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        content: { type: String, default: '' },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Page: Model<IPage> =
    mongoose.models.Page || mongoose.model<IPage>('Page', PageSchema);

export default Page;
