// @ts-nocheck

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

async function verifyConnection() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("MONGODB_URI not found");
        return;
    }

    try {
        console.log("Attempting to connect...");
        await mongoose.connect(uri);
        console.log("✅ Successfully connected to MongoDB!");

        // Check coupons collection
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));

        const count = await mongoose.connection.db.collection('coupons').countDocuments();
        console.log(`Found ${count} coupons in 'coupons' collection.`);

        const coupons = await mongoose.connection.db.collection('coupons').find().sort({ _id: -1 }).limit(3).toArray();
        console.log("Latest 3 coupons:", coupons);

        await mongoose.disconnect();
    } catch (err) {
        console.error("❌ Connection failed:", err);
    }
}

verifyConnection();
