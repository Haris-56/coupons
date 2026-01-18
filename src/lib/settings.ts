
import { connectToDatabase } from './db';
import Settings from '@/models/Settings';

export async function getSettings() {
    await connectToDatabase();
    const settings = await Settings.findOne();
    if (!settings) {
        // Create default settings if not exists
        return {
            siteName: 'DiscountCouponn',
            siteDescription: 'Best coupons and deals',
            facebookUrl: '#',
            twitterUrl: '#',
            instagramUrl: '#',
            headerScripts: '',
            footerScripts: ''
        };
    }
    return JSON.parse(JSON.stringify(settings));
}
