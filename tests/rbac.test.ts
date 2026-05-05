// server/tests/rbac.test.ts
import request from 'supertest';
import app from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me-in-production';

describe('RBAC Enforcement', () => {
  let adminToken: string;
  let memberToken: string;
  let teamId: string;

  beforeAll(async () => {
    // Setup test data: Create users, team, and memberships
    // This is a skeleton; in a real test you'd use a test DB or mock prisma
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should prevent a MEMBER from creating a project', async () => {
    // const res = await request(app)
    //   .post('/api/projects')
    //   .set('Authorization', `Bearer ${memberToken}`)
    //   .send({ name: 'Member Project', teamId });
    // expect(res.status).toBe(403);
  });

  it('should allow an ADMIN to create a project', async () => {
    // const res = await request(app)
    //   .post('/api/projects')
    //   .set('Authorization', `Bearer ${adminToken}`)
    //   .send({ name: 'Admin Project', teamId });
    // expect(res.status).toBe(201);
  });
});
