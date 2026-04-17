import Fastify, { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import { routes } from './routes';
import path from 'path';

export async function buildApp() {
  const fastify = Fastify({
    logger: true,
    serializerOpts: {
      largeArrayBuffers: 1024 * 1024,
    },
  });

  await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN?.split(',').map(o => o.trim()) || ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  });

  await fastify.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });

  const publicPath = path.join(process.cwd(), 'public');
  console.log('Serving static files from:', publicPath);

  await fastify.register(fastifyStatic, {
    root: publicPath,
    prefix: '/uploads/',
  });

  fastify.setErrorHandler(
    (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
      request.log.error(error);

      if (error.validation) {
        return reply.status(400).send({
          success: false,
          message: 'Validation error',
          errors: error.validation,
        });
      }

      return reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  );

  await fastify.register(routes);

  return fastify;
}