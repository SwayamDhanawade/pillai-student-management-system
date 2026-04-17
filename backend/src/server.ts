import 'dotenv/config';
import { buildApp } from './app';

const start = async () => {
  try {
    const app = await buildApp();
    const port = process.env.PORT || 5000;

    await app.listen({ port: Number(port), host: '0.0.0.0' });
    console.log(`Server running on http://localhost:${port}`);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();