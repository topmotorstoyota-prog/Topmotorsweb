const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const compression = require('compression'); // Нэмэх
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();

// --- PRODUCTION PREP ---
app.use(compression()); // Өгөгдлийг шахаж хурд нэмнэ

// Uploads хавтас байхгүй бол үүсгэх
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// --- SECURITY SETTINGS ---
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_change_me_now';

// Rate limiting тохиргоо
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 200, // IP тус бүрээс 15 минутанд 200 хүсэлт
  message: { message: "Хэт олон хүсэлт илгээсэн байна. 15 минут хүлээгээд дахин оролдоно уу." }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 5, // Нэвтрэх оролдлогыг 15 минутанд 5 удаагаар хязгаарлах
  message: { message: "Нэвтрэх оролдлого хэтэрсэн байна. 15 минут хүлээгээд дахин оролдоно уу." }
});

// CORS тохиргоог production-д хязгаарлах
const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN || '*',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
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

// Зөвхөн зураг хүлээн авах шүүлтүүр
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Зөвхөн зураг (jpg, png, webp, gif) хуулах боломжтой!'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB болгож нэмэгдүүлэв
});

app.post('/api/upload', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) return res.status(400).json({ message: 'Файл сонгоогүй байна.' });
    res.json({ imageUrl: `${BASE_URL}/uploads/${req.file.filename}` });
  });
});

// PDF болон бусад файл хуулах тусдаа тохиргоо
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/'); },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const pdfFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Зөвхөн PDF файл хуулах боломжтой!'), false);
  }
};

const uploadPdf = multer({ storage: fileStorage, fileFilter: pdfFilter });

app.post('/api/upload-pdf', (req, res) => {
  uploadPdf.single('pdf')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file) return res.status(400).json({ message: 'Файл сонгоогүй байна.' });
    res.json({ pdfUrl: `${BASE_URL}/uploads/${req.file.filename}` });
  });
});

app.post('/api/upload-multiple', (req, res) => {
  upload.array('images', 30)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer Error:', err);
      return res.status(400).json({ message: `Файлын хэмжээ хэтэрсэн эсвэл хэт олон файл байна: ${err.code}` });
    } else if (err) {
      console.error('Unknown Upload Error:', err);
      return res.status(500).json({ message: 'Зураг хуулахад алдаа гарлаа' });
    }

    try {
      if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'Зураг сонгоогүй байна.' });
      const imageUrls = req.files.map(file => `${BASE_URL}/uploads/${file.filename}`);
      res.json({ imageUrls });
    } catch (error) {
      res.status(500).json({ message: "Зураг боловсруулахад алдаа гарлаа." });
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
    console.error("Login Error:", err);
    res.status(500).json({ message: "Системд алдаа гарлаа. Түр хүлээгээд дахин оролдоно уу." });
  }
});

