import Coupon from '@/models/Coupon';
import StoreModel from '@/models/Store';
import CategoryModel from '@/models/Category';
import { connectToDatabase } from '@/lib/db';
import { notFound } from 'next/navigation';
import EditForm from './EditForm';

export const dynamic = 'force-dynamic';

async function getData(id: string) {
    await connectToDatabase();
    const [coupon, stores, categories] = await Promise.all([
        Coupon.findById(id).lean(),
        StoreModel.find({ isActive: true }).select('name _id').sort({ name: 1 }).lean(),
        CategoryModel.find({ isActive: true }).select('name _id parentCategory').sort({ name: 1 }).lean()
    ]);

    if (!coupon) return null;

    return {
        coupon: JSON.parse(JSON.stringify(coupon)),
        stores: JSON.parse(JSON.stringify(stores)),
        categories: JSON.parse(JSON.stringify(categories))
    };
}

export default async function EditCouponPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const data = await getData(params.id);

    if (!data) {
        notFound();
    }

    return <EditForm coupon={data.coupon} stores={data.stores} categories={data.categories} />;
}
