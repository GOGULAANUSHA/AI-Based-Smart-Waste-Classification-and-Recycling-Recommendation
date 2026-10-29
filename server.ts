import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { db, hashPassword, generateToken, User } from './server/db';
import { classifyWasteImage } from './server/classifier';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Active session token store: token -> userId
const sessions = new Map<string, string>();

// Seed default sessions for demo users
const demoUser1 = db.findUserByEmail('alex@ecocycle.org');
if (demoUser1) {
  sessions.set('demo-token-alex-2026', demoUser1.id);
}

// Auth middleware helper
interface AuthenticatedRequest extends Request {
  user?: User;
}

function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.split(' ')[1];
  const userId = sessions.get(token);
  if (userId) {
    const user = db.findUserById(userId);
    if (user) {
      req.user = user;
    }
  }
  next();
}

function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }
  next();
}

app.use(authMiddleware);

// --- AUTH API ROUTES ---

// Register
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password, location } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const user = db.createUser(name.trim(), email.trim(), password, location);
    const token = generateToken();
    sessions.set(token, user.id);

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        location: user.location,
        createdAt: user.createdAt
      }
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.findUserByEmail(email.trim());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const computedHash = hashPassword(password, user.salt);
    if (computedHash !== user.passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken();
    sessions.set(token, user.id);

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        location: user.location,
        createdAt: user.createdAt
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'An unexpected error occurred during login.' });
  }
});

// Demo Login (One-click instant login for testing)
app.post('/api/auth/demo-login', (req: Request, res: Response) => {
  const { accountType } = req.body; // 'champion' or 'student'
  const email = accountType === 'student' ? 'jordan@university.edu' : 'alex@ecocycle.org';
  const user = db.findUserByEmail(email);

  if (!user) {
    return res.status(404).json({ error: 'Demo user not found.' });
  }

  const token = generateToken();
  sessions.set(token, user.id);

  return res.json({
    message: 'Demo login successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      location: user.location,
      createdAt: user.createdAt
    }
  });
});

// Get current user profile & stats
app.get('/api/auth/me', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const stats = db.getUserStats(req.user.id);

  return res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      location: req.user.location,
      createdAt: req.user.createdAt
    },
    stats
  });
});

// Update profile
app.put('/api/auth/profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, location } = req.body;
    const updated = db.updateUserProfile(req.user!.id, { name, location });
    return res.json({
      message: 'Profile updated successfully',
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        location: updated.location,
        createdAt: updated.createdAt
      }
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to update profile' });
  }
});

// Forgot Password request
app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const user = db.findUserByEmail(email.trim());
  if (!user) {
    // Return friendly status even if not found to prevent account enumeration
    return res.json({
      message: 'If that email address exists in our database, a password reset link has been dispatched.',
      tokenDeliveryNote: 'Simulated email service active. A single-use reset token was generated.'
    });
  }

  const token = db.createPasswordResetToken(user.email);

  return res.json({
    message: `Password reset token generated for ${user.email}. (Valid for 1 hour)`,
    resetToken: token, // Returned for instant testing and sandbox verification
    tokenDeliveryNote: 'In production, this token is sent via verified SMTP email service. For this demo environment, use the token directly.'
  });
});

// Reset Password with token
app.post('/api/auth/reset-password', (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Reset token and new password are required.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  const success = db.resetPasswordWithToken(token.trim(), newPassword);
  if (!success) {
    return res.status(400).json({ error: 'Invalid or expired password reset token. Please request a new one.' });
  }

  return res.json({ message: 'Password has been reset successfully. You can now log in with your new password.' });
});

// Logout
app.post('/api/auth/logout', (req: AuthenticatedRequest, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    sessions.delete(token);
  }
  return res.json({ message: 'Logged out successfully' });
});

// --- WASTE CLASSIFICATION & RECYCLING APIS ---

// Classify waste image
app.post('/api/waste/classify', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { imageBase64, mimeType, location, userMeasurements, userNotes } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required for waste classification.' });
    }

    const resolvedLocation = location || req.user?.location || 'Local Municipal Guidelines';

    // Perform AI analysis
    const analysisResult = await classifyWasteImage({
      imageBase64,
      mimeType: mimeType || 'image/jpeg',
      location: resolvedLocation,
      userMeasurements,
      userNotes: userNotes || ''
    });

    // If authenticated, persist to user's history
    let savedRecord = null;
    const targetUserId = req.user ? req.user.id : 'usr-guest';

    savedRecord = db.saveAnalysis({
      ...analysisResult,
      userId: targetUserId,
      notes: userNotes || ''
    });

    return res.json({
      success: true,
      data: savedRecord
    });
  } catch (err: any) {
    console.error('Classification error:', err);
    return res.status(500).json({ error: err.message || 'Failed to process waste image analysis.' });
  }
});

