import postgres from 'postgres';
import dotenv from 'dotenv';
import { adminConfig } from './adminConfig.js';
dotenv.config();

let sqlInstance: any = null;
let dbError: Error | null = null;

try {
  if (process.env.DATABASE_URL) {
    const client = postgres(process.env.DATABASE_URL, {
      max: 3,           // increased to 3 for serverless to handle concurrent requests smoothly
      ssl: 'require',
      idle_timeout: 20,
      connect_timeout: 10,
    });

    // Wrap as tagged template literal so all existing sql`...` calls work unchanged
    const wrapper = (strings: TemplateStringsArray, ...values: any[]) => {
      return client(strings, ...values);
    };
    wrapper.query = async (queryText: string, params?: any[]) => {
      return client.unsafe(queryText, params || []);
    };
    sqlInstance = wrapper;
  } else {
    dbError = new Error('DATABASE_URL environment variable is not set.');
  }
} catch (error) {
  dbError = error instanceof Error ? error : new Error(String(error));
}

const fallbackProducts = [
  {
    id: 'etz-p1',
    name: 'Vintage Brown Corduroy Jacket',
    price: 450,
    category: 'mens',
    size: 'L (Chest: 44", Length: 28")',
    condition: 'Like New',
    condition_note: 'Crisp collar, deep color, zero fading or fabric wear. All original brass buttons intact.',
    quantity: 1,
    images: [
      '/images/mens_vintage_jacket_1783176811459.jpg',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'A heavyweight, incredibly warm corduroy jacket in a rich chestnut brown. Perfect for cool evenings. Hand-brushed and sanitized.',
    is_sold: false,
    date_added: '2026-06-30'
  },
  {
    id: 'etz-p2',
    name: 'Cottagecore Linen Floral Dress',
    price: 490,
    category: 'womens',
    size: 'M (Bust: 36", Waist: 28-30" stretch, Length: 42")',
    condition: 'Like New',
    condition_note: 'Perfect seams, no piling or color fading. Includes the original linen belt tie.',
    quantity: 1,
    images: [
      '/images/womens_floral_dress_1783176824055.jpg',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'An elegant floral print midi dress made of durable, breathable flax linen. Fitted waist with a flowing skirt. Perfect for weekend markets or beach strolls.',
    is_sold: false,
    date_added: '2026-07-01'
  },
  {
    id: 'etz-p9',
    name: 'Handcrafted Vintage Brass & Jade Pendant Ring',
    price: 390,
    category: 'jewelry',
    size: 'Adjustable (Fits US 6-8)',
    condition: 'Like New',
    condition_note: 'Solid brass setting with natural jade stone insert. Polished surface, scratch-free stone.',
    quantity: 1,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'A striking bohemian vintage brass ring set with genuine polished green jade. Perfect statement piece with an organic, artisanal feel.',
    is_sold: false,
    date_added: '2026-07-05'
  },
  {
    id: 'etz-p10',
    name: 'Botanical Sandalwood & Bergamot Eau de Cologne (50ml)',
    price: 620,
    category: 'perfumes',
    size: '50ml (95% full bottle)',
    condition: 'Like New',
    condition_note: 'Original glass bottle & wooden cap intact. Sprayed 3-4 times only. Stored in dark, cool cabinet.',
    quantity: 1,
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Warm, grounding unisex fragrance featuring top notes of zesty Italian bergamot, heart notes of cedar, and a deep base of Australian sandalwood.',
    is_sold: false,
    date_added: '2026-07-06'
  },
  {
    id: 'etz-p11',
    name: 'Artisanal Hand-Poured Soy Wax Candle & Brass Tray',
    price: 340,
    category: 'others',
    size: 'Medium (8 oz candle + 6" tray)',
    condition: 'Like New',
    condition_note: 'Brand new, unburned soy candle in amber glass jar with solid hammered brass coaster tray.',
    quantity: 1,
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Eco-friendly non-toxic soy wax candle infused with lavender and amber essential oils. Comes with a decorative vintage brass tray.',
    is_sold: false,
    date_added: '2026-07-07'
  }
];

// Check database availability
export function isDbAvailable() {
  return Boolean(process.env.DATABASE_URL && sqlInstance);
}

if (!sqlInstance) {
  // Create robust in-memory database fallback to enable full-featured local development without Neon Postgres
  console.log('[db] DATABASE_URL is not set. Bootstrapping robust in-memory database mock...');
  
  const inMemoryDb = {
    products: fallbackProducts.map(p => ({
      ...p,
      image: JSON.stringify(p.images),
      isActive: true,
      isFeatured: false,
      sortOrder: 0,
      createdAt: p.date_added,
      updatedAt: p.date_added,
      currentStock: p.quantity,
      lowStockThreshold: 10,
      trackInventory: true
    })) as any[],
    orders: [] as any[],
    users: [] as any[],
    carts: [] as any[],
    wishlists: [] as any[],
    contact_messages: [] as any[],
    admin_users: [] as any[],
    otp_sessions: [] as any[]
  };

  const mockRunner = async (strings: TemplateStringsArray | string, ...values: any[]) => {
    let query = '';
    if (typeof strings === 'string') {
      query = strings;
    } else {
      query = strings.reduce((acc, str, i) => acc + str + (values[i] !== undefined ? values[i] : ''), '');
    }

    const lowerQuery = query.toLowerCase();

    // 1. SELECT queries
    if (lowerQuery.includes('select')) {
      if (lowerQuery.includes('from products') || lowerQuery.includes('from etz_products')) {
        if (lowerQuery.includes('where "id" =') || lowerQuery.includes('where id =')) {
          const idMatch = query.match(/(?:"id"|id)\s*=\s*(?:\$1|'([^']+)'|([A-Za-z0-9-]+))/i);
          const id = idMatch ? (idMatch[1] || idMatch[2] || values[0]) : '';
          const product = inMemoryDb.products.find(p => p.id === id);
          return product ? [product] : [];
        }
        return inMemoryDb.products;
      }
      if (lowerQuery.includes('from orders') || lowerQuery.includes('from etz_orders')) {
        if (lowerQuery.includes('where id =')) {
          const idMatch = query.match(/id\s*=\s*(?:\$1|'([^']+)'|([A-Za-z0-9-]+))/i);
          const id = idMatch ? (idMatch[1] || idMatch[2] || values[0]) : '';
          const order = inMemoryDb.orders.find(o => o.id === id);
          return order ? [order] : [];
        }
        return inMemoryDb.orders;
      }
      if (lowerQuery.includes('from users') || lowerQuery.includes('from etz_users')) {
        if (lowerQuery.includes('where id =')) {
          const idMatch = query.match(/id\s*=\s*(?:\$1|'([^']+)'|([A-Za-z0-9-]+))/i);
          const id = idMatch ? (idMatch[1] || idMatch[2] || values[0]) : '';
          const user = inMemoryDb.users.find(u => u.id === id);
          return user ? [user] : [];
        }
        return inMemoryDb.users;
      }
      if (lowerQuery.includes('from admin_users') || lowerQuery.includes('from etz_admin_users')) {
        if (lowerQuery.includes('username =')) {
          const uMatch = query.match(/username\s*=\s*(?:\$1|'([^']+)'|([A-Za-z0-9-]+))/i);
          const username = uMatch ? (uMatch[1] || uMatch[2] || values[0]) : '';
          const admin = inMemoryDb.admin_users.find(u => u.username === username);
          return admin ? [admin] : [];
        }
        return inMemoryDb.admin_users;
      }
      if (lowerQuery.includes('from otp_sessions') || lowerQuery.includes('from etz_otp_sessions')) {
        if (lowerQuery.includes('email =')) {
          const emailMatch = query.match(/email\s*=\s*(?:\$1|'([^']+)'|([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}))/i);
          const email = emailMatch ? (emailMatch[1] || emailMatch[2] || values[0]) : '';
          const session = inMemoryDb.otp_sessions.find(s => s.email === email);
          return session ? [session] : [];
        }
        return inMemoryDb.otp_sessions;
      }
      return [];
    }

    // 2. INSERT queries
    if (lowerQuery.includes('insert into')) {
      if (lowerQuery.includes('insert into orders') || lowerQuery.includes('insert into etz_orders')) {
        const order = {
          id: values[0] || `ETZ-${Math.floor(100000 + Math.random() * 900000)}`,
          customer_name: values[1],
          customer_phone: values[2],
          customer_email: values[3],
          delivery_method: values[4],
          delivery_address: values[5],
          contact_method: values[6],
          note: values[7],
          items: typeof values[8] === 'string' ? JSON.parse(values[8]) : values[8],
          subtotal: Number(values[9]),
          status: 'pending',
          date_created: values[11] || new Date().toISOString()
        };
        inMemoryDb.orders.push(order);
        return [order];
      }
      if (lowerQuery.includes('insert into users') || lowerQuery.includes('insert into etz_users')) {
        const user = {
          id: values[0],
          email: values[1],
          name: values[2],
          phone: values[3],
          address: values[4],
          date_registered: values[5] || new Date().toISOString()
        };
        inMemoryDb.users.push(user);
        return [user];
      }
      if (lowerQuery.includes('insert into admin_users') || lowerQuery.includes('insert into etz_admin_users')) {
        const admin = {
          id: values[0] || Math.random().toString(36).slice(2),
          username: values[1],
          password_hash: values[2],
          email: values[3],
          role: values[4] || 'admin',
          date_created: values[5] || new Date().toISOString()
        };
        inMemoryDb.admin_users.push(admin);
        return [admin];
      }
      if (lowerQuery.includes('insert into otp_sessions') || lowerQuery.includes('insert into etz_otp_sessions')) {
        const session = {
          email: values[0],
          code: values[1],
          expires_at: values[2]
        };
        inMemoryDb.otp_sessions = inMemoryDb.otp_sessions.filter(s => s.email !== session.email);
        inMemoryDb.otp_sessions.push(session);
        return [session];
      }
      if (lowerQuery.includes('insert into products') || lowerQuery.includes('insert into etz_products')) {
        const isNewLayout = lowerQuery.includes('condition_note') || lowerQuery.includes('etz_products');
        if (isNewLayout) {
          const product = {
            id: values[0] || Math.random().toString(36).slice(2),
            name: values[1],
            price: Number(values[2]),
            category: values[3],
            size: values[4],
            condition: values[5],
            condition_note: values[6],
            quantity: Number(values[7] ?? 1),
            images: Array.isArray(values[8]) ? values[8] : [],
            description: values[9],
            is_sold: Boolean(values[10]),
            date_added: values[11] || new Date().toISOString()
          };
          inMemoryDb.products.push(product);
          return [product];
        } else {
          const product = {
            id: values[0] || Math.random().toString(36).slice(2),
            name: values[1],
            description: values[2],
            price: Number(values[3]),
            images: typeof values[4] === 'string' ? JSON.parse(values[4]) : values[4],
            is_sold: false,
            date_added: new Date().toISOString(),
            image: values[4],
            isActive: true,
            isFeatured: false,
            sortOrder: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            currentStock: values[10] || 1,
            lowStockThreshold: 10,
            trackInventory: true,
            category: 'mens',
            size: '',
            condition: 'Like New',
            condition_note: '',
            quantity: Number(values[10] || 1)
          };
          inMemoryDb.products.push(product);
          return [product];
        }
      }
    }

    // 3. UPDATE queries
    if (lowerQuery.includes('update')) {
      if (lowerQuery.includes('products') || lowerQuery.includes('etz_products')) {
        if (lowerQuery.includes('case when') || lowerQuery.includes('category =')) {
          const id = values[10];
          const product = inMemoryDb.products.find(p => p.id === id);
          if (product) {
            if (values[0] !== null && values[0] !== undefined) product.name = values[0];
            if (values[1] !== null && values[1] !== undefined) product.price = Number(values[1]);
            if (values[2] !== null && values[2] !== undefined) product.category = values[2];
            if (values[3] !== null && values[3] !== undefined) product.size = values[3];
            if (values[4] !== null && values[4] !== undefined) product.condition = values[4];
            if (values[5] !== null && values[5] !== undefined) product.condition_note = values[5];
            if (values[6] !== null && values[6] !== undefined) product.quantity = Number(values[6]);
            if (values[7] !== null && values[7] !== undefined) product.images = Array.isArray(values[7]) ? values[7] : [];
            if (values[8] !== null && values[8] !== undefined) product.description = values[8];
            if (values[9] !== null && values[9] !== undefined) {
              const oldSold = product.is_sold;
              product.is_sold = Boolean(values[9]);
              if (product.is_sold && !oldSold) {
                product.sold_at = values[11] || new Date().toISOString();
              } else if (!product.is_sold) {
                product.sold_at = null;
              }
            }
          }
          return product ? [product] : [];
        } else if (lowerQuery.includes('set is_sold =')) {
          const idMatch = query.match(/id\s*=\s*(?:\$2|'([^']+)'|([A-Za-z0-9-]+))/i);
          const id = idMatch ? (idMatch[1] || idMatch[2] || values[1]) : '';
          const isSold = lowerQuery.includes('true');
          const product = inMemoryDb.products.find(p => p.id === id);
          if (product) {
            product.is_sold = isSold;
            product.sold_at = isSold ? new Date().toISOString() : null;
          }
          return [product];
        }
      }
      if (lowerQuery.includes('orders') || lowerQuery.includes('etz_orders')) {
        if (lowerQuery.includes('set status =')) {
          const idMatch = query.match(/id\s*=\s*(?:\$2|'([^']+)'|([A-Za-z0-9-]+))/i);
          const id = idMatch ? (idMatch[1] || idMatch[2] || values[1]) : '';
          const status = values[0];
          const order = inMemoryDb.orders.find(o => o.id === id);
          if (order) {
            order.status = status;
          }
          return [order];
        }
      }
      if (lowerQuery.includes('users') || lowerQuery.includes('etz_users')) {
        const idMatch = query.match(/id\s*=\s*(?:\$5|'([^']+)'|([A-Za-z0-9-]+))/i);
        const id = idMatch ? (idMatch[1] || idMatch[2] || values[4]) : '';
        const user = inMemoryDb.users.find(u => u.id === id);
        if (user) {
          if (values[0] !== undefined) user.email = values[0];
          if (values[1] !== undefined) user.name = values[1];
          if (values[2] !== undefined) user.phone = values[2];
          if (values[3] !== undefined) user.address = values[3];
        }
        return user ? [user] : [];
      }
    }

    // 4. DELETE queries
    if (lowerQuery.includes('delete')) {
      if (lowerQuery.includes('from users') || lowerQuery.includes('from etz_users')) {
        const idMatch = query.match(/id\s*=\s*(?:\$1|'([^']+)'|([A-Za-z0-9-]+))/i);
        const id = idMatch ? (idMatch[1] || idMatch[2] || values[0]) : '';
        const deleted = inMemoryDb.users.find(u => u.id === id);
        inMemoryDb.users = inMemoryDb.users.filter(u => u.id !== id);
        return deleted ? [deleted] : [];
      }
      if (lowerQuery.includes('from products') || lowerQuery.includes('from etz_products')) {
        const idMatch = query.match(/id\s*=\s*(?:\$1|'([^']+)'|([A-Za-z0-9-]+))/i);
        const id = idMatch ? (idMatch[1] || idMatch[2] || values[0]) : '';
        const deleted = inMemoryDb.products.find(p => p.id === id);
        inMemoryDb.products = inMemoryDb.products.filter(p => p.id !== id);
        return deleted ? [deleted] : [];
      }
    }

    return [];
  };

  mockRunner.query = async (queryText: string, params?: any[]) => {
    return mockRunner(queryText, ...(params || []));
  };

  sqlInstance = mockRunner;
}

export const sql = sqlInstance;

export async function initDb() {
  if (!process.env.DATABASE_URL) {
    return; // No real Postgres to bootstrap, in-memory is ready
  }

  try {
    await sqlInstance`
      CREATE TABLE IF NOT EXISTS etz_products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price NUMERIC NOT NULL,
        category TEXT NOT NULL,
        size TEXT NOT NULL,
        condition TEXT NOT NULL,
        condition_note TEXT DEFAULT '',
        quantity INTEGER DEFAULT 1,
        images TEXT[] DEFAULT '{}',
        description TEXT DEFAULT '',
        is_sold BOOLEAN DEFAULT FALSE,
        sold_at TEXT,
        date_added TEXT
      )
    `;

    try {
      await sqlInstance`ALTER TABLE etz_products ADD COLUMN IF NOT EXISTS sold_at TEXT`;
    } catch (e) {
      console.warn('[db] Could not alter etz_products to add sold_at column:', e);
    }

    await sqlInstance`
      CREATE TABLE IF NOT EXISTS etz_orders (
        id TEXT PRIMARY KEY,
        customer_name TEXT,
        customer_phone TEXT,
        customer_email TEXT,
        delivery_method TEXT,
        delivery_address TEXT,
        contact_method TEXT,
        note TEXT,
        items JSONB,
        subtotal NUMERIC,
        status TEXT DEFAULT 'pending',
        date_created TEXT
      )
    `;

    try {
      await sqlInstance`ALTER TABLE etz_orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20) DEFAULT 'cash'`;
      await sqlInstance`ALTER TABLE etz_orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(30) DEFAULT 'unpaid'`;
    } catch {}

    await sqlInstance`
      CREATE TABLE IF NOT EXISTS etz_otp_sessions (
        email TEXT PRIMARY KEY,
        code TEXT NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL
      )
    `;

    await sqlInstance`
      CREATE TABLE IF NOT EXISTS etz_users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        phone TEXT,
        address TEXT,
        date_registered TEXT
      )
    `;

    await sqlInstance`
      CREATE TABLE IF NOT EXISTS etz_carts (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES etz_users(id),
        product_id TEXT REFERENCES etz_products(id),
        quantity INTEGER,
        date_added TEXT
      )
    `;

    await sqlInstance`
      CREATE TABLE IF NOT EXISTS etz_wishlists (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES etz_users(id),
        product_id TEXT REFERENCES etz_products(id),
        date_added TEXT
      )
    `;

    await sqlInstance`
      CREATE TABLE IF NOT EXISTS etz_contact_messages (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        date_created TEXT
      )
    `;

    await sqlInstance`
      CREATE TABLE IF NOT EXISTS etz_admin_users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT DEFAULT 'admin',
        date_created TEXT
      )
    `;

    await sqlInstance`
      CREATE TABLE IF NOT EXISTS etz_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `;

    try {
      const settingsRows = await sqlInstance`SELECT key, value FROM etz_settings`;
      if (settingsRows && Array.isArray(settingsRows) && settingsRows.length > 0) {
        adminConfig.loadFromRows(settingsRows as any);
        console.log('[db] Successfully loaded admin settings from database.');
      }
    } catch (e) {
      console.warn('[db] Could not load settings from etz_settings table:', e);
    }
  } catch (error) {
    console.warn('[db] Database initialization failed; continuing without persistence.', error);
  }
}
