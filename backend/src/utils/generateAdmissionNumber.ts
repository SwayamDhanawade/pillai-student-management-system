import { prisma } from '../lib/prisma';

export async function generateAdmissionNumber(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = `ADM${currentYear}`;
  const maxRetries = 10;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const lastStudent = await prisma.student.findFirst({
      where: {
        admissionNumber: {
          startsWith: prefix,
        },
      },
      orderBy: { admissionNumber: 'desc' },
    });

    let nextNum = 1;
    if (lastStudent) {
      const lastNum = parseInt(lastStudent.admissionNumber.slice(-5));
      nextNum = lastNum + 1;
    }

    const admissionNumber = `${prefix}${nextNum.toString().padStart(5, '0')}`;

    const existing = await prisma.student.findUnique({
      where: { admissionNumber },
    });

    if (!existing) {
      return admissionNumber;
    }
  }

  throw new Error('Failed to generate unique admission number after maximum retries');
}