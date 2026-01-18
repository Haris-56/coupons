
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Construct path to .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

// Import Models
// We need to define them here or import them. Importing might fail if they rely on '@/lib/db' which relies on process.env which we just set.
// It's safer to import them if they are just schema definitions. 
// BUT, alias '@/' might not work with standard ts-node/tsx without tsconfig paths setup.
// To be safe and self-contained, I will use relative imports if possible or register paths.
// Actually, 'tsx' handles tsconfig paths automatically if tsconfig.json is present.

// Let's assume strict relative paths to models to avoid alias issues if running from root.
import Store from '../models/Store';
import Coupon from '../models/Coupon';
import Category from '../models/Category';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI as string);
        console.log('Connected.');

        // 1. Create Categories
        const categoriesData = [
            { name: 'Fashion', slug: 'fashion', icon: 'fa-tshirt' },
            { name: 'Electronics', slug: 'electronics', icon: 'fa-laptop' },
            { name: 'Travel', slug: 'travel', icon: 'fa-plane' }
        ];

        const categoriesMap: Record<string, any> = {};

        for (const catData of categoriesData) {
            let cat = await Category.findOne({ slug: catData.slug });
            if (!cat) {
                cat = await Category.create({
                    name: catData.name,
                    slug: catData.slug,
                    description: `Best deals on ${catData.name}`,
                    isActive: true,
                    isFeatured: true, // Feature them so they show on home
                    imageUrl: catData.icon // Using font awesome class as placeholder or emoji
                });
                console.log(`Created Category: ${cat.name}`);
            } else {
                console.log(`Category exists: ${cat.name}`);
            }
            categoriesMap[cat.name] = cat;
        }

        // 2. Create Stores
        const storesData = [
            {
                name: 'Nike',
                slug: 'nike',
                cat: 'Fashion',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png',
                desc: 'Just Do It. Innovative sportswear and footwear.',
                url: 'https://nike.com'
            },
            {
                name: 'Amazon',
                slug: 'amazon',
                cat: 'Electronics',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png',
                desc: 'Earth\'s biggest selection of books, electronics, apparel & more.',
                url: 'https://amazon.com'
            },
            {
                name: 'Expedia',
                slug: 'expedia',
                cat: 'Travel',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Expedia_2024_logo.svg/2560px-Expedia_2024_logo.svg.png',
                desc: 'Plan your next trip with Expedia.',
                url: 'https://expedia.com'
            }
        ];

        const storesMap: Record<string, any> = {};

        for (const storeData of storesData) {
            let store = await Store.findOne({ slug: storeData.slug });
            if (!store) {
                store = await Store.create({
                    name: storeData.name,
                    slug: storeData.slug,
                    description: storeData.desc,
                    logoUrl: storeData.logo,
                    url: storeData.url,
                    affiliateLink: storeData.url + '?ref=demo',
                    isActive: true,
                    isFeatured: true
                });
                console.log(`Created Store: ${store.name}`);
            } else {
                console.log(`Store exists: ${store.name}`);
            }
            storesMap[storeData.name] = store;
        }

        // 3. Create Coupons
        // Need to link to Store ID and Category ID
        const couponsData = [
            // Nike
            {
                title: '20% Off All Running Shoes',
                code: 'RUN20',
                store: 'Nike',
                cat: 'Fashion',
                desc: 'Get 20% off exclusively on running shoes. Limited time offer.',
                isExclusive: true,
                isFeatured: true,
                discount: '20% OFF'
            },
            {
                title: 'Free Shipping on Orders Over $100',
                code: 'SHIPFREE',
                store: 'Nike',
                cat: 'Fashion',
                desc: 'Enjoy free standard shipping on all qualifying orders.',
                isExclusive: false,
                isFeatured: false,
                discount: 'Free Shipping'
            },
            // Amazon
            {
                title: '$50 Off New Kindle Paperwhite',
                code: 'KINDLE50',
                store: 'Amazon',
                cat: 'Electronics',
                desc: 'Save big on the latest e-reader.',
                isExclusive: true,
                isFeatured: true,
                discount: '$50 OFF'
            },
            {
                title: 'Lightning Deal: Up to 70% Off Electronics',
                code: '', // Deal, no code
                store: 'Amazon',
                cat: 'Electronics',
                desc: 'Check out the daily lightning deals section.',
                isExclusive: false,
                isFeatured: true,
                discount: 'UP TO 70%'
            },
            // Expedia
            {
                title: '10% Off Hotel Bookings',
                code: 'HOTEL10',
                store: 'Expedia',
                cat: 'Travel',
                desc: 'Valid on select hotels worldwide.',
                isExclusive: true,
                isFeatured: true,
                discount: '10% OFF'
            },
            {
                title: 'Save $100 on Flight + Hotel Packages',
                code: 'BUNDLE100',
                store: 'Expedia',
                cat: 'Travel',
                desc: 'Book together and save more on your vacation.',
                isExclusive: false,
                isFeatured: false,
                discount: '$100 OFF'
            }
        ];

        for (const data of couponsData) {
            // limit duplicates check roughly
            const exists = await Coupon.findOne({ code: data.code, store: storesMap[data.store]._id });
            if (!exists || (data.code === '' && !exists)) { // for deals with empty code, just create
                await Coupon.create({
                    title: data.title,
                    code: data.code,
                    description: data.desc,
                    store: storesMap[data.store]._id,
                    category: categoriesMap[data.cat]?._id,
                    discountValue: data.discount,
                    isActive: true,
                    isExclusive: data.isExclusive,
                    isFeatured: data.isFeatured,
                    isVerified: true
                });
                console.log(`Created Coupon: ${data.title}`);
            } else {
                console.log(`Coupon exists: ${data.title}`);
            }
        }

        console.log('Seeding completed!');
        process.exit(0);

    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

seed();
