import { Server } from 'socket.io';
import { BaseSocketController } from './BaseSocketController';
import { UserService } from '../services/UserService';
import { SocketClient, User } from '../types';

export class UserSocketController extends BaseSocketController {
  private userService: UserService;

  constructor(io: Server) {
    super(io);
    this.userService = new UserService();
  }

  /**
   * Initialize socket event handlers
   */
  public initialize(): void {
    this.io.on('connection', (socket: SocketClient) => {
      this.handleConnection(socket);
      
      socket.on('disconnect', () => {
        this.handleDisconnection(socket);
      });
    });
  }

  /**
   * Register user-specific socket events
   */
  protected registerEvents(socket: SocketClient): void {
    // Get user by ID
    socket.on('user:get', async (data: { id: number }, callback) => {
      try {
        const user = await this.userService.getUserById(data.id);
        callback({ success: true, data: user });
      } catch (error) {
        callback({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    });

    // Get all users
    socket.on('user:getAll', async (data: { limit?: number; offset?: number }, callback) => {
      try {
        const users = await this.userService.getAllUsers(data.limit, data.offset);
        callback({ success: true, data: users });
      } catch (error) {
        callback({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    });

    // Create user
    socket.on('user:create', async (data: { username: string; email: string; password: string }, callback) => {
      try {
        const user = await this.userService.createUser(data.username, data.email, data.password);
        
        // Broadcast to all clients that a new user was created
        this.broadcastFrom(socket, 'user:created', { user });
        
        callback({ success: true, data: user });
      } catch (error) {
        callback({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    });

    // Update user
    socket.on('user:update', async (data: { id: number; updates: Partial<User> }, callback) => {
      try {
        const user = await this.userService.updateUser(data.id, data.updates);
        
        // Broadcast to all clients that a user was updated
        this.broadcastFrom(socket, 'user:updated', { user });
        
        callback({ success: true, data: user });
      } catch (error) {
        callback({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    });

    // Delete user
    socket.on('user:delete', async (data: { id: number }, callback) => {
      try {
        await this.userService.deleteUser(data.id);
        
        // Broadcast to all clients that a user was deleted
        this.broadcastFrom(socket, 'user:deleted', { id: data.id });
        
        callback({ success: true });
      } catch (error) {
        callback({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    });

    // Get user count
    socket.on('user:count', async (callback) => {
      try {
        const count = await this.userService.getUserCount();
        callback({ success: true, data: { count } });
      } catch (error) {
        callback({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    });
  }
}
