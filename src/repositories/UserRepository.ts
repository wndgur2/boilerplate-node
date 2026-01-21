import { BaseRepository } from './BaseRepository';
import { User } from '../types';
import { RowDataPacket } from 'mysql2/promise';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users');
  }

  /**
   * Find a user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      `SELECT * FROM ${this.tableName} WHERE email = ?`,
      [email]
    );
    
    return rows.length > 0 ? (rows[0] as User) : null;
  }

  /**
   * Find a user by username
   */
  async findByUsername(username: string): Promise<User | null> {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      `SELECT * FROM ${this.tableName} WHERE username = ?`,
      [username]
    );
    
    return rows.length > 0 ? (rows[0] as User) : null;
  }

  /**
   * Create a new user
   */
  async createUser(username: string, email: string, password: string): Promise<number> {
    return await this.create({
      username,
      email,
      password,
    } as Partial<User>);
  }

  /**
   * Update user password
   */
  async updatePassword(id: number, newPassword: string): Promise<boolean> {
    return await this.update(id, { password: newPassword } as Partial<User>);
  }

  /**
   * Get user count
   */
  async count(): Promise<number> {
    const result = await this.query<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM ${this.tableName}`
    );
    
    return result[0].count;
  }
}
