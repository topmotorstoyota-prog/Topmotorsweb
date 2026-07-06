const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@toyota.mn' },
    update: {
      role: 'SUPER_ADMIN',
      canManageVehicles: true,
      canManageNews: true,
      canManageProducts: true,
      canManageToyotaQ: true,
      canManageBookings: true,
      canManageFAQ: true
    },
    create: {
      email: 'admin@toyota.mn',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      canManageVehicles: true,
      canManageNews: true,
      canManageProducts: true,
      canManageToyotaQ: true,
      canManageBookings: true,
      canManageFAQ: true
    },
  });

  console.log('Super Admin амжилттай бэлэн боллоо:', superAdmin.email);

  // FAQ Seed Data - Хуучин өгөгдлийг цэвэрлэж шинээр оруулах
  await prisma.faq.deleteMany({});

  const faqs = [
    // 1. Худалдан авалт болон Автомашинууд
    {
      category: 'Худалдан авалт болон Автомашинууд',
      question: 'Туршилтын жолоодлого (Test Drive) хийхэд төлбөртэй юу?',
      answer: 'Үгүй, туршилтын жолоодлого бүрэн үнэ төлбөргүй. Та вэб сайтаар болон утсаар цаг захиалан ирж сонирхсон загвараа унаж үзэх боломжтой.',
      order: 1
    },
    {
      category: 'Худалдан авалт болон Автомашинууд',
      question: 'Шинэ автомашин захиалахад хэр хугацаа шаардлагатай вэ?',
      answer: 'Хэрэв таны хүссэн өнгө, тоноглолтой автомашин бэлэн байхгүй бол захиалгаар 2-4 сарын хугацаанд ирдэг.',
      order: 2
    },
    // 2. Засвар үйлчилгээ
    {
      category: 'Засвар үйлчилгээ',
      question: 'Засварын цаг хэрхэн захиалах вэ?',
      answer: 'Та манай вэб сайтын "Цаг захиалга" хэсгээр эсвэл манай дугаараар холбогдож цаг авах боломжтой.',
      order: 1
    },
    {
      category: 'Засвар үйлчилгээ',
      question: 'Компьютер оношилгоо хэдэн төгрөг байдаг вэ?',
      answer: 'Toyota-ийн зориулалтын багажаар хийгдэх иж бүрэн оношилгоо [Үнэ] төгрөг байдаг. Энэ нь автомашины бүх цахилгаан болон механик эд ангийг шалгадаг.',
      order: 2
    },
    // 3. Сэлбэг хэрэгсэл
    {
      category: 'Сэлбэг хэрэгсэл',
      question: 'Оригнал сэлбэг захиалж болох уу?',
      answer: 'Тийм ээ, бид бүх төрлийн Toyota автомашины оригинал сэлбэгийг үйлдвэрээс нь албан ёсны эрхтэйгээр нийлүүлдэг.',
      order: 1
    },
    {
      category: 'Сэлбэг хэрэгсэл',
      question: 'Дагалдах хэрэгсэл (Accessories) худалдаалдаг уу?',
      answer: 'Тийм ээ, шалавч, ачаа, нэмэлт гэрэл зэрэг Toyota-ийн албан ёсны бүх төрлийн дагалдах хэрэгсэл бэлэн болон захиалгаар байгаа.',
      order: 2
    },
    // 4. Санхүүжилт болон Лизинг
    {
      category: 'Санхүүжилт болон Лизинг',
      question: 'Ямар банкуудтай хамтран ажилладаг вэ?',
      answer: 'Бид Монголын бүх томоохон арилжааны банкууд болон ББСБ-уудтай хамтран ажилладаг.',
      order: 1
    },
    {
      category: 'Санхүүжилт болон Лизинг',
      question: 'Лизингээр авахад бүрдүүлэх материал юу вэ?',
      answer: 'Иргэний үнэмлэх, орлого нотлох баримтууд (нийгмийн даатгал, дансны хуулга эсвэл бизнесийн орлого) шаардлагатай.',
      order: 2
    },
    // 5. Баталгаат хугацаа
    {
      category: 'Баталгаат хугацаа',
      question: 'Албан ёсны баталгаа юуг хамардаг вэ?',
      answer: 'Манайхаас авсан шинэ автомашинд 3 жил буюу 100,000 км-ийн (аль түрүүнд болсонд нь) үйлдвэрийн баталгаа өгдөг. Энэ нь хөдөлгүүр, хурдны хайрцаг зэрэг үндсэн эд ангийг хамарна.',
      order: 1
    },
    {
      category: 'Баталгаат хугацаа',
      question: 'Hybrid батерейны баталгаа хэдэн жил байдаг вэ?',
      answer: 'Hybrid системийн гол эд анги болох батерейнд [Хугацаа] буюу [КМ]-ийн тусгай баталгаа олгодог.',
      order: 2
    },
    // 6. Toyota Q (Used Cars)
    {
      category: 'Toyota Q (Used Cars)',
      question: 'Toyota Q гэж юу вэ?',
      answer: 'Энэ нь Toyota-ийн стандартаар 145 цэгээр нарийн шалгагдсан, баталгаат хуучин автомашин худалдаалах үйлчилгээ юм.',
      order: 1
    },
    {
      category: 'Toyota Q (Used Cars)',
      question: 'Хуучин автомашинаа шинээр сольж (Trade-in) болох уу?',
      answer: 'Тийм ээ, та өөрийн эзэмшиж буй Toyota автомашинаа зах зээлийн үнээр үнэлүүлэн Toyota Q үйлчилгээгээр дамжуулан шинэ автомашины урьдчилгаа болгон ашиглах боломжтой.',
      order: 2
    }
  ];

  for (const faq of faqs) {
    await prisma.faq.create({
      data: faq
    });
  }
  console.log('FAQ өгөгдлүүд амжилттай шинэчлэгдлээ (Хуучин өгөгдлийг устгасан).');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
