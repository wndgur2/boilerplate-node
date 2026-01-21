import { Router, Request, Response } from 'express';
import { BaseHttpController } from './BaseHttpController';
import { UserService } from '../services/UserService';

export class UserHttpController extends BaseHttpController {
  public router: Router;
  private userService: UserService;

  constructor() {
    super();
    this.router = Router();
    this.userService = new UserService();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Note: Place specific routes before parameterized routes
    this.router.get('/stats/count', this.asyncHandler(this.getUserCount.bind(this)));
    this.router.get('/', this.asyncHandler(this.getAllUsers.bind(this)));
    this.router.get('/:id', this.asyncHandler(this.getUserById.bind(this)));
    this.router.post('/', this.asyncHandler(this.createUser.bind(this)));
    this.router.put('/:id', this.asyncHandler(this.updateUser.bind(this)));
    this.router.delete('/:id', this.asyncHandler(this.deleteUser.bind(this)));
  }

  /**
   * GET /users - Get all users
   */
  private async getAllUsers(req: Request, res: Response): Promise<void> {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;
    
    const users = await this.userService.getAllUsers(limit, offset);
    this.sendSuccess(res, users, 'Users retrieved successfully');
  }

  /**
   * GET /users/:id - Get user by ID
   */
  private async getUserById(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);
    const user = await this.userService.getUserById(id);
    this.sendSuccess(res, user, 'User retrieved successfully');
  }

  /**
   * POST /users - Create a new user
   */
  private async createUser(req: Request, res: Response): Promise<void> {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      this.sendError(res, 'Username, email, and password are required', 400);
      return;
    }
    
    const user = await this.userService.createUser(username, email, password);
    this.sendSuccess(res, user, 'User created successfully', 201);
  }

  /**
   * PUT /users/:id - Update a user
   */
  private async updateUser(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);
    const updates = req.body;
    
    const user = await this.userService.updateUser(id, updates);
    this.sendSuccess(res, user, 'User updated successfully');
  }

  /**
   * DELETE /users/:id - Delete a user
   */
  private async deleteUser(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);
    await this.userService.deleteUser(id);
    this.sendSuccess(res, null, 'User deleted successfully');
  }

  /**
   * GET /users/stats/count - Get user count
   */
  private async getUserCount(_req: Request, res: Response): Promise<void> {
    const count = await this.userService.getUserCount();
    this.sendSuccess(res, { count }, 'User count retrieved successfully');
  }
}
