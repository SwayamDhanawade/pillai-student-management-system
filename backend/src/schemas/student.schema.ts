import { z } from 'zod';

export const createStudentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  course: z.string().min(1, 'Course is required'),
  year: z.number().min(1, 'Year must be a positive number'),
  dateOfBirth: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, 'Invalid date of birth'),
  email: z.string().email('Invalid email format'),
  mobileNumber: z.string().min(1, 'Mobile number is required'),
  gender: z.string().min(1, 'Gender is required'),
  address: z.string().min(1, 'Address is required'),
});

export const updateStudentSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  course: z.string().min(1, 'Course is required').optional(),
  year: z.number().min(1, 'Year must be a positive number').optional(),
  dateOfBirth: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, 'Invalid date of birth').optional(),
  email: z.string().email('Invalid email format').optional(),
  mobileNumber: z.string().min(1, 'Mobile number is required').optional(),
  gender: z.string().min(1, 'Gender is required').optional(),
  address: z.string().min(1, 'Address is required').optional(),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;