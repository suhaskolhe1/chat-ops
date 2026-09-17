import { jest } from '@jest/globals';
import request from 'supertest';

// Mock the database and redis connections so tests can run without a live DB
jest.unstable_mockModule('../src/config/db.js', () => ({
  default: { query: jest.fn() },
  query: jest.fn()
}));

jest.unstable_mockModule('../src/config/redis.js', () => ({
  client: {
    setEx: jest.fn(),
    del: jest.fn(),
    on: jest.fn(),
    connect: jest.fn()
  },
  connectRedis: jest.fn()
}));

// We must dynamically import app after setting up the mocks for ESM
const { default: app } = await import('../src/app.js');
const { default: db } = await import('../src/config/db.js');

describe('Chat Ops API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test_secret';
  });

  describe('POST /api/auth', () => {
    it('should return a token when userId is provided', async () => {
      const res = await request(app)
        .post('/api/auth')
        .send({ userId: 'alice' });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 400 if userId is missing', async () => {
      const res = await request(app)
        .post('/api/auth')
        .send({});
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'userId is required');
    });
  });

  describe('GET /api/rooms/:id/messages', () => {
    it('should fetch messages for a given room', async () => {
      const mockMessages = [
        { id: 1, room_id: 'general', sender_id: 'alice', content: 'hello', created_at: new Date().toISOString() }
      ];
      db.query.mockResolvedValue({ rows: mockMessages });

      const res = await request(app).get('/api/rooms/general/messages');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].content).toEqual('hello');
      
      // Verify db.query was called with correct SQL and params
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT id, room_id, sender_id, content, created_at FROM messages WHERE room_id = $1'),
        ['general', 20]
      );
    });
  });
});