// --- CRUD HELPER ---
const setupRoutes = (routePath, model, options = {}) => {
  const checkAccess = (req, res, next) => {
    if (req.user.role === 'SUPER_ADMIN') return next();
    if (routePath === 'users') return res.status(403).json({ message: "Зөвхөн SUPER_ADMIN хэрэглэгч удирдах эрхтэй." });
    if (req.user.role === 'ADMIN') return next();
    if (req.user.role === 'EDITOR' && req.user.permissions && req.user.permissions[routePath]) return next();
    return res.status(403).json({ message: "Танд энэ хэсгийг удирдах эрх байхгүй байна." });
  };

  app.get(`/api/${routePath}`, async (req, res) => {
    try {
      // Users болон Bookings хэсгийг хамгаалах
      if (routePath === 'users' || routePath === 'bookings') {
          const authHeader = req.headers['authorization'];
          const token = authHeader && authHeader.split(' ')[1];
          if (!token) return res.status(401).json({ message: "Нэвтрэх шаардлагатай" });
          try {
              const decoded = jwt.verify(token, JWT_SECRET);
              if (routePath === 'users' && decoded.role !== 'SUPER_ADMIN') return res.sendStatus(403);
              if (routePath === 'bookings' && decoded.role === 'EDITOR' && !decoded.permissions.bookings) return res.sendStatus(403);
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
    } catch (err) {
      console.error(`GET /api/${routePath} Error:`, err);
      res.status(500).json({ message: "Мэдээлэл авахад алдаа гарлаа." });
    }
  });

  const writeMiddlewares = options.publicPost ? [] : [authenticateToken, checkAccess];

  app.post(`/api/${routePath}`, ...writeMiddlewares, async (req, res) => {
    try {
      let data = req.body;
      if (model === 'user' && data.password) {
        data.password = await bcrypt.hash(data.password, 12);
      }
      const item = await prisma[model].create({ data });

      if (model === 'user') {
        const { password, ...userWithoutPassword } = item;
        return res.json(userWithoutPassword);
      }
      res.json(item);
    } catch (err) {
      console.error(`POST /api/${routePath} Error:`, err);
      res.status(500).json({ message: "Хадгалахад алдаа гарлаа." });
    }
  });

  app.put(`/api/${routePath}/:id`, authenticateToken, checkAccess, async (req, res) => {
    try {
      const id = (routePath === 'vehicles' || isNaN(req.params.id)) ? req.params.id : parseInt(req.params.id);
      const { id: _, updatedAt, createdAt, ...updateData } = req.body;

      if (model === 'user' && updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 12);
      }

      const item = await prisma[model].update({ where: { id }, data: updateData });

      if (model === 'user') {
        const { password, ...userWithoutPassword } = item;
        return res.json(userWithoutPassword);
      }
      res.json(item);
    } catch (err) {
      console.error(`PUT /api/${routePath} Error:`, err);
      res.status(500).json({ message: "Шинэчлэхэд алдаа гарлаа." });
    }
  });

  app.delete(`/api/${routePath}/:id`, authenticateToken, checkAccess, async (req, res) => {
    try {
      const id = (routePath === 'vehicles' || isNaN(req.params.id)) ? req.params.id : parseInt(req.params.id);

      // 1. Устгах гэж буй өгөгдлийг эхлээд авах
      const item = await prisma[model].findUnique({ where: { id } });
      if (!item) return res.status(404).json({ message: "Олдсонгүй" });

      // 2. Зургуудыг устгах логик
      const deleteFile = (url) => {
        if (!url || typeof url !== 'string' || !url.includes('/uploads/')) return;
        const fileName = url.split('/uploads/')[1];
        const filePath = path.join(__dirname, 'uploads', fileName);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
            console.log(`Deleted file: ${fileName}`);
          } catch (e) {
            console.error(`Error deleting file ${fileName}:`, e);
          }
        }
      };

      // Тухайн моделоос хамаарч бүх зургийн талбаруудыг шалгах
      const fieldsToFiles = ['image', 'images', 'images360', 'serviceHistory', 'interior360'];

      fieldsToFiles.forEach(field => {
        if (item[field]) {
          try {
            const value = item[field];
            // Хэрэв JSON string байвал (images, images360)
            if (value.startsWith('[') || value.startsWith('{')) {
              const parsed = JSON.parse(value);
              if (Array.isArray(parsed)) {
                parsed.forEach(imgUrl => deleteFile(imgUrl));
              } else if (typeof parsed === 'object') {
                // Variants доторх зургуудыг устгах (ЧУХАЛ)
                if (field === 'variants' || Array.isArray(parsed)) {
                   // Variants-ийг тусад нь доор шалгана
                }
              }
            } else {
              deleteFile(value);
            }
          } catch (e) {
            deleteFile(item[field]);
          }
        }
      });

      // Variants доторх зургуудыг тусгайлан шалгаж устгах
      if (item.variants) {
        try {
          const variants = JSON.parse(item.variants);
          variants.forEach(v => {
            if (v.image) deleteFile(v.image);
            if (v.interior360) deleteFile(v.interior360);
            if (v.images && Array.isArray(v.images)) v.images.forEach(img => deleteFile(img));
            if (v.colors && Array.isArray(v.colors)) {
              v.colors.forEach(c => {
                if (c.image) deleteFile(c.image);
                if (c.images360 && Array.isArray(c.images360)) c.images360.forEach(img => deleteFile(img));
              });
            }
          });
        } catch (e) { console.error("Error parsing variants for file deletion", e); }
      }

      // 3. Өгөгдлийн сангаас устгах
      await prisma[model].delete({ where: { id } });
      res.json({ message: "Амжилттай устлаа" });
    } catch (err) {
      console.error(`DELETE /api/${routePath} Error:`, err);
      res.status(500).json({ message: "Устгахад алдаа гарлаа." });
    }
  });
};

setupRoutes('vehicles', 'vehicle');
setupRoutes('news', 'news');
setupRoutes('products', 'product');
setupRoutes('toyota-q', 'toyotaQ');
setupRoutes('users', 'user');
setupRoutes('bookings', 'booking', { publicPost: true });
setupRoutes('staff', 'staff');
setupRoutes('home-banner', 'homeBanner');

app.listen(5000, '0.0.0.0', () => console.log('Server running on 5000 (accessible on 10.0.3.50:5000)'));
