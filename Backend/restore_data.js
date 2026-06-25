const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const qVehicles = [
    {
      name: 'Land Cruiser 300',
      price: '315,000,000',
      image: '/src/assets/toyota-q/hero.jpg',
      year: '2022 он',
      mileage: '24,500 км',
      engine: '3.3L Diesel',
      description: 'Toyota-Q Баталгаат хуучин автомашин'
    },
    {
      name: 'Land Cruiser Prado 150',
      price: '185,000,000',
      image: '/src/assets/toyota-q/prado150.jpeg',
      year: '2021 он',
      mileage: '42,000 км',
      engine: '2.8L Diesel',
      description: 'Toyota-Q Баталгаат хуучин автомашин'
    },
    {
      name: 'Rav 4',
      price: '118,000,000',
      image: '/src/assets/toyota-q/rav4.jpg',
      year: '2023 он',
      mileage: '12,000 км',
      engine: '2.4L Hybrid',
      description: 'Toyota-Q Баталгаат хуучин автомашин'
    }
  ];

  for (const v of qVehicles) {
    await prisma.toyotaQ.create({ data: v });
  }

  console.log('Toyota-Q өгөгдөл амжилттай сэргээгдлээ!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
