
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import StoreModel from '@/models/Store';
import Coupon from '@/models/Coupon';
import Category from '@/models/Category';

export async function GET() {
    try {
        await connectToDatabase();

        // Check if data already exists to prevent duplicates
        const storeCount = await StoreModel.countDocuments();
        if (storeCount > 5) {
            return NextResponse.json({ message: 'Data already seeded', storeCount });
        }

        // 1. Create Categories
        const categoriesData = [
            { name: 'Fashion', slug: 'fashion', icon: '🛍️' },
            { name: 'Electronics', slug: 'electronics', icon: '💻' },
            { name: 'Travel', slug: 'travel', icon: '✈️' },
            { name: 'Food', slug: 'food', icon: '🍔' },
            { name: 'Software', slug: 'software', icon: '💾' },
            { name: 'Health', slug: 'health', icon: '💊' },
        ];

        // Upsert categories
        const categories = [];
        for (const cat of categoriesData) {
            const dbCat = await Category.findOneAndUpdate(
                { slug: cat.slug },
                { ...cat, isFeatured: true, isActive: true },
                { upsert: true, new: true }
            );
            categories.push(dbCat);
        }

        // 2. Create Stores
        const storesData = [
            { name: 'Amazon', slug: 'amazon', domain: 'amazon.com', description: 'The world\'s largest online retailer.' },
            { name: 'Nike', slug: 'nike', domain: 'nike.com', description: 'Just Do It. Premium athletic apparel and footwear.' },
            { name: 'Adidas', slug: 'adidas', domain: 'adidas.com', description: 'Impossible is Nothing. Sportswear and fashion.' },
            { name: 'Uber Eats', slug: 'uber-eats', domain: 'ubereats.com', description: 'Food delivery from your favorite restaurants.' },
            { name: 'Expedia', slug: 'expedia', domain: 'expedia.com', description: 'Your one-stop travel booking site.' },
            { name: 'Adobe', slug: 'adobe', domain: 'adobe.com', description: 'Creativity for all. Photoshop, Illustrator, and more.' },
            { name: 'Samsung', slug: 'samsung', domain: 'samsung.com', description: 'Inspire the World, Create the Future.' },
            { name: 'Apple', slug: 'apple', domain: 'apple.com', description: 'Think Different. iPhone, Mac, iPad.' },
            { name: 'Sephora', slug: 'sephora', domain: 'sephora.com', description: 'Unlock your beauty potential.' },
            { name: 'DoorDash', slug: 'doordash', domain: 'doordash.com', description: 'Delivering good.' },
        ];

        const stores = [];
        for (const store of storesData) {
            const dbStore = await StoreModel.findOneAndUpdate(
                { slug: store.slug },
                {
                    ...store,
                    isActive: true,
                    isFeatured: Math.random() > 0.3,
                    logoUrl: `https://logo.clearbit.com/${store.domain}`
                },
                { upsert: true, new: true }
            );
            stores.push(dbStore);
        }

        // 3. Create Coupons
        const couponsData = [
            { title: 'Save 20% on all Shoes', code: 'NIKE20', type: 'Code', discount: '20% OFF' },
            { title: '$10 Off Your First Order', code: 'WELCOME10', type: 'Code', discount: '$10 OFF' },
            { title: 'Free Shipping on orders over $50', type: 'Deal', discount: 'FREE SHIP' },
            { title: '50% Off Winter Sale', type: 'Deal', discount: '50% OFF' },
            { title: 'Buy One Get One Free', code: 'BOGO2026', type: 'Code', discount: 'BOGO' },
            { title: 'Summer Collection Clearance', type: 'Deal', discount: 'CLEARANCE' },
            { title: '15% Student Discount', code: 'STUDENT15', type: 'Code', discount: '15% OFF' },
            { title: 'Flash Sale: Up to 70% Off', type: 'Deal', discount: '70% OFF' },
        ];

        let couponCount = 0;
        for (const store of stores) {
            // Add 1-2 coupons per store
            const numCoupons = Math.floor(Math.random() * 2) + 1;

            for (let i = 0; i < numCoupons; i++) {
                const template = couponsData[Math.floor(Math.random() * couponsData.length)];
                await Coupon.create({
                    title: `${template.title} at ${store.name}`,
                    description: `Get the best deal at ${store.name}. Verified working.`,
                    code: template.code,
                    couponType: template.type,
                    discountValue: template.discount,
                    store: store._id,
                    category: categories[Math.floor(Math.random() * categories.length)]._id,
                    startDate: new Date(),
                    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                    isActive: true,
                    isFeatured: Math.random() > 0.5,
                    isExclusive: Math.random() > 0.7,
                    isVerified: true,
                    votesUp: Math.floor(Math.random() * 50) + 10,
                    votesDown: Math.floor(Math.random() * 5),
                });
                couponCount++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `Seeded ${stores.length} stores, ${categories.length} categories, and ${couponCount} coupons.`
        });

    } catch (error: any) {
        console.error('Seeding error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
