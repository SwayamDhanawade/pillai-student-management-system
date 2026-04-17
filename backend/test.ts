import 'dotenv/config';
import { prisma } from './src/lib/prisma';

async function main() {
  try {
    const students = await prisma.student.findMany();
    console.log('Students:', students);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();