import StoreModel from '@/models/Store';
import { connectToDatabase } from '@/lib/db';
import { notFound } from 'next/navigation';
import EditForm from './EditForm';

export default async function EditStorePage(props: { params: Promise<{ id: string }> }) {
    await connectToDatabase();
    const params = await props.params;
    const store = await StoreModel.findById(params.id).lean();

    if (!store) {
        notFound();
    }

    // Convert MongoDB document to plain JS object and handle dates/IDs
    const serializedStore = JSON.parse(JSON.stringify(store));

    return <EditForm store={serializedStore} />;
}
