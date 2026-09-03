const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const XLSX = require('xlsx');
const rateLimit = require('express-rate-limit');
const compression = require('compression'); // Нэмэх
const helmet = require('helmet');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();

// --- PRODUCTION PREP ---
app.use(helmet()); // Аюулгүй байдлын HTTP толгой мэдээллүүдийг тохируулна
app.use(compression()); // Өгөгдлийг шахаж хурд нэмнэ

// --- SUPABASE STORAGE ---
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || 'uploads';

const uploadToSupabase = async (file) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const filename = uniqueSuffix + path.extname(file.originalname);
  const { error } = await supabase.storage.from(SUPABASE_BUCKET).upload(filename, file.buffer, {
    contentType: file.mimetype,
  });
  if (error) throw error;
  return supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(filename).data.publicUrl;
};

// --- SECURITY SETTINGS ---
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

// CORS тохиргоог production-д хязгаарлах (таслалаар тусгаарлаж олон домэйн зөвшөөрнө)
const allowedOrigins = (process.env.ALLOWED_ORIGIN || '*').split(',').map(o => o.trim());
const corsOptions = {
  origin: allowedOrigins.includes('*') ? '*' : allowedOrigins,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/api/', generalLimiter);
app.set('trust proxy', 1); // Proxy-ийн ард байгаа бол IP-г зөв таних тохиргоо

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

// --- IMAGE UPLOAD (Supabase Storage) ---
const imageFileFilter = (req, file, cb) => {
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
  storage: multer.memoryStorage(),
  fileFilter: imageFileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB болгож нэмэгдүүлэв
});

app.post('/api/upload', authenticateToken, (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) return res.status(400).json({ message: 'Файл сонгоогүй байна.' });
    try {
      const imageUrl = await uploadToSupabase(req.file);
      res.json({ imageUrl });
    } catch (error) {
      console.error('Supabase upload error:', error);
      res.status(500).json({ message: 'Зураг хуулахад алдаа гарлаа.' });
    }
  });
});

const pdfFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Зөвхөн PDF файл хуулах боломжтой!'), false);
  }
};

const uploadPdf = multer({ storage: multer.memoryStorage(), fileFilter: pdfFilter });

app.post('/api/upload-pdf', authenticateToken, (req, res) => {
  uploadPdf.single('pdf')(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file) return res.status(400).json({ message: 'Файл сонгоогүй байна.' });
    try {
      const pdfUrl = await uploadToSupabase(req.file);
      res.json({ pdfUrl });
    } catch (error) {
      console.error('Supabase upload error:', error);
      res.status(500).json({ message: 'Файл хуулахад алдаа гарлаа.' });
    }
  });
});

app.post('/api/upload-multiple', authenticateToken, (req, res) => {
  upload.array('images', 30)(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer Error:', err);
      return res.status(400).json({ message: `Файлын хэмжээ хэтэрсэн эсвэл хэт олон файл байна: ${err.code}` });
    } else if (err) {
      console.error('Unknown Upload Error:', err);
      return res.status(500).json({ message: 'Зураг хуулахад алдаа гарлаа' });
    }

    try {
      if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'Зураг сонгоогүй байна.' });
      const imageUrls = await Promise.all(req.files.map(uploadToSupabase));
      res.json({ imageUrls });
    } catch (error) {
      console.error('Supabase upload error:', error);
      res.status(500).json({ message: "Зураг боловсруулахад алдаа гарлаа." });
    }
  });
});

