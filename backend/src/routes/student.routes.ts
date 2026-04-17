import { FastifyInstance } from 'fastify';
import * as studentController from '../controllers/student.controller';

export async function studentRoutes(fastify: FastifyInstance) {
  fastify.get('/students', studentController.getAllStudents);
  fastify.get('/students/:id', studentController.getStudentById);
  fastify.post('/students', studentController.createStudent);
  fastify.put('/students/:id', studentController.updateStudent);
  fastify.delete('/students/:id', studentController.deleteStudent);
}