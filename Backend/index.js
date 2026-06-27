const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();

// --- SECURITY SETTINGS ---
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_change_me_now';

// 1. Ерөнхий хандалтын хязгаар (Rate Limiting)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 200, // Нэг IP-аас 200 хүсэлт
  message: { message: "Хэт олон хүсэлт. Түр хүлээгээд дахин оролдоно уу." }
});

// 2. Нэвтрэх хэсэгт тусгай хязгаар (Login Brute-force protection)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 15 минутад 5 удаа л оролдож болно
  message: { message: "Нэвтрэх оролдлого хэтэрсэн байна. 15 минутын дараа дахин оролдоно уу." }
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/api/', generalLimiter);
app.set('trust proxy', 1); // Proxy-ийн ард байгаа бол IP-г зөв таних тохиргоо

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- IMAGE UPLOAD ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/'); },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit per file
});

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Зураг сонгоогүй байна.' });
  res.json({ imageUrl: `http://10.0.3.50:5000/uploads/${req.file.filename}` });
});

app.post('/api/upload-multiple', (req, res) => {
  upload.array('images', 30)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer Error:', err);
      return res.status(400).json({ message: `Файлын хэмжээ хэтэрсэн эсвэл хэт олон файл байна: ${err.code}` });
    } else if (err) {
      console.error('Unknown Upload Error:', err);
      return res.status(500).json({ message: 'Зураг хуулахад тодорхойгүй алдаа гарлаа' });
    }

    try {
      if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'Зураг сонгоогүй байна.' });
      const imageUrls = req.files.map(file => `http://10.0.3.50:5000/uploads/${file.filename}`);
      res.json({ imageUrls });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
});

// --- AUTH MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Нэвтрэх шаардлагатай" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Хүчингүй токен" });
    req.user = user;
    next();
  });
};

// --- AUTH ---
app.post('/api/auth/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const permissions = {
        vehicles: user.canManageVehicles || false,
        news: user.canManageNews || false,
        products: user.canManageProducts || false,
        'toyota-q': user.canManageToyotaQ || false,
        bookings: user.canManageBookings || false
      };
      const token = jwt.sign({ id: user.id, role: user.role, permissions }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, role: user.role, name: user.name, permissions });
    } else {
      res.status(401).json({ message: "Имэйл эсвэл нууц үг буруу байна" });
    }
  } catch (err) {
    res.status(500).json({ message: "Серверийн алдаа: " + err.message });
  }
});

// --- CRUD HELPER ---
const setupRoutes = (path, model, options = {}) => {
  const checkAccess = (req, res, next) => {
    if (req.user.role === 'SUPER_ADMIN') return next();
    if (path === 'users') return res.status(403).json({ message: "Зөвхөн SUPER_ADMIN хэрэглэгч удирдах эрхтэй." });
    if (req.user.role === 'ADMIN') return next();
    if (req.user.role === 'EDITOR' && req.user.permissions && req.user.permissions[path]) return next();
    return res.status(403).json({ message: "Танд энэ хэсгийг удирдах эрх байхгүй байна." });
  };

  app.get(`/api/${path}`, async (req, res) => {
    // Users болон Bookings хэсгийг хамгаалах
    if (path === 'users' || path === 'bookings') {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ message: "Нэвтрэх шаардлагатай" });
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            if (path === 'users' && decoded.role !== 'SUPER_ADMIN') return res.sendStatus(403);
            if (path === 'bookings' && decoded.role === 'EDITOR' && !decoded.permissions.bookings) return res.sendStatus(403);
            req.user = decoded;
        } catch (e) { return res.sendStatus(403); }
    }

    // Нууц үгийг хасаж буцаах
    let items = await prisma[model].findMany({ orderBy: { id: 'desc' } });
    if (model === 'user') {
      items = items.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
      });
    }
    res.json(items);
  });

  const writeMiddlewares = options.publicPost ? [] : [authenticateToken, checkAccess];

  app.post(`/api/${path}`, ...writeMiddlewares, async (req, res) => {
    try {
      let data = req.body;
      if (model === 'user' && data.password) {
        data.password = await bcrypt.hash(data.password, 12); // Salt rounds нэмсэн
      }
      const item = await prisma[model].create({ data });

      // Хариунд нууц үгийг буцаахгүй байх
      if (model === 'user') {
        const { password, ...userWithoutPassword } = item;
        return res.json(userWithoutPassword);
      }
      res.json(item);
    } catch (err) { res.status(500).json({ message: err.message }); }
  });

  app.put(`/api/${path}/:id`, authenticateToken, checkAccess, async (req, res) => {
    try {
      const id = (path === 'vehicles' || isNaN(req.params.id)) ? req.params.id : parseInt(req.params.id);
      const { id: _, updatedAt, createdAt, ...updateData } = req.body;

      if (model === 'user' && updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 12);
      }

      // Ensure specific fields are correctly formatted if necessary
      const item = await prisma[model].update({ where: { id }, data: updateData });

      if (model === 'user') {
        const { password, ...userWithoutPassword } = item;
        return res.json(userWithoutPassword);
      }
      res.json(item);
    } catch (err) { res.status(500).json({ message: err.message }); }
  });

  app.delete(`/api/${path}/:id`, authenticateToken, checkAccess, async (req, res) => {
    try {
      const id = isNaN(req.params.id) ? req.params.id : parseInt(req.params.id);
      await prisma[model].delete({ where: { id } });
      res.json({ message: "Устлаа" });
    } catch (err) { res.status(500).json({ message: err.message }); }
  });
};

setupRoutes('vehicles', 'vehicle');
setupRoutes('news', 'news');
setupRoutes('products', 'product');
setupRoutes('toyota-q', 'toyotaQ');
setupRoutes('users', 'user');
setupRoutes('bookings', 'booking', { publicPost: true });
setupRoutes('staff', 'staff');

app.listen(5000, '0.0.0.0', () => console.log('Server running on 5000 (accessible on 10.0.3.50:5000)'));