// --- SHIPMENT TRACKING (Excel upload -> байршил хайх) ---
// Status текст дэх байршлын түлхүүр үгсийг бодит координатруу хөрвүүлэх толь бичиг.
// Шинэ боомт/цэг гарвал энд нэг мөр нэмэхэд хангалттай.
// Дараалал чухал: Array.find нь эхний тохирсныг авдаг тул илvv тодорхой
// (жишээ нь тухайн зогсоолын нэр) заалтуудыг ерөнхий заалтуудаас (Erlian гэх мэт
// зайн лавлагаанд гардаг үг) өмнө байрлуулна. "ATD Nagoya via Tianjin" мэтийн үед
// Нагояг эхний тохирол болгож, одоогийн байршил гэж vзнэ (хөдлөх цэг нь тэндээс).
const SHIPMENT_LOCATIONS = [
  { match: /nagoya/i, name: 'Нагоёа боомт, Япон', lat: 35.1815, lng: 136.9066,
    arrived: (d) => `${d}-нд Нагоёа боомт дээр ирсэн`,
    departed: (d) => `${d}-нд Нагоёа боомтоос хөдөлсөн` },
  { match: /saihantala/i, name: 'Сайхантал зогсоол, БНХАУ', lat: 42.7481, lng: 112.6600,
    arrived: () => `Эрээнээс 295 км зайд байрлах Сайхантал зогсоол дээр ирсэн`,
    departed: (d) => `${d}-нд Сайхантал зогсоолоос хөдөлсөн` },
  { match: /lujiacun/i, name: 'Люжяцун зогсоол, БНХАУ', lat: 43.2560, lng: 112.1470,
    arrived: () => `Эрээнээс 284 км зайд байрлах Люжяцун зогсоол дээр ирсэн`,
    departed: (d) => `${d}-нд Люжяцун зогсоолоос хөдөлсөн` },
  { match: /qisumu/i, name: 'Жинин (Цисvму) зогсоол, БНХАУ', lat: 41.0283, lng: 113.0922,
    arrived: () => `Эрээнээс 320 км зайд байрлах Цисvму зогсоол дээр ирсэн`,
    departed: (d) => `${d}-нд Цисvму зогсоолоос хөдөлсөн` },
  { match: /wuhan/i, name: 'Вухан боомт, БНХАУ', lat: 30.5928, lng: 114.3055,
    arrived: (d) => `${d}-нд Вухан боомт дээр ирсэн`,
    departed: (d) => `${d}-нд Вухан боомтоос хөдөлсөн` },
  { match: /tianjin/i, name: 'Тяньжин боомт, БНХАУ', lat: 39.0842, lng: 117.2009,
    arrived: (d) => `${d}-нд Тяньжин боомт дээр ирсэн`,
    departed: (d) => `${d}-нд Тяньжин боомтоос хөдөлсөн` },
  { match: /erlian/i, name: 'Эрээн боомт, БНХАУ', lat: 43.6550, lng: 111.9770,
    arrived: (d) => `${d}-нд БНХАУ - Эрээн боомт дээр ирсэн`,
    departed: (d) => `${d}-нд БНХАУ - Эрээн боомтоос хөдөлсөн` },
  { match: /\bzu\b|zamiin/i, name: 'Замын-Үүд, Монгол', lat: 43.6561, lng: 111.8956,
    arrived: (d) => `${d}-нд Замын-Үүд боомт дээр ирсэн`,
    departed: (d) => `${d}-нд Замын-Үүд боомтоос хөдөлсөн` },
  { match: /ub station|ulaanbaatar/i, name: 'Улаанбаатар', lat: 47.9184, lng: 106.9177,
    arrived: (d) => `${d}-нд Улаанбаатар хотод ирсэн, задраагvй хvлээгдэж байна`,
    departed: (d) => `${d}-нд Улаанбаатараас хөдөлсөн` },
];

