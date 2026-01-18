
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISettings extends Document {
    siteName: string;
    siteDescription: string;
    supportEmail: string;
    maintenanceMode: boolean;
    languageDirection: 'LTR' | 'RTL';
    currencySymbol: string;
    currencyPosition: 'left' | 'right' | 'left_space' | 'right_space';
    decimalSeparator: string;
    decimalNumber: number;
    dateFormat: string;
    timeZone: string;

    // URLs
    facebookUrl?: string;
    twitterUrl?: string;
    instagramUrl?: string;
    youtubeUrl?: string;
    linkedinUrl?: string;
    whatsappUrl?: string;

    // Pages Mapping
    searchPageId?: mongoose.Types.ObjectId;
    privacyPolicyPageId?: mongoose.Types.ObjectId;
    termsConditionPageId?: mongoose.Types.ObjectId;
    contactPageId?: mongoose.Types.ObjectId;

    // API & Analytics
    headerScripts?: string; // Analytics code
    footerScripts?: string;
    recaptchaKey?: string;
    recaptchaSecret?: string;
}

const SettingsSchema: Schema = new Schema(
    {
        siteName: { type: String, default: 'DiscountCouponn' },
        siteDescription: { type: String, default: 'Best coupons and deals' },
        supportEmail: { type: String, default: 'admin@example.com' },
        maintenanceMode: { type: Boolean, default: false },
        languageDirection: { type: String, default: 'LTR' },
        currencySymbol: { type: String, default: '$' },
        currencyPosition: { type: String, default: 'left' },
        decimalSeparator: { type: String, default: '.' },
        decimalNumber: { type: Number, default: 2 },
        dateFormat: { type: String, default: 'DD-MM-YYYY' },
        timeZone: { type: String, default: 'UTC' },

        facebookUrl: String,
        twitterUrl: String,
        instagramUrl: String,
        youtubeUrl: String,
        linkedinUrl: String,
        whatsappUrl: String,

        searchPageId: { type: Schema.Types.ObjectId, ref: 'Page' },
        privacyPolicyPageId: { type: Schema.Types.ObjectId, ref: 'Page' },
        termsConditionPageId: { type: Schema.Types.ObjectId, ref: 'Page' },
        contactPageId: { type: Schema.Types.ObjectId, ref: 'Page' },

        headerScripts: String,
        footerScripts: String,
        recaptchaKey: String,
        recaptchaSecret: String,
    },
    { timestamps: true }
);

const Settings: Model<ISettings> =
    mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
