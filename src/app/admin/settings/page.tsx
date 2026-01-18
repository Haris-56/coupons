
import SettingsForm from '@/components/admin/SettingsForm';

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
            <div className="h-1 w-10 bg-blue-600 rounded-full mt-1 mb-6"></div>

            <SettingsForm />
        </div>
    );
}
