
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { notFound } from 'next/navigation';
import { EditUserForm } from './EditForm';

export default async function EditUserPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    await connectToDatabase();
    const user = await User.findById(params.id);

    if (!user) {
        notFound();
    }

    return <EditUserForm user={JSON.parse(JSON.stringify(user))} />;
}
