import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { getDatabasePool } from '../config/database';

export abstract class BaseRepository<T> {
  protected pool: Pool;
  protected tableName: string;

  constructor(tableName: string) {
    this.pool = getDatabasePool();
    this.tableName = tableName;
  }

  /**
   * Find a record by ID
   */
  async findById(id: number): Promise<T | null> {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
    
    return rows.length > 0 ? (rows[0] as T) : null;
  }

  /**
   * Find all records
   */
  async findAll(limit: number = 100, offset: number = 0): Promise<T[]> {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      `SELECT * FROM ${this.tableName} LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    
    return rows as T[];
  }

  /**
   * Create a new record
   */
  async create(data: Partial<T>): Promise<number> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    
    const [result] = await this.pool.query<ResultSetHeader>(
      `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`,
      values
    );
    
    return result.insertId;
  }

  /**
   * Update a record by ID
   */
  async update(id: number, data: Partial<T>): Promise<boolean> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    
    const [result] = await this.pool.query<ResultSetHeader>(
      `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
    
    return result.affectedRows > 0;
  }

  /**
   * Delete a record by ID
   */
  async delete(id: number): Promise<boolean> {
    const [result] = await this.pool.query<ResultSetHeader>(
      `DELETE FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
    
    return result.affectedRows > 0;
  }

  /**
   * Execute a raw query
   */
  async query<R = RowDataPacket[]>(sql: string, params?: any[]): Promise<R> {
    const [rows] = await this.pool.query<R & RowDataPacket[]>(sql, params);
    return rows as R;
  }
}
