# Password Vault API

A secure backend API for the Password Vault application with MongoDB and Docker support.

## Features

- **User Registration & Authentication**: Secure user registration with AES-encrypted master passwords
- **JWT Token-based Authentication**: Secure API access with JSON Web Tokens
- **Password Vault Management**: Create, read, update, and delete encrypted account credentials
- **AES Encryption**: Master passwords encrypted with AES and stored in Base64 format
- **SHA1 Key Derivation**: Account passwords encrypted using SHA1 hash of master password as key
- **MongoDB Integration**: Persistent data storage with MongoDB
- **Docker Support**: Easy deployment with Docker Compose

## Security Architecture

### Master Password Security
- Master passwords are encrypted using AES encryption
- Encrypted passwords are stored in Base64 format
- Secret key for master password encryption is stored in environment variables

### Account Password Security
- Account passwords are encrypted using AES encryption
- Encryption key is derived from SHA1 hash of the user's master password
- Each user's data is isolated and requires their master password for decryption

### Authentication Flow
1. User registers with username and master password
2. Master password is AES encrypted and stored in Base64 format
3. User logs in with credentials
4. System decrypts stored master password and compares with input
5. JWT token is issued upon successful authentication
6. Protected routes require valid JWT token

## Quick Start

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- npm or yarn

### Installation

1. **Clone and navigate to the API directory**
   ```powershell
   cd password-vault-api
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

3. **Start MongoDB with Docker**
   ```powershell
   npm run docker:up
   ```

4. **Start the development server**
   ```powershell
   npm run dev
   ```

5. **API will be available at**
   ```
   http://localhost:3000
   ```

### Environment Variables

Create a `.env` file with the following variables:

```env
NODE_ENV=development
MONGODB_URI=mongodb://admin:password123@localhost:27017/password_vault?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
API_PORT=3000
```

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "user123",
  "masterPassword": "secure-master-password"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "user123",
  "masterPassword": "secure-master-password"
}
```

#### Verify Token
```http
GET /api/auth/verify
Authorization: Bearer <jwt-token>
```

### Account Management

#### Create Account
```http
POST /api/accounts
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "username": "john.doe@email.com",
  "password": "account-password",
  "comment": "Email account",
  "masterPassword": "secure-master-password"
}
```

#### List All Accounts (with decrypted passwords)
```http
POST /api/accounts/list
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "masterPassword": "secure-master-password"
}
```

#### Get Specific Account
```http
POST /api/accounts/:accountId
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "masterPassword": "secure-master-password"
}
```

#### Update Account
```http
PUT /api/accounts/:accountId
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "username": "updated.email@example.com",
  "password": "new-password",
  "comment": "Updated comment",
  "masterPassword": "secure-master-password"
}
```

#### Delete Account
```http
DELETE /api/accounts/:accountId
Authorization: Bearer <jwt-token>
```

#### Get Account Statistics
```http
GET /api/accounts/stats
Authorization: Bearer <jwt-token>
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique),
  masterPasswordHash: String (Base64 AES encrypted),
  createdAt: Date,
  updatedAt: Date
}
```

### Accounts Collection
```javascript
{
  _id: ObjectId,
  accountId: String (unique),
  userId: ObjectId (ref: User),
  username: String,
  encryptedPassword: String (Base64 AES encrypted with SHA1 key),
  comment: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## Docker Commands

```powershell
# Start all services
npm run docker:up

# Stop all services
npm run docker:down

# View logs
npm run docker:logs

# Build and start in production mode
docker-compose up --build -d
```

## Development

```powershell
# Start development server with auto-reload
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start
```

## Security Considerations

1. **Change Default Credentials**: Update MongoDB and JWT secrets in production
2. **HTTPS Only**: Use HTTPS in production environments
3. **Rate Limiting**: API includes rate limiting (100 requests per 15 minutes per IP)
4. **Input Validation**: All inputs are validated using Joi schemas
5. **Error Handling**: Detailed errors are only shown in development mode
6. **CORS Configuration**: Configure CORS for your frontend domain in production

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid credentials/token)
- `404`: Not Found
- `409`: Conflict (duplicate username)
- `500`: Internal Server Error

## Notes
readmen generated with chat gpt
used chatgpt to create bulk, refined and looked over by myself

## Development Notes

### Documentation
- **Initial Documentation**: Generated using ChatGPT for comprehensive API coverage
- **Manual Refinement**: All content reviewed, refined, and verified by the development team
- **Accuracy**: Code examples and API endpoints tested and validated

### AI-Assisted Development
This project utilized AI assistance for:
- Initial API documentation structure
- Boilerplate code generation
- Security best practices recommendations
- Error handling patterns

All AI-generated content has been thoroughly reviewed, tested, and customized to meet project requirements.

### Contributing
When contributing to this project:
1. Test all API endpoints before documenting changes
2. Update both code and documentation simultaneously
3. Verify security implementations match documented behavior
4. Maintain consistency with existing code patterns

