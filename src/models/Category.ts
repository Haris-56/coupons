
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    icon?: string;
    parentCategory?: mongoose.Types.ObjectId;
    isFeatured: boolean;
    isShowInMenu: boolean;
    isActive: boolean;
    seoTitle?: string;
    seoDescription?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String },
        imageUrl: { type: String },
        icon: { type: String },
        parentCategory: { type: Schema.Types.ObjectId, ref: 'Category' },
        isFeatured: { type: Boolean, default: false },
        isShowInMenu: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        seoTitle: { type: String },
        seoDescription: { type: String },
    },
    { timestamps: true }
);

const Category: Model<ICategory> =
    mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
