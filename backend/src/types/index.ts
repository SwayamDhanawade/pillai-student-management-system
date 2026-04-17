export interface Student {
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
}

export interface CreateStudentData {
  name: string;
  course: string;
  year: number;
  dateOfBirth: Date;
  email: string;
  mobileNumber: string;
  gender: string;
  address: string;
}

export interface UpdateStudentData {
  name?: string;
  course?: string;
  year?: number;
  dateOfBirth?: Date;
  email?: string;
  mobileNumber?: string;
  gender?: string;
  address?: string;
  photoUrl?: string | null;
}

export interface StudentResponse {
  id: number;
  admissionNumber: string;
  name: string;
  course: string;
  year: number;
  dateOfBirth: string;
  email: string;
  mobileNumber: string;
  gender: string;
  address: string;
  photoUrl: string | null;
  thumbnailUrl: string | null;
  createdAt: string;
  updatedAt: string;
}