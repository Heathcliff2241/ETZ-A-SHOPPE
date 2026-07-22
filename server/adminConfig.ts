import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const configPath = path.join(process.cwd(), 'server', 'admin_config.json');

export interface AdminConfig {
  adminEmail: string;
  notificationEmail: string;
  shopName: string;
  ownerName: string;
  shopEmail: string;
  shopPhone: string;
  shopFacebook: string;
  shopInstagram: string;
  shopGcash: string;
  shopGcashName: string;
  shopAddress: string;
  shopTagline: string;
}

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'cesaresmero2@gmail.com';
const DEFAULT_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || 'cesaresmero2@gmail.com';

const DEFAULTS: AdminConfig = {
  adminEmail: DEFAULT_ADMIN_EMAIL,
  notificationEmail: DEFAULT_NOTIFICATION_EMAIL,
  shopName: 'ETZ A SHOPPE',
  ownerName: 'Cesar Esmero',
  shopEmail: 'cesaresmero2@gmail.com',
  shopPhone: '+63 912 345 6789',
  shopFacebook: 'https://www.facebook.com/profile.php?id=100064749982511',
  shopInstagram: 'https://instagram.com/etzashoppe',
  shopGcash: '0912 345 6789',
  shopGcashName: 'Cesar E.',
  shopAddress: 'Tagbilaran City, Bohol, Philippines',
  shopTagline: 'Curated Thrift & Vintage Marketplace',
};

function loadConfig(): AdminConfig {
  try {
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf8');
      const parsed = JSON.parse(data) as Partial<AdminConfig>;
      return {
        adminEmail: parsed.adminEmail || DEFAULTS.adminEmail,
        notificationEmail: parsed.notificationEmail || DEFAULTS.notificationEmail,
        shopName: parsed.shopName || DEFAULTS.shopName,
        ownerName: parsed.ownerName || DEFAULTS.ownerName,
        shopEmail: parsed.shopEmail || DEFAULTS.shopEmail,
        shopPhone: parsed.shopPhone || DEFAULTS.shopPhone,
        shopFacebook: parsed.shopFacebook || DEFAULTS.shopFacebook,
        shopInstagram: parsed.shopInstagram || DEFAULTS.shopInstagram,
        shopGcash: parsed.shopGcash || DEFAULTS.shopGcash,
        shopGcashName: parsed.shopGcashName || DEFAULTS.shopGcashName,
        shopAddress: parsed.shopAddress || DEFAULTS.shopAddress,
        shopTagline: parsed.shopTagline || DEFAULTS.shopTagline,
      };
    }
  } catch (err) {
    console.warn('[config] Failed to load admin config, using defaults:', err);
  }
  return { ...DEFAULTS };
}

function saveConfig(config: AdminConfig) {
  try {
    const dir = path.dirname(configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
  } catch (err) {
    console.error('[config] Failed to save admin config:', err);
  }
}

let activeConfig = loadConfig();

export const adminConfig = {
  getAdminEmail() {
    return activeConfig.adminEmail;
  },
  getNotificationEmail() {
    return activeConfig.notificationEmail;
  },
  getAllConfig() {
    return { ...activeConfig };
  },
  getPublicConfig() {
    const { adminEmail, notificationEmail, ...publicConfig } = activeConfig;
    return publicConfig;
  },
  updateConfig(updates: Partial<AdminConfig>) {
    activeConfig = {
      ...activeConfig,
      ...updates,
      adminEmail: updates.adminEmail ? updates.adminEmail.trim().toLowerCase() : activeConfig.adminEmail,
      notificationEmail: updates.notificationEmail ? updates.notificationEmail.trim().toLowerCase() : activeConfig.notificationEmail,
    };
    saveConfig(activeConfig);
    return activeConfig;
  },
  loadFromRows(rows: { key: string; value: string }[]) {
    if (!rows || !Array.isArray(rows)) return;
    const dbObj: Partial<AdminConfig> = {};
    for (const r of rows) {
      if (r.key && r.value !== undefined) {
        (dbObj as any)[r.key] = r.value;
      }
    }
    activeConfig = { ...activeConfig, ...dbObj };
  }
};

