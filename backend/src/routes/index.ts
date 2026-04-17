import { FastifyInstance } from 'fastify';
import { studentRoutes } from './student.routes';

export async function routes(fastify: FastifyInstance) {
  fastify.get('/api/health', async (_request, reply) => {
    return reply.send({ success: true, message: 'Server is running' });
  });

  fastify.register(studentRoutes, { prefix: '/api' });
}