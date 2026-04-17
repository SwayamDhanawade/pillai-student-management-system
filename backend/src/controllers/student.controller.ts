import { FastifyReply, FastifyRequest } from 'fastify';
import * as studentService from '../services/student.service';
import { createStudentSchema, updateStudentSchema, CreateStudentInput, UpdateStudentInput } from '../schemas/student.schema';
import { saveBase64File, deleteFile } from '../utils/fileUpload';

export async function getAllStudents(
  _request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const students = await studentService.getAllStudents();
    return reply.send({ success: true, data: students });
  } catch (error) {
    console.error('Error fetching students:', error);
    return reply.status(500).send({ success: false, message: 'Failed to fetch students' });
  }
}

export async function getStudentById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const id = parseInt(request.params.id);
    if (isNaN(id)) {
      return reply.status(400).send({ success: false, message: 'Invalid student ID' });
    }
    const student = await studentService.getStudentById(id);
    if (!student) {
      return reply.status(404).send({ success: false, message: 'Student not found' });
    }
    return reply.send({ success: true, data: student });
  } catch (error) {
    console.error('Error fetching student:', error);
    return reply.status(500).send({ success: false, message: 'Failed to fetch student' });
  }
}

export async function createStudent(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const body = request.body as any;
    let photoUrl: string | null = null;

    if (body.photoData && body.photoName) {
      photoUrl = await saveBase64File(body.photoData, body.photoName);
    }

    const fields = { ...body };
    delete fields.photoData;
    delete fields.photoName;

    const validation = createStudentSchema.safeParse(fields);
    
    if (!validation.success) {
      return reply.status(400).send({
        success: false,
        message: 'Validation failed',
        errors: validation.error.errors,
      });
    }

    const student = await studentService.createStudent({
      ...validation.data,
      dateOfBirth: new Date(validation.data.dateOfBirth),
      photoUrl,
    });
    return reply.status(201).send({ success: true, data: student });
  } catch (error) {
    console.error('Error creating student:', error);
    return reply.status(500).send({ success: false, message: 'Failed to create student' });
  }
}

export async function updateStudent(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const id = parseInt(request.params.id);
    if (isNaN(id)) {
      return reply.status(400).send({ success: false, message: 'Invalid student ID' });
    }

    const existingStudent = await studentService.getStudentById(id);
    if (!existingStudent) {
      return reply.status(404).send({ success: false, message: 'Student not found' });
    }

    const body = request.body as any;
    let newPhotoUrl: string | undefined;

    if (body.photoData && body.photoName) {
      const uploadedUrl = await saveBase64File(body.photoData, body.photoName);
      if (uploadedUrl) {
        newPhotoUrl = uploadedUrl;
      }
      if (existingStudent.photoUrl) {
        await deleteFile(existingStudent.photoUrl);
      }
    }

    const fields = { ...body };
    delete fields.photoData;
    delete fields.photoName;

    const validation = updateStudentSchema.safeParse(fields);
    
    if (!validation.success) {
      return reply.status(400).send({
        success: false,
        message: 'Validation failed',
        errors: validation.error.errors,
      });
    }

    const updateData: any = { ...validation.data };
    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    }
    if (newPhotoUrl) {
      updateData.photoUrl = newPhotoUrl;
    }

    const student = await studentService.updateStudent(id, updateData);
    return reply.send({ success: true, data: student });
  } catch (error) {
    console.error('Error updating student:', error);
    return reply.status(500).send({ success: false, message: 'Failed to update student' });
  }
}

export async function deleteStudent(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const id = parseInt(request.params.id);
    if (isNaN(id)) {
      return reply.status(400).send({ success: false, message: 'Invalid student ID' });
    }

    const existingStudent = await studentService.getStudentById(id);
    if (existingStudent?.photoUrl) {
      await deleteFile(existingStudent.photoUrl);
    }

    const deleted = await studentService.deleteStudent(id);
    if (!deleted) {
      return reply.status(404).send({ success: false, message: 'Student not found' });
    }
    return reply.send({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    return reply.status(500).send({ success: false, message: 'Failed to delete student' });
  }
}