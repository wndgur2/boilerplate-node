import { BaseService } from './BaseService';
import { UserRepository } from '../repositories/UserRepository';
import { User, AppError } from '../types';

export class UserService extends BaseService {
  private userRepository: UserRepository;

  constructor() {
    super();
    this.userRepository = new UserRepository();
  }

  /**
   * Get a user by ID
   */
  async getUserById(id: number): Promise<User> {
    this.logInfo(`Getting user with ID: ${id}`);
    
    const user = await this.userRepository.findById(id);
    
    if (!user) {
      throw new AppError(`User with ID ${id} not found`, 404);
    }
    
    return user;
  }

  /**
   * Get all users
   */
  async getAllUsers(limit: number = 100, offset: number = 0): Promise<User[]> {
    this.logInfo(`Getting all users (limit: ${limit}, offset: ${offset})`);
    return await this.userRepository.findAll(limit, offset);
  }

  /**
   * Create a new user
   */
  async createUser(username: string, email: string, password: string): Promise<User> {
    this.logInfo(`Creating new user: ${username}`);
    
    // Check if user already exists
    const existingUserByEmail = await this.userRepository.findByEmail(email);
    if (existingUserByEmail) {
      throw new AppError('User with this email already exists', 400);
    }
    
    const existingUserByUsername = await this.userRepository.findByUsername(username);
    if (existingUserByUsername) {
      throw new AppError('User with this username already exists', 400);
    }
    
    // TODO: In production, hash the password using bcrypt or similar
    // Example: const hashedPassword = await bcrypt.hash(password, 10);
    // For now, storing plain text password (NOT SECURE - for demo purposes only)
    const userId = await this.userRepository.createUser(username, email, password);
    
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('Failed to create user', 500);
    }
    
    return user;
  }

  /**
   * Update a user
   */
  async updateUser(id: number, data: Partial<User>): Promise<User> {
    this.logInfo(`Updating user with ID: ${id}`);
    
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError(`User with ID ${id} not found`, 404);
    }
    
    const updated = await this.userRepository.update(id, data);
    if (!updated) {
      throw new AppError('Failed to update user', 500);
    }
    
    const updatedUser = await this.userRepository.findById(id);
    if (!updatedUser) {
      throw new AppError('Failed to retrieve updated user', 500);
    }
    
    return updatedUser;
  }

  /**
   * Delete a user
   */
  async deleteUser(id: number): Promise<void> {
    this.logInfo(`Deleting user with ID: ${id}`);
    
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError(`User with ID ${id} not found`, 404);
    }
    
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new AppError('Failed to delete user', 500);
    }
  }

  /**
   * Get user count
   */
  async getUserCount(): Promise<number> {
    this.logInfo('Getting user count');
    return await this.userRepository.count();
  }
}
