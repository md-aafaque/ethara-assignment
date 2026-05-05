// server/tests/task.test.ts
import request from 'supertest';
import app from '../src/app.js';

describe('Task Lifecycle Rules', () => {
  it('should reject task creation with a past due date', async () => {
    // 1. POST /api/tasks with dueDate: "2020-01-01"
    // 2. Expect 400 Bad Request
  });

  it('should restrict Members to status-only updates on assigned tasks', async () => {
    // 1. Login as MEMBER
    // 2. PATCH /api/tasks/[ID] with { title: "New Title" }
    // 3. Expect 403 Forbidden
  });
});
