
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStore extends Document {
    name: string;
    slug: string;
    description?: string;
    logoUrl?: string; // "Image" in screenshot
    affiliateLink?: string; // "Tracking Link" in screenshot
    url?: string; // "Url/Link" in screenshot
    country?: string;
    network?: string; // e.g. "Admitad"
    isFeatured: boolean;
    isActive: boolean;
    seoTitle?: string;
    seoDescription?: string;
    createdAt: Date;
    updatedAt: Date;
}

const StoreSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String },
        logoUrl: { type: String },
        affiliateLink: { type: String },
        url: { type: String },
        country: { type: String, default: 'Global' },
        network: { type: String },
        isFeatured: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        seoTitle: { type: String },
        seoDescription: { type: String },
    },
    { timestamps: true }
);

const Store: Model<IStore> =
    mongoose.models.Store || mongoose.model<IStore>('Store', StoreSchema);

export default Store;
