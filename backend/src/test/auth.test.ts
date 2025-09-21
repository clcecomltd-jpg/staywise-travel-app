import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index.js';

describe('Authentication Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'TestPassword123!',
        name: 'Test User',
        user_type: 'guest'
      };

      // Mock successful user creation
      const mockUser = {
        id: 'user-123',
        email: userData.email,
        name: userData.name,
        user_type: userData.user_type,
        created_at: new Date().toISOString()
      };

      const mockSupabase = await import('../config/database.js');
      vi.mocked(mockSupabase.supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: null })
          })
        }),
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockUser, error: null })
          })
        })
      } as any);

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.tokens).toBeDefined();
    });

    it('should return error for existing email', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'TestPassword123!',
        name: 'Test User',
        user_type: 'guest'
      };

      // Mock existing user
      const mockSupabase = await import('../config/database.js');
      vi.mocked(mockSupabase.supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ 
              data: { id: 'existing-user' }, 
              error: null 
            })
          })
        })
      } as any);

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'weak'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user successfully', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'TestPassword123!'
      };

      const mockUser = {
        id: 'user-123',
        email: loginData.email,
        name: 'Test User',
        user_type: 'guest',
        password_hash: '$2a$12$hashedpassword',
        is_active: true
      };

      const mockSupabase = await import('../config/database.js');
      vi.mocked(mockSupabase.supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockUser, error: null })
            })
          })
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockUser, error: null })
            })
          })
        }),
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: {}, error: null })
          })
        })
      } as any);

      // Mock bcrypt
      vi.doMock('bcryptjs', () => ({
        compare: vi.fn().mockResolvedValue(true),
        hash: vi.fn().mockResolvedValue('hashedpassword')
      }));

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(loginData.email);
      expect(response.body.data.tokens).toBeDefined();
    });

    it('should return error for invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'WrongPassword123!'
      };

      const mockSupabase = await import('../config/database.js');
      vi.mocked(mockSupabase.supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
            })
          })
        })
      } as any);

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid email or password');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user with valid token', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        user_type: 'guest'
      };

      // Mock JWT verification and user lookup
      const mockSupabase = await import('../config/database.js');
      vi.mocked(mockSupabase.supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockUser, error: null })
            })
          })
        })
      } as any);

      // Mock JWT verification
      vi.doMock('jsonwebtoken', () => ({
        verify: vi.fn().mockReturnValue({
          user_id: 'user-123',
          email: 'test@example.com',
          user_type: 'guest',
          iat: Date.now(),
          exp: Date.now() + 3600
        })
      }));

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(mockUser.id);
    });

    it('should return error for invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('token');
    });
  });
});