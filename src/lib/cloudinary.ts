
import { v2 as cloudinary } from 'cloudinary';

// Initial configuration logic moved inside the function for higher reliability in Next.js Server Actions

export async function uploadImage(file: File, folder: string) {
    if (!file || file.size === 0) return null;

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.error('CLOUDINARY ERROR: Environment variables are missing!');
        throw new Error('Cloudinary configuration is missing. Please check your environment variables.');
    }

    // Explicitly configure here to resolve "Must supply api_key" in Server Actions
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise<string>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                resource_type: 'auto',
                folder: `coupon_website/${folder}`,
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    reject(new Error('Failed to upload image to Cloudinary'));
                } else {
                    resolve(result!.secure_url);
                }
            }
        ).end(buffer);
    });
}
