# React Native Password Vault - Complete System

A comprehensive password vault solution with secure backend API and React Native mobile application, featuring military-grade AES encryption and modern UI/UX.

## 🔐 System Overview

This project implements a complete password vault system with the following components:

- **Backend API** (`password-vault-api/`): Node.js + MongoDB + Docker
- **React Native App** (`Pasword-Vault/`): Expo + TypeScript + NativeWind

## 🛡️ Security Features

### Encryption Architecture
- **Master Password Encryption**: AES encryption with Base64 encoding
- **Account Password Security**: AES encryption using SHA1 hash of master password as key
- **JWT Authentication**: Secure token-based API access
- **No Plain Text Storage**: All sensitive data encrypted at rest

### Security Flow
1. User registers with username + master password
2. Master password encrypted with AES and stored in Base64 format
3. User authentication validates encrypted master password
4. Account passwords encrypted using SHA1(master_password) as AES key
5. JWT tokens manage secure API sessions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Expo CLI
- MongoDB (via Docker)

### 1. Backend Setup

```powershell
# Navigate to API directory
cd password-vault-api

# Install dependencies
npm install

# Start MongoDB with Docker
npm run docker:up

# Start development server
npm run dev
```

Backend will be available at `http://localhost:3000`

### 2. Frontend Setup

```powershell
# Navigate to app directory
cd Pasword-Vault

# Install dependencies
npm install

# Start Expo development server
npm start
```

Choose your platform:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator  
- Press `w` for Web Browser

## 📁 Project Structure

```
React-Native-Password-Vault/
├── password-vault-api/           # Backend API
│   ├── src/
│   │   ├── models/              # MongoDB models
│   │   ├── routes/              # API routes
│   │   ├── services/            # Business logic
│   │   ├── middleware/          # Auth & validation
│   │   └── utils/               # Utilities
│   ├── docker-compose.yml       # Docker configuration
│   └── README.md               # API documentation
│
└── Pasword-Vault/              # React Native App
    ├── src/
    │   ├── components/         # Reusable components
    │   ├── screens/           # App screens
    │   ├── services/          # API integration
    │   ├── types/             # TypeScript types
    │   └── utils/             # Helper functions
    └── README.md              # App documentation
```

## 🔧 System Architecture

### Backend Components
- **Express.js API**: RESTful endpoints for authentication and password management
- **MongoDB Database**: Document storage with user and account collections
- **Docker Container**: Isolated MongoDB instance with persistent storage
- **JWT Authentication**: Stateless token-based security
- **AES Encryption Service**: Military-grade password encryption

### Frontend Components
- **React Navigation**: Stack-based navigation with authentication flow
- **Expo SecureStore**: Hardware-backed secure storage for tokens
- **NativeWind Styling**: Tailwind CSS for consistent, responsive design
- **TypeScript**: Type safety and better development experience
- **Axios HTTP Client**: Robust API communication with interceptors

## 🔒 Security Implementation

### Master Password Handling
```typescript
// Backend encryption
const encryptedPassword = AES.encrypt(masterPassword, secretKey).toString();

// Backend validation
const decryptedPassword = AES.decrypt(encryptedPassword, secretKey).toString(enc.Utf8);
const isValid = inputPassword === decryptedPassword;
```

### Account Password Encryption
```typescript
// Encryption key derivation
const encryptionKey = SHA1(masterPassword).toString();

// Account password encryption
const encryptedAccountPassword = AES.encrypt(accountPassword, encryptionKey).toString();

// Account password decryption
const decryptedPassword = AES.decrypt(encryptedAccountPassword, encryptionKey).toString(enc.Utf8);
```

## 📱 Application Features

### User Authentication
- **Registration**: Create account with encrypted master password
- **Login**: Validate credentials and issue JWT token
- **Session Management**: Automatic token refresh and validation

### Password Vault Management
- **Create Accounts**: Add new password entries with encryption
- **View Accounts**: Display all accounts with decrypted passwords
- **Update Accounts**: Modify account details and passwords
- **Delete Accounts**: Remove accounts with confirmation
- **Password Generator**: Built-in secure password generation

### User Interface
- **Modern Design**: Clean, professional interface with Tailwind CSS
- **Responsive Layout**: Works on phones, tablets, and web
- **Dark/Light Theme**: Automatic theme detection (coming soon)
- **Accessibility**: Screen reader support and keyboard navigation

## ⚙️ Network Configuration

### Important: IP Address Setup

Before running the React Native app, you **must** configure the correct IP address in the API service file:

1. **Find your computer's IP address**:
   ```powershell
   # On Windows
   ipconfig
   
   # Look for your local network IP (usually starts with 192.168.x.x or 10.x.x.x)
   ```

2. **Update the API service file**:
   - Open `Pasword-Vault/src/services/ApiService.ts`
   - Find the `API_BASE_URL` constant:
   ```typescript
   const API_BASE_URL = 'http://192.168.50.113:3000/api';
   ```
   - Replace `192.168.50.113` with your computer's actual IP address

