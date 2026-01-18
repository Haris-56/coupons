import Category from '@/models/Category';
import { connectToDatabase } from '@/lib/db';
import { notFound } from 'next/navigation';
import EditForm from './EditForm';

export default async function EditCategoryPage(props: { params: Promise<{ id: string }> }) {
    await connectToDatabase();
    const params = await props.params;
    const category = await Category.findById(params.id).lean();

    if (!category) {
        notFound();
    }

    const serializedCategory = JSON.parse(JSON.stringify(category));

    return <EditForm category={serializedCategory} />;
}