// Get analysis history
app.get('/api/waste/history', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user ? req.user.id : (req.query.userId as string || 'usr-guest');
  const records = db.getUserAnalyses(userId);

  // Optional query filters
  const category = req.query.category as string;
  const recyclability = req.query.recyclability as string;
  const search = req.query.search as string;

  let filtered = [...records];
  if (category && category !== 'all') {
    filtered = filtered.filter(r => r.category === category);
  }
  if (recyclability && recyclability !== 'all') {
    filtered = filtered.filter(r => r.recyclability === recyclability);
  }
  if (search) {
    const query = search.toLowerCase();
    filtered = filtered.filter(r =>
      r.primaryObject.toLowerCase().includes(query) ||
      r.material.toLowerCase().includes(query) ||
      (r.resinCode && r.resinCode.toLowerCase().includes(query))
    );
  }

  return res.json({ data: filtered });
});

// Get single analysis record
app.get('/api/waste/history/:id', (req: AuthenticatedRequest, res: Response) => {
  const record = db.getAnalysisById(req.params.id);
  if (!record) {
    return res.status(404).json({ error: 'Record not found' });
  }

  // Authorization check: only owner or guest records can be viewed
  if (req.user && record.userId !== req.user.id && record.userId !== 'usr-guest') {
    return res.status(403).json({ error: 'You do not have permission to view this record.' });
  }

  return res.json({ data: record });
});

// Delete analysis record
app.delete('/api/waste/history/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const deleted = db.deleteAnalysis(req.params.id, req.user!.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Record not found or not owned by you.' });
  }
  return res.json({ message: 'Record deleted successfully' });
});

// Get user statistics
app.get('/api/waste/stats', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const stats = db.getUserStats(req.user!.id);
  return res.json({ data: stats });
});