3. **Why this is required**:
   - React Native apps cannot use `localhost` to connect to your development server
   - The app runs on a device/emulator that needs your computer's network IP
   - Using the wrong IP will result in network connection errors

### Network Troubleshooting
- **Connection refused**: Double-check your IP address and ensure the backend is running
- **Timeout errors**: Verify firewall settings aren't blocking port 3000
- **CORS errors**: Make sure the backend CORS configuration includes your IP

## 🐳 Docker Deployment

### Development Environment
```powershell
# Start all services
cd password-vault-api
npm run docker:up

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

### Production Deployment
```powershell
# Build and start production containers
docker-compose -f docker-compose.prod.yml up --build -d
```

## 🧪 API Testing

### Using curl
```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","masterPassword":"testpass123"}'

# Login user
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","masterPassword":"testpass123"}'

# Create account
curl -X POST http://localhost:3000/api/accounts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"username":"email@example.com","password":"secret123","comment":"Email account","masterPassword":"testpass123"}'
```

### Using Postman
1. Import the API collection (coming soon)
2. Set environment variables for base URL and token
3. Test all endpoints with proper authentication

## 🔍 Troubleshooting

### Common Issues

**API Connection Failed**
- Ensure MongoDB is running: `docker ps`
- Check API logs: `npm run docker:logs`
- Verify port 3000 is available

**Authentication Errors**
- Clear app storage and re-login
- Check JWT token expiration
- Verify master password correctness

**Encryption/Decryption Errors**
- Ensure consistent master password usage
- Check for special characters in passwords
- Verify AES encryption keys

### Debug Mode
Enable detailed logging in both backend and frontend:

Backend:
```typescript
// In server.ts
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
```

Frontend:
```typescript
// In ApiService.ts
console.log('API Request:', config);
console.log('API Response:', response.data);
```

## 📊 Performance Considerations

### Backend Optimizations
- MongoDB indexing on frequently queried fields
- JWT token expiration management
- Rate limiting to prevent abuse
- Efficient encryption/decryption operations

### Frontend Optimizations
- Lazy loading of screens
- Efficient state management
- Optimized re-renders with React.memo
- Image and asset optimization

## 🚦 Development Workflow

### Backend Development
```powershell
cd password-vault-api
npm run dev          # Start with auto-reload
npm run build        # Build TypeScript
npm start           # Start production server
```

### Frontend Development
```powershell
cd Pasword-Vault
npm start           # Start Expo dev server
npm run ios         # iOS simulator
npm run android     # Android emulator
npm run web         # Web browser
```

## 🔮 Future Enhancements

### Security Improvements
- [ ] Two-factor authentication (2FA)
- [ ] Biometric authentication (Face ID, Touch ID)
- [ ] Hardware security key support
- [ ] Advanced threat detection

### Feature Additions
- [ ] Account categories and tagging
- [ ] Password sharing (encrypted)
- [ ] Breach monitoring integration
- [ ] Password strength analysis
- [ ] Export/import functionality
- [ ] Multi-vault support

### Technical Enhancements
- [ ] GraphQL API migration
- [ ] Real-time synchronization
- [ ] Offline mode support
- [ ] Enhanced caching strategies
- [ ] Automated testing suite
- [ ] CI/CD pipeline

## 📚 Documentation

- [API Documentation](./password-vault-api/README.md)
- [React Native App Documentation](./Pasword-Vault/README.md)
- Security Architecture Guide (coming soon)
- Deployment Guide (coming soon)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Implement proper error handling
- Add comprehensive logging
- Write clear commit messages
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🛟 Support

For support, please:
1. Check the troubleshooting sections
2. Review the documentation
3. Create an issue on GitHub
4. Contact the development team

## ⚠️ Security Notice

This application handles sensitive password data. Please:
- Use strong master passwords
- Keep the backend secure and updated
- Never commit secrets to version control
- Regularly audit access logs
- Follow security best practices

---

**Built with ❤️ for secure password management**

## 📝 Development Notes

### Documentation
- **Initial Documentation**: Generated using ChatGPT for comprehensive coverage
- **Manual Refinement**: All content reviewed, refined, and verified by the development team
- **Accuracy**: Code examples, API endpoints, and setup instructions tested and validated

### AI-Assisted Development
This project utilized AI assistance for:
- Error handling patterns and user experience improvements
- UI/UX design patterns and component architecture

### Quality Assurance
All AI-generated content has been:
- Thoroughly reviewed and tested by developers
- Customized to meet specific project requirements
- Validated against security and performance standards
- Updated with real-world testing feedback

### Contributing Guidelines
When contributing to this project:
1. **Test thoroughly**: Verify all functionality works on both iOS and Android
2. **Update IP addresses**: Ensure ApiService.ts reflects your network configuration
3. **Document changes**: Update both code comments and README sections
4. **Security first**: Validate that encryption and authentication remain secure
5. **Maintain consistency**: Follow existing code patterns and styling conventions

### Setup Reminders
- ✅ Update IP address in `ApiService.ts` before running the app
- ✅ Start MongoDB with Docker before starting the backend
- ✅ Verify network connectivity between app and API
- ✅ Test on actual devices, not just simulators