const parseShipmentStatus = (rawStatus) => {
  if (!rawStatus) return { locationName: null, lat: null, lng: null, dateLabel: null, sentence: null };
  const text = String(rawStatus).trim();
  const dateMatch = text.match(/(\d{1,2})\/(\d{1,2})/);
  const dateLabel = dateMatch ? `${dateMatch[1]}/${dateMatch[2]}` : null;
  const withoutStagePrefix = text.replace(/^\d+_/, '');
  const withoutDate = dateMatch ? withoutStagePrefix.replace(dateMatch[0], '') : withoutStagePrefix;
  const locationText = withoutDate.trim();
  const found = SHIPMENT_LOCATIONS.find(loc => loc.match.test(locationText));

  const isDeparted = /ATD/i.test(text); // Анхаар: \b нь "_" тэмдэгтийн дараа ажилладаггvй (_ нь мөн \w-д багтдаг)
  const dateStr = dateLabel || '';

  // "ATD Nagoya via Tianjin/Wuhan" гэх мэт Нагояас хаашаа хөдөлсөнийг зааж буй хосолсон өгүүлбэр
  let sentence = null;
  const viaMatch = locationText.match(/via\s+([A-Za-z]+)/i);
  if (/nagoya/i.test(locationText) && viaMatch) {
    const viaTarget = SHIPMENT_LOCATIONS.find(loc => loc.match.test(viaMatch[1]));
    const viaName = viaTarget ? viaTarget.name.split(',')[0] : viaMatch[1];
    sentence = `${dateStr}-нд Япон улс Нагоёа боомтоос БНХАУ - ${viaName} уруу хөдөлсөн`;
  } else if (found) {
    sentence = isDeparted ? found.departed(dateStr) : found.arrived(dateStr);
  }

  return {
    locationName: found ? found.name : (locationText || null),
    lat: found ? found.lat : null,
    lng: found ? found.lng : null,
    dateLabel,
    sentence
  };
};

// "TMON2606" -> сүүлийн 4 орон "2606" -> "2026-06"
const parseOcsYearMonth = (ocsNumber) => {
  if (!ocsNumber) return null;
  const last4 = String(ocsNumber).trim().slice(-4);
  if (!/^\d{4}$/.test(last4)) return null;
  return `20${last4.slice(0, 2)}-${last4.slice(2, 4)}`;
};

const shipmentExcelFilter = (req, file, cb) => {
  const allowed = /xlsx|xls/;
  if (allowed.test(path.extname(file.originalname).toLowerCase())) return cb(null, true);
  cb(new Error('Зөвхөн Excel файл (.xlsx, .xls) хуулах боломжтой!'));
};
const uploadShipmentExcel = multer({ storage: multer.memoryStorage(), fileFilter: shipmentExcelFilter, limits: { fileSize: 20 * 1024 * 1024 } });

const adminOnly = (req, res, next) => {
  if (req.user.role === 'SUPER_ADMIN' || req.user.role === 'ADMIN') return next();
  if (req.user.role === 'EDITOR' && req.user.permissions && req.user.permissions.shipment) return next();
  return res.status(403).json({ message: "Танд энэ хэсгийг удирдах эрх байхгүй байна." });
};

app.post('/api/shipment/upload', authenticateToken, adminOnly, (req, res) => {
  uploadShipmentExcel.single('file')(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file) return res.status(400).json({ message: 'Файл сонгоогүй байна.' });
    try {
      const wb = XLSX.read(req.file.buffer, { type: 'buffer' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

      const parsed = [];
      for (const row of rows.slice(1)) {
        const vin = String(row[0] || '').trim();
        if (vin.length < 10) continue; // толгой мөр/хоосон/pivot table-ийн хог мөрүүдийг алгасна

        const ocsNumber = String(row[1] || '').trim() || null;
        parsed.push({
          vin,
          vinLast5: vin.slice(-5).toUpperCase(),
          ocsNumber,
          manufactureYearMonth: parseOcsYearMonth(ocsNumber),
          shipmentNumber: String(row[2] || '').trim() || null,
          modelName: String(row[3] || '').trim() || null,
          exteriorColor: String(row[6] || '').trim() || null,
          interiorColor: String(row[7] || '').trim() || null,
          status: String(row[10] || '').trim() || null
        });
      }

      // Шинэ файл бvрийг сүүлчийн, бүрэн жагсаалт гэж vзэж, хуучин өгөгдлийг бvгдийг нь цэвэрлээд дахин бөглөнө
      // (ингэснээр аль хэдийн хvргэгдсэн/жагсаалтаас хасагдсан машин хуучирсан өгөгдөл болж vлдэхгvй)
      await prisma.shipmentVehicle.deleteMany({});
      if (parsed.length > 0) {
        await prisma.shipmentVehicle.createMany({ data: parsed });
      }

      await logActivity(req, 'UPLOAD', 'shipment', 'excel', `${parsed.length} машины мэдээлэл шинэчлэгдлээ`);
      res.json({ message: `${parsed.length} машины мэдээлэл амжилттай шинэчлэгдлээ.`, count: parsed.length });
    } catch (error) {
      console.error('Shipment Excel upload error:', error);
      res.status(500).json({ message: 'Excel файл боловсруулахад алдаа гарлаа.', detail: formatErrorDetail(error) });
    }
  });
});

