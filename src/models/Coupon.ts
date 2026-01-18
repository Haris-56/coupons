
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICoupon extends Document {
    title: string;
    code: string;
    description?: string;
    tagLine?: string;
    store: mongoose.Types.ObjectId;
    category: mongoose.Types.ObjectId;
    subCategory?: mongoose.Types.ObjectId;
    discountValue?: string;
    startDate?: Date;
    expiryDate?: Date;
    trackingLink?: string;
    couponType?: 'Code' | 'Deals' | 'Exclusive' | 'Freeshipping' | 'Clearance';
    isExclusive: boolean;
    isFeatured: boolean;
    isVerified: boolean; // "Verify" in screenshot
    isActive: boolean; // "Status" in screenshot
    clicks: number;
    imageUrl?: string; // Optional specific image
    seoTitle?: string;
    seoDescription?: string;
    votesUp: number;
    votesDown: number;

    createdAt: Date;
    updatedAt: Date;
}

const CouponSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        code: { type: String },
        description: { type: String },
        tagLine: { type: String },
        store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
        category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
        subCategory: { type: Schema.Types.ObjectId, ref: 'Category' }, // Assuming SubCategory is also 'Category' model with parent
        discountValue: { type: String },
        startDate: { type: Date },
        expiryDate: { type: Date },
        trackingLink: { type: String },
        couponType: { type: String, enum: ['Code', 'Deals', 'Exclusive', 'Freeshipping', 'Clearance'], default: 'Code' },
        isExclusive: { type: Boolean, default: false },
        isFeatured: { type: Boolean, default: false },
        isVerified: { type: Boolean, default: true },
        isActive: { type: Boolean, default: true },
        clicks: { type: Number, default: 0 },
        imageUrl: { type: String },
        seoTitle: { type: String },
        seoDescription: { type: String },
        votesUp: { type: Number, default: 0 },
        votesDown: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Coupon: Model<ICoupon> =
    mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);

export default Coupon;