// Comprehensive Material & Recycling Guide encyclopedia API
app.get('/api/materials/guide', (_req: Request, res: Response) => {
  const guide = [
    {
      id: 'pet-1',
      code: '♳ PETE 1',
      name: 'Polyethylene Terephthalate',
      commonUses: ['Water & soft drink bottles', 'Salad dressing containers', 'Peanut butter jars'],
      recyclability: 'High (Curbside Standard)',
      processingFacility: 'Mechanical flaking, flotation separation, melt-spinning or pelletizing',
      transformationProducts: ['Polyester fleece jacket', 'Tote bags', 'Fiberfill sleeping bags', 'New rPET bottles'],
      tips: 'Empty liquids, lightly rinse, keep caps screwed on tightly to avoid loose-plastic sorting loss.'
    },
    {
      id: 'hdpe-2',
      code: '♴ HDPE 2',
      name: 'High-Density Polyethylene',
      commonUses: ['Milk jugs', 'Laundry detergent bottles', 'Bleach & shampoo bottles', 'Buckets'],
      recyclability: 'High (Curbside Standard)',
      processingFacility: 'Shredding, hot wash, extrusion into high-durability plastic lumber',
      transformationProducts: ['Plastic lumber decking', 'Park benches', 'Drainage pipes', 'Recycling bins'],
      tips: 'Natural clear milk jugs have higher scrap value than colored detergent containers.'
    },
    {
      id: 'pvc-3',
      code: '♵ PVC 3',
      name: 'Polyvinyl Chloride',
      commonUses: ['Plumbing pipes', 'Window frames', 'Vinyl siding', 'Medical tubing'],
      recyclability: 'Very Low (Specialized Drop-off Only)',
      processingFacility: 'Dangerous chlorine compounds release if incinerated; mechanical grinding required',
      transformationProducts: ['Mud flaps', 'Speed bumps', 'Cable trunking'],
      tips: 'DO NOT place in curbside recycling. Chlorine content contaminates entire plastic melts.'
    },
    {
      id: 'ldpe-4',
      code: '♶ LDPE 4',
      name: 'Low-Density Polyethylene',
      commonUses: ['Grocery shopping bags', 'Bread bags', 'Shrink wrap', 'Bubble wrap', 'Squeeze bottles'],
      recyclability: 'Specialized (Supermarket Drop-off)',
      processingFacility: 'Film collection densifiers & agglomerators',
      transformationProducts: ['Composite decking', 'Shipping envelopes', 'Heavy garbage bags'],
      tips: 'Do not put loose films in curbside bins (they tangle in revolving MRF sorting gears).'
    },
    {
      id: 'pp-5',
      code: '♷ PP 5',
      name: 'Polypropylene',
      commonUses: ['Yogurt tubs', 'Medicine prescription bottles', 'Straws', 'Bottle caps', 'Luggage'],
      recyclability: 'Medium to High (Accepted in modern facilities)',
      processingFacility: 'Density sorting, melt extrusion with impact modifiers',
      transformationProducts: ['Auto battery cases', 'Bicycle racks', 'Brooms & brushes', 'Storage totes'],
      tips: 'Rinse food residue clean. Many municipalities now accept #5 tubs.'
    },
    {
      id: 'ps-6',
      code: '♸ PS 6',
      name: 'Polystyrene / Expanded EPS',
      commonUses: ['Disposable foam cups', 'Takeout clamshells', 'Egg cartons', 'Styrofoam packaging'],
      recyclability: 'Very Low / Rarely Accepted Curbside',
      processingFacility: 'Thermal foam densification or solvent dissolution',
      transformationProducts: ['Picture frames', 'Crown molding', 'Thermal insulation panels'],
      tips: '95% air content makes transport cost-prohibitive. Seek specialized densifier drop-offs.'
    },
    {
      id: 'other-7',
      code: '♹ OTHER 7',
      name: 'Polycarbonate, Acrylic, Bio-plastics, Multilayers',
      commonUses: ['Large 5-gallon water jugs', 'Baby bottles', 'Multilayer pouch packaging', 'PLA bio-plastics'],
      recyclability: 'Low / Non-Recyclable Curbside',
      processingFacility: 'Varies by exact sub-polymer; mostly municipal waste-to-energy or industrial composting for certified PLA',
      transformationProducts: ['Plastic-concrete aggregates', 'Industrial energy recovery'],
      tips: 'PLA compostable cups will destroy traditional PET batches if mixed together.'
    },
    {
      id: 'alu-41',
      code: '♺ ALU 41',
      name: 'Aluminium Metal',
      commonUses: ['Beverage cans', 'Baking foil', 'Food tins', 'Window screens'],
      recyclability: 'Infinite (Highest Value Commodity)',
      processingFacility: 'Eddy current separators, decoating furnace, remelt ingot casting',
      transformationProducts: ['New beverage cans (60-day closed loop)', 'Automotive body panels', 'Bicycle frames'],
      tips: 'Save pull tabs on the cans. Recycled aluminium uses 95% less energy than mining bauxite.'
    },
    {
      id: 'fe-40',
      code: '♺ FE 40',
      name: 'Steel & Tin-Plated Cans',
      commonUses: ['Soup cans', 'Pet food tins', 'Aerosol cans', 'Paint cans'],
      recyclability: 'Infinite (Curbside Standard)',
      processingFacility: 'High-power overhead magnetic cross-belt separators, basic oxygen furnaces',
      transformationProducts: ['Structural I-beams', 'Car chassis', 'Appliances', 'New food cans'],
      tips: 'Rinse food sauce. Aerosol cans must be completely empty before recycling.'
    },
    {
      id: 'gl-70',
      code: '♼ GL 70',
      name: 'Soda-Lime Container Glass',
      commonUses: ['Wine bottles', 'Beer bottles', 'Jam jars', 'Sauce containers'],
      recyclability: 'Infinite (Curbside or Glass Banks)',
      processingFacility: 'Optical color sorting, cullet crushers, 1500°C glass furnaces',
      transformationProducts: ['New glass bottles', 'Fiberglass insulation', 'Abrasive grit', 'Glassphalt road paving'],
      tips: 'Do NOT mix with Pyrex, ceramic, crystal, or mirror glass which have incompatible thermal expansion.'
    },
    {
      id: 'pap-20',
      code: '♽ PAP 20',
      name: 'Corrugated Cardboard',
      commonUses: ['Shipping boxes', 'Appliance packaging', 'Shoe boxes'],
      recyclability: 'High (Curbside Standard, 5-7 Cycles)',
      processingFacility: 'Hydrapulper slurry, de-inking screening, paper cylinder drying machines',
      transformationProducts: ['New corrugated boxes', 'Molded paper egg cartons', 'Paperboard cereal boxes'],
      tips: 'Flatten completely. Remove greasy pizza grease sections or bubble wrap.'
    },
    {
      id: 'ewaste',
      code: '⚡ E-WASTE',
      name: 'Consumer Electronics & Circuit Boards',
      commonUses: ['Smartphones', 'Laptops', 'Cables', 'Batteries', 'Small appliances'],
      recyclability: 'Specialized Certified E-Waste Centers (Never Curbside)',
      processingFacility: 'Manual hazardous disassembly, hydrometallurgical & pyrometallurgical precious metal recovery',
      transformationProducts: ['Recovered Gold, Silver, Copper, Palladium, Lithium, and Cobalt'],
      tips: 'Never put rechargeable lithium batteries into regular bins—they cause catastrophic collection truck fires.'
    }
  ];

  return res.json({ data: guide });
});

// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EcoCycle AI server active and listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
