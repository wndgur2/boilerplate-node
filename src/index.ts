import express, { Application } from 'express';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
import { createServer, Server as HTTPServer } from 'http';
import { config } from './config';
import { testConnection } from './config/database';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { UserHttpController } from './controllers/UserHttpController';
import { UserSocketController } from './controllers/UserSocketController';

class App {
  private app: Application;
  private httpServer: HTTPServer;
  private io: SocketIOServer;
  private port: number;

  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new SocketIOServer(this.httpServer, {
      cors: {
        origin: config.socket.corsOrigin,
        methods: ['GET', 'POST'],
      },
    });
    this.port = config.port;

    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeSocketControllers();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // CORS
    this.app.use(cors());

    // Body parser
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging
    this.app.use((req, _res, next) => {
      console.log(`${req.method} ${req.path}`);
      next();
    });
  }

  private initializeRoutes(): void {
    // Health check
    this.app.get('/health', (_req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // API routes
    const userHttpController = new UserHttpController();
    this.app.use('/api/users', userHttpController.router);

    // Add more HTTP controllers here
  }

  private initializeSocketControllers(): void {
    // Initialize socket controllers
    const userSocketController = new UserSocketController(this.io);
    userSocketController.initialize();

    // Add more socket controllers here
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Error handler
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Test database connection
      const dbConnected = await testConnection();
      if (!dbConnected) {
        console.warn('Warning: Database connection failed. Server will start but database operations will fail.');
      }

      // Start server
      this.httpServer.listen(this.port, () => {
        console.log(`Server is running on port ${this.port}`);
        console.log(`HTTP server: http://localhost:${this.port}`);
        console.log(`Socket.IO server is ready`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

// Create and start the application
const app = new App();
app.start();
