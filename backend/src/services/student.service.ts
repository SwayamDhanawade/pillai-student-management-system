import { prisma } from '../lib/prisma';
import { generateAdmissionNumber } from '../utils/generateAdmissionNumber';
import { CreateStudentData, UpdateStudentData, StudentResponse } from '../types';

function toResponse(student: {
  id: number;
  admissionNumber: string;
  name: string;
  course: string;
  year: number;
  dateOfBirth: Date;
  email: string;
  mobileNumber: string;
  gender: string;
  address: string;
  photoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}): StudentResponse {
  const thumbnailUrl = student.photoUrl 
    ? student.photoUrl.replace('/uploads/', '/thumbnails/') 
    : null;
  
  return {
    ...student,
    dateOfBirth: student.dateOfBirth.toISOString(),
    createdAt: student.createdAt.toISOString(),
    updatedAt: student.updatedAt.toISOString(),
    thumbnailUrl,
  };
}

export async function getAllStudents(): Promise<StudentResponse[]> {
  const students = await prisma.student.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return students.map(toResponse);
}

export async function getStudentById(id: number): Promise<StudentResponse | null> {
  const student = await prisma.student.findUnique({
    where: { id },
  });
  return student ? toResponse(student) : null;
}

export async function createStudent(data: CreateStudentData & { photoUrl?: string | null }): Promise<StudentResponse> {
  const admissionNumber = await generateAdmissionNumber();

  const student = await prisma.student.create({
    data: {
      ...data,
      admissionNumber,
      photoUrl: data.photoUrl || null,
    },
  });

  return toResponse(student);
}

export async function updateStudent(id: number, data: UpdateStudentData): Promise<StudentResponse | null> {
  const student = await prisma.student.update({
    where: { id },
    data,
  });
  return toResponse(student);
}

export async function deleteStudent(id: number): Promise<boolean> {
  await prisma.student.delete({
    where: { id },
  });
  return true;
}