// Нэвтрэлт шаардахгүй, VIN-ий сүүлийн 5 оронгоор хайна
app.get('/api/shipment/track/:last5', async (req, res) => {
  try {
    const last5 = String(req.params.last5 || '').trim().toUpperCase();
    if (!/^[A-Z0-9]{5}$/.test(last5)) {
      return res.status(400).json({ message: 'VIN-ий сүүлийн 5 оронг зөв оруулна уу.' });
    }
    const matches = await prisma.shipmentVehicle.findMany({ where: { vinLast5: last5 } });
    const results = matches.map(m => {
      const parsed = parseShipmentStatus(m.status);
      return {
        vin: m.vin,
        modelName: m.modelName,
        exteriorColor: m.exteriorColor,
        interiorColor: m.interiorColor,
        shipmentNumber: m.shipmentNumber,
        manufactureYearMonth: m.manufactureYearMonth,
        status: m.status,
        locationName: parsed.locationName,
        lat: parsed.lat,
        lng: parsed.lng,
        dateLabel: parsed.dateLabel,
        sentence: parsed.sentence,
        updatedAt: m.updatedAt
      };
    });
    res.json(results);
  } catch (error) {
    console.error('Shipment track error:', error);
    res.status(500).json({ message: 'Мэдээлэл авахад алдаа гарлаа.' });
  }
});

// Нэвтрэлт шаардахгүй - тээврийн дугаар (Shipment Number) бүрээр давхардалгүй нэгтгэж, одоо байгаа байршлыг харуулна
app.get('/api/shipment/summary', async (req, res) => {
  try {
    const all = await prisma.shipmentVehicle.findMany();
    const groups = new Map();
    all.forEach(v => {
      const key = v.shipmentNumber || 'Тодорхойгүй';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(v);
    });

    const summary = [...groups.entries()].map(([shipmentNumber, vehicles]) => {
      // Нэг тээврийн дугаарын дор статус зөрвөл хамгийн олон давтагдсан статусыг (mode) авна
      const statusCounts = new Map();
      vehicles.forEach(v => {
        const s = v.status || '';
        statusCounts.set(s, (statusCounts.get(s) || 0) + 1);
      });
      const [modeStatus] = [...statusCounts.entries()].sort((a, b) => b[1] - a[1])[0];
      const parsed = parseShipmentStatus(modeStatus);
      return {
        shipmentNumber,
        vehicleCount: vehicles.length,
        locationName: parsed.locationName,
        dateLabel: parsed.dateLabel,
        sentence: parsed.sentence,
        lat: parsed.lat,
        lng: parsed.lng
      };
    });

    summary.sort((a, b) => a.shipmentNumber.localeCompare(b.shipmentNumber));
    res.json(summary);
  } catch (error) {
    console.error('Shipment summary error:', error);
    res.status(500).json({ message: 'Мэдээлэл авахад алдаа гарлаа.' });
  }
});

// --- AUTH ---
app.post('/api/auth/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const permissions = {
        vehicles: user.canManageVehicles || false,
        news: user.canManageNews || false,
        'wheels-tires': user.canManageWheelsTires || false,
        merch: user.canManageMerch || false,
        'toyota-q': user.canManageToyotaQ || false,
        'sales-bookings': user.canManageSalesBookings || false,
        'service-bookings': user.canManageServiceBookings || false,
        'home-banner': user.canManageHomeBanner || false,
        staff: user.canManageStaff || false,
        shipment: user.canManageShipment || false
      };
      const token = jwt.sign({ id: user.id, role: user.role, email: user.email, name: user.name, permissions }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, role: user.role, name: user.name, permissions });
    } else {
      res.status(401).json({ message: "Имэйл эсвэл нууц үг буруу байна" });
    }
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Системд алдаа гарлаа. Түр хүлээгээд дахин оролдоно уу." });
  }
});

