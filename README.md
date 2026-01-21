# Node.js TypeScript Boilerplate

A production-ready boilerplate for building Node.js servers with TypeScript, featuring a clean layered architecture with Controller, Service, and Repository patterns.

## Features

- **TypeScript**: Fully typed codebase for better development experience
- **Layered Architecture**: Separation of concerns with Controller, Service, and Repository layers
- **Dual Communication**: Support for both HTTP (Express) and WebSocket (Socket.IO) communication
- **MySQL Integration**: Database operations with mysql2 library, primarily in the Repository layer
- **Error Handling**: Centralized error handling middleware
- **Environment Configuration**: Environment-based configuration with dotenv
- **Development Tools**: Hot reload with ts-node-dev, linting with ESLint

## Architecture

### Layer Structure

```
src/
├── controllers/       # HTTP & Socket controllers (handle requests/responses)
│   ├── BaseHttpController.ts
│   ├── BaseSocketController.ts
│   ├── UserHttpController.ts
│   └── UserSocketController.ts
├── services/         # Business logic layer
│   ├── BaseService.ts
│   └── UserService.ts
├── repositories/     # Database communication layer
│   ├── BaseRepository.ts
│   └── UserRepository.ts
├── config/          # Configuration files
│   ├── index.ts
│   └── database.ts
├── middleware/      # Express middleware
│   └── errorHandler.ts
├── types/          # TypeScript type definitions
│   └── index.ts
├── utils/          # Utility functions
│   └── helpers.ts
└── index.ts        # Application entry point
```

### Layer Responsibilities

- **Controller Layer**: Handles HTTP requests and Socket.IO events, validates input, and returns responses
- **Service Layer**: Implements business logic, orchestrates operations between controllers and repositories
- **Repository Layer**: Manages database operations and communicates with MySQL

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd boilerplate-node
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database:
```bash
# Create the database and tables using the provided schema
mysql -u root -p < schema.sql
```

### Configuration

Edit `.env` file with your settings:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=boilerplate_db

# Socket.IO Configuration
SOCKET_CORS_ORIGIN=http://localhost:3000
```

## Usage

### Development

Start the development server with hot reload:

```bash
npm run dev
```

### Production

Build the TypeScript code:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### Linting

Run ESLint:

```bash
npm run lint
```

Fix linting issues:

```bash
npm run lint:fix
```

## API Documentation

### HTTP Endpoints

#### Health Check
- `GET /health` - Check server status

#### Users
- `GET /api/users` - Get all users (supports `limit` and `offset` query params)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats/count` - Get user count

#### Example Request (Create User)
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","email":"john@example.com","password":"password123"}'
```

### Socket.IO Events

#### User Events
- `user:get` - Get user by ID
- `user:getAll` - Get all users
- `user:create` - Create a new user
- `user:update` - Update user
- `user:delete` - Delete user
- `user:count` - Get user count

#### Broadcast Events (server to clients)
- `user:created` - Emitted when a new user is created
- `user:updated` - Emitted when a user is updated
- `user:deleted` - Emitted when a user is deleted

#### Example Socket.IO Client Usage
```javascript
const socket = io('http://localhost:3000');

// Get all users
socket.emit('user:getAll', { limit: 10, offset: 0 }, (response) => {
  console.log(response);
});

// Create user
socket.emit('user:create', {
  username: 'john_doe',
  email: 'john@example.com',
  password: 'password123'
}, (response) => {
  console.log(response);
});

// Listen for broadcasts
socket.on('user:created', (data) => {
  console.log('New user created:', data.user);
});
```

## Extending the Boilerplate

### Adding a New Entity

1. **Define the Type** (in `src/types/index.ts`):
```typescript
export interface Product extends BaseEntity {
  name: string;
  price: number;
}
```

2. **Create Repository** (in `src/repositories/ProductRepository.ts`):
```typescript
export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super('products');
  }
  
  // Add custom database methods here
}
```

3. **Create Service** (in `src/services/ProductService.ts`):
```typescript
export class ProductService extends BaseService {
  private productRepository: ProductRepository;
  
  constructor() {
    super();
    this.productRepository = new ProductRepository();
  }
  
  // Add business logic methods here
}
```

4. **Create Controllers** (HTTP and/or Socket):
```typescript
// src/controllers/ProductHttpController.ts
export class ProductHttpController extends BaseHttpController {
  // Add HTTP routes
}

// src/controllers/ProductSocketController.ts
export class ProductSocketController extends BaseSocketController {
  // Add Socket.IO events
}
```

5. **Register in Main App** (in `src/index.ts`):
```typescript
// HTTP
const productHttpController = new ProductHttpController();
this.app.use('/api/products', productHttpController.router);

// Socket.IO
const productSocketController = new ProductSocketController(this.io);
productSocketController.initialize();
```

## Project Structure Best Practices

- Keep business logic in the Service layer
- Keep database queries in the Repository layer
- Controllers should be thin - just validate input and call services
- Use TypeScript interfaces for type safety
- Handle errors gracefully with try-catch and error middleware
- Use environment variables for configuration
- Follow consistent naming conventions

## Technologies Used

- **Express**: Web framework for HTTP endpoints
- **Socket.IO**: Real-time bidirectional communication
- **MySQL2**: MySQL database driver with Promise support
- **TypeScript**: Type-safe JavaScript
- **dotenv**: Environment variable management
- **ESLint**: Code linting and quality
- **ts-node-dev**: Development server with hot reload

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.