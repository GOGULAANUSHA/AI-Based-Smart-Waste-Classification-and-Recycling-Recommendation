import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  location?: string;
  createdAt: string;
}

export interface ProductTransformation {
  id: string;
  suggestedProduct: string;
  suitability: string;
  estimatedMaterialAvailable: string;
  approximateYield: string;
  requiredToolsOrProcess: string;
  materialRecoveryPercentage: number;
  transformationType: 'diy' | 'industrial' | 'both';
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'industrial';
  imageUrl?: string;
}

export interface AnalysisRecord {
  id: string;
  userId: string;
  timestamp: string;
  imageUrl: string;
  primaryObject: string;
  detectedObjects?: string[];
  material: string;
  category: 'plastic' | 'metal' | 'glass' | 'paper' | 'cardboard' | 'e-waste' | 'rubber' | 'organic' | 'mixed' | 'other';
  resinCode?: string;
  recyclability: 'recyclable' | 'non-recyclable' | 'uncertain';
  confidence: number;
  location: string;
  acceptedLocally: boolean | 'uncertain';
  localAcceptanceDetails: string;
  preparationSteps: string[];
  limitations: string[];
  safeDisposalInstructions?: string;
  sources: { title: string; url: string; organization?: string }[];
  transformations: ProductTransformation[];
  userMeasurements: {
    length?: number;
    width?: number;
    height?: number;
    dimensionUnit?: 'cm' | 'mm' | 'in';
    weight?: number;
    weightUnit?: 'g' | 'kg';
    quantity: number;
    condition: 'pristine' | 'clean' | 'soiled' | 'contaminated' | 'crushed' | 'mixed';
    isWeightEstimated?: boolean;
    isDimensionsEstimated?: boolean;
  };
  notes?: string;
}

interface ResetToken {
  token: string;
  email: string;
  expiresAt: number;
}