// Нэвтэрсэн хэрэглэгч өөрийн нууц үгээ солих
app.put('/api/auth/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Нууц үгээ бүрэн бөглөнө үү." });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: "Шинэ нууц үг 6-с дээш тэмдэгттэй байх ёстой." });
  }
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(401).json({ message: "Одоогийн нууц үг буруу байна." });
    }
    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: req.user.id }, data: { password: hashed } });
    res.json({ message: "Нууц үг амжилттай солигдлоо." });
  } catch (err) {
    console.error("Change Password Error:", err);
    res.status(500).json({ message: "Системд алдаа гарлаа." });
  }
});

// Бүтээгдэхүүний ангиллаас хамаарч аль эрхэд харьяалагдахыг тодорхойлох
const WHEELS_TIRES_CATEGORIES = ['Дугуй', 'GR Tyres', 'Обуд'];
const getProductPermissionKey = (category) => {
  if (WHEELS_TIRES_CATEGORIES.includes(category)) return 'wheels-tires';
  if (category === 'GR Merch') return 'merch';
  return null;
};

// Захиалгын төрлөөс хамаарч аль эрхэд харьяалагдахыг тодорхойлох
const getBookingPermissionKey = (type) => (type === 'service' || type === 'message' ? 'service-bookings' : 'sales-bookings');

// Админ хэрэглэгчдийн CREATE/UPDATE/DELETE үйлдлийг бүртгэх
const logActivity = async (req, action, entity, entityId, entityName) => {
  try {
    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        userName: req.user.name || req.user.email || 'Тодорхойгүй',
        userEmail: req.user.email || '',
        action,
        entity,
        entityId: String(entityId),
        entityName: entityName || null
      }
    });
  } catch (err) {
    console.error('Activity log error:', err);
  }
};

// --- CRUD HELPER ---
// Prisma/DB алдааны гол утгыг response-д хавсаргаж, admin panel дээр шууд харагдуулна (log өгсөн байсан ч дэлгэц дээрээс шалгах боломжтой байх зорилготой)
const formatErrorDetail = (err) => {
  if (err.code) return `[${err.code}] ${err.meta ? JSON.stringify(err.meta) : err.message}`;
  return err.message || String(err);
};

