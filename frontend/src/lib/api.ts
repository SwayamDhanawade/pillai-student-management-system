import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_URL,
});

export interface Student {
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

export interface CreateStudentInput {
  name: string;
  course: string;
  year: number;
  dateOfBirth: string;
  email: string;
  mobileNumber: string;
  gender: string;
  address: string;
  photo?: File;
}

export interface UpdateStudentInput {
  name?: string;
  course?: string;
  year?: number;
  dateOfBirth?: string;
  email?: string;
  mobileNumber?: string;
  gender?: string;
  address?: string;
  photo?: File;
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const studentApi = {
  getAll: async (): Promise<Student[]> => {
    const response = await api.get('/api/students');
    return response.data.data;
  },

  getById: async (id: number): Promise<Student> => {
    const response = await api.get(`/api/students/${id}`);
    return response.data.data;
  },

  create: async (data: CreateStudentInput): Promise<Student> => {
    const { photo, ...rest } = data;
    
    const payload: any = { ...rest };
    if (photo) {
      payload.photoData = await fileToBase64(photo);
      payload.photoName = photo.name;
    }
    
    const response = await api.post('/api/students', payload);
    return response.data.data;
  },

  update: async (id: number, data: UpdateStudentInput): Promise<Student> => {
    const { photo, ...rest } = data;
    
    const payload: any = { ...rest };
    if (photo) {
      payload.photoData = await fileToBase64(photo);
      payload.photoName = photo.name;
    }
    
    const response = await api.put(`/api/students/${id}`, payload);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/students/${id}`);
  },
};