interface DatabaseSchema {
  users: User[];
  analyses: AnalysisRecord[];
  resetTokens: ResetToken[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadDB(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading database file, initializing fresh:', err);
  }

  // Initial seed with demo accounts so users can test immediately or register their own
  const demoSalt = crypto.randomBytes(16).toString('hex');
  const demoHash = hashPassword('EcoChampion2026!', demoSalt);

  const initialDB: DatabaseSchema = {
    users: [
      {
        id: 'usr-demo-01',
        name: 'Alex Rivera (Eco Champion)',
        email: 'alex@ecocycle.org',
        passwordHash: demoHash,
        salt: demoSalt,
        location: 'Austin, TX, USA',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'usr-demo-02',
        name: 'Jordan Lee (Student)',
        email: 'jordan@university.edu',
        passwordHash: demoHash,
        salt: demoSalt,
        location: 'London, UK',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ],
    analyses: [
      {
        id: 'rec-seed-1',
        userId: 'usr-demo-01',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        imageUrl: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=600&q=80',
        primaryObject: 'Clear Plastic Beverage Bottle (500ml)',
        detectedObjects: ['PET Plastic Bottle', 'Polypropylene (PP) Cap', 'Adhesive Label'],
        material: 'PET Plastic (Polyethylene Terephthalate)',
        category: 'plastic',
        resinCode: '♳ PETE 1',
        recyclability: 'recyclable',
        confidence: 96,
        location: 'Austin, TX, USA',
        acceptedLocally: true,
        localAcceptanceDetails: 'Accepted in Austin Resource Recovery curbside single-stream blue carts.',
        preparationSteps: [
          'Empty any remaining liquid contents completely',
          'Light rinse with water (no need to remove adhesive label)',
          'Crush or compress bottle to save container space',
          'Keep the screw cap tightly attached so it does not slip through sorting screens'
        ],
        limitations: [
          'Plastic bottles with heavy oil or motor chemical residue must be discarded as hazardous waste.',
          'Colored PET (opaque white or bright neon) has lower secondary market value than clear or light blue.'
        ],
        sources: [
          { title: 'Austin Resource Recovery Recycling Guide', url: 'https://www.austintexas.gov/department/recycling', organization: 'City of Austin' },
          { title: 'The Association of Plastic Recyclers (APR) Design Guide', url: 'https://plasticsrecycling.org', organization: 'APR' },
          { title: 'EPA Recycling Basics and Plastic Polymers', url: 'https://www.epa.gov/recycle', organization: 'US EPA' }
        ],
        transformations: [
          {
            id: 't-1',
            suggestedProduct: 'Recycled Polyester (rPET) Fleece Jacket & Apparel',
            suitability: 'Clean PET bottles have high molecular chain weight that can be extruded and melt-spun into fine synthetic textile fibers.',
            estimatedMaterialAvailable: '12 bottles (~360 grams)',
            approximateYield: 'Approximately 25 standard 500ml PET bottles produce 1 adult medium fleece sweater.',
            requiredToolsOrProcess: 'Industrial NIR optical sorting, hot caustic flaking wash, pelletization, and melt-blowing spinnerets.',
            materialRecoveryPercentage: 88,
            transformationType: 'industrial',
            difficulty: 'industrial',
            imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=400&q=80'
          },
          {
            id: 't-2',
            suggestedProduct: 'Self-Watering Botanical Plant Propagator',
            suitability: 'Watertight, transparent PET holds water safely while allowing sunlight to reach growing seedling roots.',
            estimatedMaterialAvailable: '1 bottle',
            approximateYield: '1 self-watering planter per bottle.',
            requiredToolsOrProcess: 'Utility scissors, cotton wick string, potting soil, and clean water.',
            materialRecoveryPercentage: 98,
            transformationType: 'diy',
            difficulty: 'beginner',
            imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=400&q=80'
          }
        ],
        userMeasurements: {
          length: 22,
          width: 6.5,
          height: 6.5,
          dimensionUnit: 'cm',
          weight: 30,
          weightUnit: 'g',
          quantity: 12,
          condition: 'clean',
          isWeightEstimated: false,
          isDimensionsEstimated: false
        },
        notes: 'Collected from office breakroom beverage container bin.'
      },
      {
        id: 'rec-seed-2',
        userId: 'usr-demo-01',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
        primaryObject: 'Aluminium Soda Beverage Can (330ml)',
        detectedObjects: ['Aluminium Beverage Can', 'Pull Tab (Aluminium 5182 Alloy)'],
        material: 'Aluminium Alloy (3104 body / 5182 lid)',
        category: 'metal',
        resinCode: '♺ ALU 41',
        recyclability: 'recyclable',
        confidence: 99,
        location: 'Austin, TX, USA',
        acceptedLocally: true,
        localAcceptanceDetails: 'Highest value commodity accepted curbside. Infinitely recyclable with 95% energy savings vs virgin bauxite.',
        preparationSteps: [
          'Empty beverage residue completely',
          'Quick rinse if sticky sugary drink was contained',
          'Do NOT crush completely flat if your city uses optical eddy-current separators (crushed cans can be misclassified as paper sheets)',
          'Leave pull tab attached to the can'
        ],
        limitations: [
          'Ensure cans are not filled with cigarette butts or foreign chemicals that contaminate smelter batches.'
        ],
        sources: [
          { title: 'The Aluminum Association - Can Recycling Facts', url: 'https://www.aluminum.org/Recycling', organization: 'Aluminum Association' },
          { title: 'Austin Resource Recovery Guide', url: 'https://www.austintexas.gov/department/recycling', organization: 'City of Austin' }
        ],
        transformations: [
          {
            id: 't-3',
            suggestedProduct: 'New Aluminium Beverage Cans (Closed-Loop)',
            suitability: 'Aluminium does not degrade its crystalline structure during remelting; cans can be melted and back on store shelves in under 60 days.',
            estimatedMaterialAvailable: '24 cans (~360 grams)',
            approximateYield: 'Each can yields ~0.95 of a new can body after dross slag removal.',
            requiredToolsOrProcess: 'Industrial decoating kiln (removes paint/lacquer), reverberatory melting furnace (660°C), continuous ingot casting, and cold rolling mill.',
            materialRecoveryPercentage: 95,
            transformationType: 'industrial',
            difficulty: 'industrial',
            imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=400&q=80'
          }
        ],
        userMeasurements: {
          length: 12,
          width: 6,
          height: 6,
          dimensionUnit: 'cm',
          weight: 15,
          weightUnit: 'g',
          quantity: 24,
          condition: 'clean',
          isWeightEstimated: false,
          isDimensionsEstimated: false
        },
        notes: 'Recovered from weekend community barbecue.'
      }
    ],
    resetTokens: []
  };

  saveDB(initialDB);
  return initialDB;
}

function saveDB(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database:', err);
  }
}

// Password hashing with PBKDF2
export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// User repository
export const db = {
  findUserByEmail(email: string): User | undefined {
    const data = loadDB();
    return data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  findUserById(id: string): User | undefined {
    const data = loadDB();
    return data.users.find(u => u.id === id);
  },

  createUser(name: string, email: string, password: string, location?: string): User {
    const data = loadDB();
    const existing = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);
    const newUser: User = {
      id: `usr-${crypto.randomBytes(8).toString('hex')}`,
      name,
      email: email.toLowerCase(),
      passwordHash,
      salt,
      location: location || 'Global Municipal Defaults',
      createdAt: new Date().toISOString(),
    };

    data.users.push(newUser);
    saveDB(data);
    return newUser;
  },

  updateUserProfile(id: string, updates: { name?: string; location?: string }): User {
    const data = loadDB();
    const index = data.users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    if (updates.name) data.users[index].name = updates.name;
    if (updates.location) data.users[index].location = updates.location;
    saveDB(data);
    return data.users[index];
  },

  createPasswordResetToken(email: string): string {
    const data = loadDB();
    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = Date.now() + 3600 * 1000; // 1 hour

    // Remove existing tokens for this email
    data.resetTokens = data.resetTokens.filter(t => t.email.toLowerCase() !== email.toLowerCase());
    data.resetTokens.push({ token, email: email.toLowerCase(), expiresAt });
    saveDB(data);
    return token;
  },

  resetPasswordWithToken(token: string, newPassword: string): boolean {
    const data = loadDB();
    const resetEntry = data.resetTokens.find(t => t.token === token && t.expiresAt > Date.now());
    if (!resetEntry) {
      return false;
    }

    const user = data.users.find(u => u.email.toLowerCase() === resetEntry.email.toLowerCase());
    if (!user) {
      return false;
    }

    const newSalt = crypto.randomBytes(16).toString('hex');
    user.salt = newSalt;
    user.passwordHash = hashPassword(newPassword, newSalt);

    // Invalidate token
    data.resetTokens = data.resetTokens.filter(t => t.token !== token);
    saveDB(data);
    return true;
  },

  // Analysis Records
  saveAnalysis(record: Omit<AnalysisRecord, 'id' | 'timestamp'>): AnalysisRecord {
    const data = loadDB();
    const newRecord: AnalysisRecord = {
      ...record,
      id: `rec-${crypto.randomBytes(8).toString('hex')}`,
      timestamp: new Date().toISOString(),
    };
    data.analyses.unshift(newRecord);
    saveDB(data);
    return newRecord;
  },

  getUserAnalyses(userId: string): AnalysisRecord[] {
    const data = loadDB();
    return data.analyses.filter(a => a.userId === userId);
  },

  getAnalysisById(id: string): AnalysisRecord | undefined {
    const data = loadDB();
    return data.analyses.find(a => a.id === id);
  },

  deleteAnalysis(id: string, userId: string): boolean {
    const data = loadDB();
    const initialLen = data.analyses.length;
    data.analyses = data.analyses.filter(a => !(a.id === id && a.userId === userId));
    const deleted = data.analyses.length < initialLen;
    if (deleted) {
      saveDB(data);
    }
    return deleted;
  },

  getUserStats(userId: string) {
    const data = loadDB();
    const userAnalyses = data.analyses.filter(a => a.userId === userId);
    const totalCount = userAnalyses.length;
    const recyclableCount = userAnalyses.filter(a => a.recyclability === 'recyclable').length;
    const specialDisposalCount = userAnalyses.filter(a => a.recyclability === 'non-recyclable').length;
    const uncertainCount = userAnalyses.filter(a => a.recyclability === 'uncertain').length;

    // Calculate estimated eco impact
    let totalWeightKg = 0;
    userAnalyses.forEach(a => {
      const weight = a.userMeasurements.weight || (a.category === 'plastic' ? 30 : a.category === 'metal' ? 15 : 50);
      const unit = a.userMeasurements.weightUnit || 'g';
      const qty = a.userMeasurements.quantity || 1;
      const weightInKg = (unit === 'g' ? weight / 1000 : weight) * qty;
      totalWeightKg += weightInKg;
    });

    // Environmental metrics based on EPA WARM model averages
    // 1 kg recycled plastic/metal saves approx 1.8 kg CO2e and 25 Litres of water
    const co2SavedKg = Number((totalWeightKg * 1.85).toFixed(2));
    const waterSavedLitres = Math.round(totalWeightKg * 28);
    const landfillDivertedKg = Number(totalWeightKg.toFixed(2));

    return {
      totalAnalysed: totalCount,
      recyclableCount,
      specialDisposalCount,
      uncertainCount,
      totalWeightKg: Number(totalWeightKg.toFixed(2)),
      co2SavedKg,
      waterSavedLitres,
      landfillDivertedKg,
      recentAnalyses: userAnalyses.slice(0, 5)
    };
  }
};