const setupRoutes = (routePath, model, options = {}) => {
  const checkAccess = async (req, res, next) => {
    try {
      if (req.user.role === 'SUPER_ADMIN') return next();
      if (routePath === 'users') return res.status(403).json({ message: "Зөвхөн SUPER_ADMIN хэрэглэгч удирдах эрхтэй." });
      if (req.user.role === 'ADMIN') return next();
      if (req.user.role !== 'EDITOR') return res.status(403).json({ message: "Танд энэ хэсгийг удирдах эрх байхгүй байна." });

      if (routePath === 'products') {
        let category = req.body && req.body.category;
        if (!category && req.params.id) {
          const existing = await prisma.product.findUnique({ where: { id: parseInt(req.params.id) } });
          category = existing && existing.category;
        }
        const key = getProductPermissionKey(category);
        if (key && req.user.permissions && req.user.permissions[key]) return next();
        return res.status(403).json({ message: "Танд энэ бүтээгдэхүүний ангиллыг удирдах эрх байхгүй байна." });
      }

      if (routePath === 'bookings') {
        let type = req.body && req.body.type;
        if (!type && req.params.id) {
          const existing = await prisma.booking.findUnique({ where: { id: parseInt(req.params.id) } });
          type = existing && existing.type;
        }
        const key = getBookingPermissionKey(type);
        if (req.user.permissions && req.user.permissions[key]) return next();
        return res.status(403).json({ message: "Танд энэ хүсэлтийг удирдах эрх байхгүй байна." });
      }

      if (req.user.permissions && req.user.permissions[routePath]) return next();
      return res.status(403).json({ message: "Танд энэ хэсгийг удирдах эрх байхгүй байна." });
    } catch (err) {
      console.error('checkAccess error:', err);
      return res.status(500).json({ message: "Эрх шалгахад алдаа гарлаа." });
    }
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
              if (routePath === 'bookings' && decoded.role === 'EDITOR' && !decoded.permissions['sales-bookings'] && !decoded.permissions['service-bookings']) return res.sendStatus(403);
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
      if (routePath === 'bookings' && req.user && req.user.role === 'EDITOR') {
        items = items.filter(b => req.user.permissions[getBookingPermissionKey(b.type)]);
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

      // Strip ID for autoincrement models to prevent P2002 errors
      if (routePath !== 'vehicles' && data.id) {
        delete data.id;
      }

      if (model === 'user' && data.password) {
        data.password = await bcrypt.hash(data.password, 12);
      }
      const item = await prisma[model].create({ data });

      if (!options.publicPost) {
        await logActivity(req, 'CREATE', routePath, item.id, data.name || data.title || data.email || null);
      }

      if (model === 'user') {
        const { password, ...userWithoutPassword } = item;
        return res.json(userWithoutPassword);
      }
      res.json(item);
    } catch (err) {
      console.error(`POST /api/${routePath} Error:`, err.code, err.message, err.meta || '', '\n', err.stack);
      res.status(500).json({ message: "Хадгалахад алдаа гарлаа.", detail: formatErrorDetail(err) });
    }
  });

  app.put(`/api/${routePath}/:id`, authenticateToken, checkAccess, async (req, res) => {
    try {
      const id = (routePath === 'vehicles' || isNaN(req.params.id)) ? req.params.id : parseInt(req.params.id);
      const { id: _, updatedAt, createdAt, ...updateData } = req.body;

      if (model === 'user' && updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 12);
      }

      if (routePath === 'bookings' && 'contacted' in updateData) {
        updateData.contactedBy = updateData.contacted ? (req.user.name || req.user.email) : null;
      }

      const item = await prisma[model].update({ where: { id }, data: updateData });

      await logActivity(req, 'UPDATE', routePath, id, updateData.name || updateData.title || updateData.email || null);

      if (model === 'user') {
        const { password, ...userWithoutPassword } = item;
        return res.json(userWithoutPassword);
      }
      res.json(item);
    } catch (err) {
      console.error(`PUT /api/${routePath} Error:`, err.code, err.message, err.meta || '', '\n', err.stack);
      res.status(500).json({ message: "Шинэчлэхэд алдаа гарлаа.", detail: formatErrorDetail(err) });
    }
  });

  app.delete(`/api/${routePath}/:id`, authenticateToken, checkAccess, async (req, res) => {
    try {
      const id = (routePath === 'vehicles' || isNaN(req.params.id)) ? req.params.id : parseInt(req.params.id);

      // 1. Устгах гэж буй өгөгдлийг эхлээд авах
      const item = await prisma[model].findUnique({ where: { id } });
      if (!item) return res.status(404).json({ message: "Олдсонгүй" });

      // 2. Зургуудыг Supabase Storage-с устгах логик
      const deleteFile = (url) => {
        if (!url || typeof url !== 'string' || !url.includes(`/storage/v1/object/public/${SUPABASE_BUCKET}/`)) return;
        const fileName = url.split(`/storage/v1/object/public/${SUPABASE_BUCKET}/`)[1];
        supabase.storage.from(SUPABASE_BUCKET).remove([fileName])
          .then(() => console.log(`Deleted file: ${fileName}`))
          .catch((e) => console.error(`Error deleting file ${fileName}:`, e));
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

      await logActivity(req, 'DELETE', routePath, id, item.name || item.title || item.email || null);

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

// --- ACTIVITY LOG (зөвхөн SUPER_ADMIN) ---
app.get('/api/activity-logs', authenticateToken, async (req, res) => {
  if (req.user.role !== 'SUPER_ADMIN') return res.sendStatus(403);
  try {
    const logs = await prisma.activityLog.findMany({ orderBy: { createdAt: 'desc' }, take: 300 });
    res.json(logs);
  } catch (err) {
    console.error('GET /api/activity-logs Error:', err);
    res.status(500).json({ message: "Мэдээлэл авахад алдаа гарлаа." });
  }
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on ${PORT}`));
}

module.exports = app;
