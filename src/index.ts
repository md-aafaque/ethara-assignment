import 'dotenv/config';
import app from './app.js';
import { prisma } from './lib/prisma.js';

const PORT = process.env.PORT || 4000;
async function main() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to the database');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
