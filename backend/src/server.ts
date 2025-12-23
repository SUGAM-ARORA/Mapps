import dotenv from 'dotenv';
import { createServer } from './setup';

dotenv.config();

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

async function bootstrap() {
  const app = await createServer();
  
  // Listen on all interfaces (0.0.0.0) so mobile devices can connect
  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 API running on http://localhost:${port}`);
    console.log(`📱 Mobile devices can connect to: http://192.168.29.253:${port}`);
    console.log(`🏥 Health check: http://localhost:${port}/health`);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal startup error', err);
  process.exit(1);
});