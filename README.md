# Toyota Top Motors - Web Project

Toyota Top Motors Mongolia-д зориулсан автомашин танилцуулга, захиалгын иж бүрэн вэб систем.

## 🚀 Онцлох боломжууд

- **Автомашин танилцуулга**: Загвар бүрийн дэлгэрэнгүй мэдээлэл, 360° эргэлттэй зураг, салон 360° панорама харагдац.
- **Захиалгын систем**: 
  - Шинэ автомашин захиалах хүсэлт (Урьдчилгаа, төлбөрийн нөхцөл сонгох).
  - Тест драйв (Туршилтын жолоодлого) захиалах.
  - Засвар үйлчилгээний цаг авах.
- **Calculator**: Лизингийн тооцоолуур (Leasing Calculator).
- **Мэдээ мэдээлэл**: Хамгийн сүүлийн үеийн мэдээ, онцлох үйл явдлууд.
- **Админ панель**: Бүх мэдээлэл, захиалгыг удирдах бүрэн боломжтой систем.

## 🛠 Технологийн стек

### Frontend
- **React** (Vite)
- **Tailwind CSS** (Design)
- **Framer Motion** (Animations)
- **Lucide React** (Icons)
- **Pannellum** (360 Panorama)

### Backend
- **Node.js** & **Express**
- **Prisma ORM**
- **SQLite** (Database)
- **JWT** (Authentication)
- **Multer** (File Upload)

## 📦 Суулгах заавар

1. Төслийг татаж авах:
   ```bash
   git clone [repository-url]
   ```

2. Backend тохиргоо:
   ```bash
   cd Backend
   npm install
   # .env файл үүсгэж IP болон JWT_SECRET-ээ тохируулна
   npx prisma db push
   npm start
   ```

3. Frontend тохиргоо:
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

## 📝 Тэмдэглэл
Төсөл одоогоор хөгжүүлэлтийн шатанд байгаа бөгөөд дотоод сүлжээнд ашиглахаар тохируулагдсан.
