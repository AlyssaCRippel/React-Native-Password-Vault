# Complete Setup Guide - Password Vault System

This comprehensive guide will help you set up and run the complete Password Vault system on your local machine in under 10 minutes.

## 📋 Prerequisites

Before starting, ensure you have these tools installed:

| Tool | Version | Download Link | Purpose |
|------|---------|---------------|---------|
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org/) | JavaScript runtime |
| **Docker Desktop** | Latest | [docker.com](https://www.docker.com/products/docker-desktop/) | MongoDB container |
| **Expo CLI** | Latest | `npm install -g @expo/cli` | React Native development |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) | Version control |

### Verify Prerequisites
```powershell
# Check installations
node --version        # Should show v18.x.x or higher
docker --version      # Should show Docker version
expo --version        # Should show Expo CLI version
git --version         # Should show Git version
```

## 🚀 Step-by-Step Setup

### Step 1: Project Setup

```powershell
# If not already cloned
git clone <your-repo-url>
cd React-Native-Password-Vault
```

### Step 2: Backend API Configuration

```powershell
# Navigate to API directory
cd password-vault-api

# Install dependencies (if needed)
npm install

# Start MongoDB with Docker
npm run docker:up

# Wait for MongoDB to initialize (30-60 seconds)
# You should see: "MongoDB ready for connections"

# Start the API development server
npm run dev
```

**Expected Output:**
```
✅ Connected to MongoDB
🚀 Password Vault API running on port 3000
🌍 Environment: development
```

### Step 3: Network Configuration (Critical Step)

🚨 **Important**: React Native apps cannot use `localhost`. You must configure your computer's IP address.

#### Find Your IP Address:
```powershell
# Run this command and look for IPv4 Address
ipconfig

# Look for something like: 192.168.1.100 or 10.0.0.50
```

#### Update API Service File:
1. Open `Pasword-Vault/src/services/ApiService.ts`
2. Find this line:
   ```typescript
   const API_BASE_URL = 'http://192.168.50.113:3000/api';
   ```
3. Replace `192.168.50.113` with YOUR computer's IP address:
   ```typescript
   const API_BASE_URL = 'http://YOUR_IP_ADDRESS:3000/api';
   ```

#### Verify Network Configuration:
```powershell
# Test API accessibility (replace with your IP)
curl http://YOUR_IP_ADDRESS:3000/api/auth/verify

# Should return: {"valid":false} (this is expected without token)
```

### Step 4: React Native App Setup

Open a **new PowerShell window** (keep the backend running) and run:

```powershell
# Navigate to app directory
cd React-Native-Password-Vault/Pasword-Vault

# Install dependencies (if needed)
npm install

# Start Expo development server
npm start
```

### Step 5: Choose Your Platform

After running `npm start`, the Expo dev server will show QR code and options:

| Platform | Command | Requirements |
|----------|---------|--------------|
| **Web Browser** | Press `w` | ✅ Easiest for testing |
| **iOS Simulator** | Press `i` | Requires Xcode (macOS only) |
| **Android Emulator** | Press `a` | Requires Android Studio |
| **Physical Device** | Scan QR code | Install Expo Go app |

**Recommended**: Start with web browser (`w`) for initial testing.

## 🧪 Testing the Complete System

### Test 1: User Registration

1. **Open the app** in your chosen platform
2. **Navigate to registration** by clicking "Create Account" 
3. **Fill out the form**:
   ```
   Username: testuser
   Master Password: TestPassword123!
   Confirm Password: TestPassword123!
   ```
4. **Click "Create Account"**
5. **Expected result**: Successful registration and automatic login

### Test 2: Vault Access

1. **Enter master password** to unlock vault: `TestPassword123!`
2. **Click "Unlock Vault"**
3. **Expected result**: Dashboard loads showing "Your Vault is Empty"

### Test 3: Password Management

1. **Click "Add Account"** from dashboard
2. **Fill out account details**:
   ```
   Account Username: john.doe@gmail.com
   Password: [Click "Generate" for secure password]
   Comment: Personal Email Account
   ```
3. **Click "Create Account"**
4. **Expected result**: Return to dashboard showing the new account
5. **Verify**: Password should be visible and copyable

### Test 4: Data Persistence

1. **Click "Lock" vault** to require master password again
2. **Re-enter master password** and unlock
3. **Expected result**: Your saved account should still be there

## ✅ System Verification Checklist

Copy and check off each item as you verify:

### Backend Verification
- [ ] MongoDB container running (`docker ps` shows mongodb container)
- [ ] API server responding (`http://YOUR_IP:3000` accessible)
- [ ] Database connection successful (no errors in backend console)
- [ ] API endpoints functional (registration/login working)

### Frontend Verification  
- [ ] Expo dev server running without errors
- [ ] App loads on chosen platform (web/iOS/Android)
- [ ] Navigation between screens works smoothly
- [ ] Forms accept input and validate properly
- [ ] Network requests to backend succeed

### Integration Verification
- [ ] User registration creates account successfully
- [ ] Login authentication works with correct credentials
- [ ] Master password unlocks vault properly
- [ ] Account creation encrypts and stores passwords
- [ ] Account viewing decrypts passwords correctly
- [ ] Data persists after app restart/vault lock

## 🔧 Troubleshooting Guide

### Backend Issues

#### ❌ "Cannot connect to MongoDB"
```powershell
# Solution 1: Check Docker status
docker ps

# Solution 2: Restart MongoDB container
cd password-vault-api
npm run docker:down
npm run docker:up
```

#### ❌ "Port 3000 already in use"
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace <PID> with actual process ID)
taskkill /PID <PID> /F

# Restart API server
npm run dev
```

#### ❌ "MongoDB connection timeout"
```powershell
# Check Docker Desktop is running
# Wait longer for MongoDB to start (can take 1-2 minutes first time)
# Check Docker logs
npm run docker:logs
```

### Frontend Issues

#### ❌ "Cannot connect to API / Network Error"
**Most common issue - IP address not configured**

1. **Verify your IP address**:
   ```powershell
   ipconfig | findstr IPv4
   ```

2. **Update ApiService.ts**:
   - File: `Pasword-Vault/src/services/ApiService.ts`
   - Line: `const API_BASE_URL = 'http://YOUR_IP:3000/api';`

3. **Test API accessibility**:
   ```powershell
   # Replace YOUR_IP with actual IP
   curl http://YOUR_IP:3000/api/auth/verify
   ```

#### ❌ "Metro bundler errors"
```powershell
# Clear Expo cache
cd Pasword-Vault
npx expo r -c

# If that fails, reset completely
npx expo r --clear
```

#### ❌ "Dependencies not found"
```powershell
# Reinstall dependencies
cd Pasword-Vault
rm -rf node_modules package-lock.json
npm install
```

#### ❌ "Expo CLI not found"
```powershell
# Install Expo CLI globally
npm install -g @expo/cli

# Verify installation
expo --version
```

### Common Integration Issues

#### ❌ "Registration fails with 'Network Error'"
- **Check**: Backend API is running on correct port
- **Check**: IP address in ApiService.ts matches your computer
- **Check**: Firewall isn't blocking port 3000

#### ❌ "Master password validation fails"
- **Check**: Backend validation schemas include masterPassword field
- **Solution**: Restart backend after any schema changes

#### ❌ "Styles not showing / App looks unstyled"
- **Check**: Tailwind config content paths are correct
- **Solution**: Restart Expo dev server after config changes

## 🚀 Development Workflow

### Backend Development
```powershell
cd password-vault-api

# Development mode (auto-reload on changes)
npm run dev

# Build TypeScript (for production)
npm run build

# Start production server
npm start

# View MongoDB logs
npm run docker:logs

# Reset database (if needed)
npm run docker:down && npm run docker:up
```

### Frontend Development
```powershell
cd Pasword-Vault

# Start development server
npm start

# Clear cache and restart
npx expo r -c

# Platform-specific commands
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web browser
```

### Code Quality Tools
```powershell
# TypeScript type checking
npm run type-check

# Linting (if configured)
npm run lint

# Format code (if configured)
npm run format
```

## 📦 Production Deployment

### Backend Production Setup
```powershell
cd password-vault-api

# Install production dependencies
npm ci --production

# Build the application
npm run build

# Set production environment
$env:NODE_ENV="production"

# Start production server
npm start
```

### Frontend Production Builds
```powershell
cd Pasword-Vault

# Web deployment
expo build:web
# Output: web-build/ directory

# Android APK
expo build:android
# Requires Expo account and signing

# iOS build (macOS only)
expo build:ios
# Requires Apple Developer account
```

## 🔄 Advanced Configuration

### Environment Variables
Create `.env` files for different environments:

**Backend** (`password-vault-api/.env`):
```env
NODE_ENV=development
MONGODB_URI=mongodb://admin:password123@localhost:27017/password_vault?authSource=admin
JWT_SECRET=your-secure-jwt-secret-key
API_PORT=3000
```

**Frontend** (`Pasword-Vault/.env`):
```env
EXPO_PUBLIC_API_URL=http://YOUR_IP:3000/api
```

### Database Management
```powershell
# Backup database
docker exec mongodb mongodump --db password_vault --out /backup

# Restore database
docker exec mongodb mongorestore --db password_vault /backup/password_vault

# Access MongoDB shell
docker exec -it mongodb mongo -u admin -p password123
```

## 🎯 Next Steps & Customization

### Immediate Next Steps
1. **Familiarize yourself** with the codebase structure
2. **Test all features** thoroughly on your target platforms
3. **Customize the UI** to match your design preferences
4. **Add additional features** based on your requirements
5. **Set up proper environment** variables for production

### Potential Enhancements
- **Biometric Authentication**: Add Face ID/Touch ID support
- **Password Categories**: Organize passwords by type
- **Secure Sharing**: Share passwords with trusted contacts
- **Backup & Sync**: Cloud backup and multi-device sync
- **Password Health**: Check for weak/compromised passwords
- **Two-Factor Auth**: Add 2FA for extra security

### Code Structure Overview
```
password-vault-api/          # Backend API
├── src/models/             # Database schemas
├── src/routes/             # API endpoints
├── src/services/           # Business logic
├── src/middleware/         # Authentication & validation
└── src/utils/              # Helper functions

Pasword-Vault/              # React Native App
├── src/components/         # Reusable UI components
├── src/screens/           # App screens (Login, Dashboard, etc.)
├── src/services/          # API communication
├── src/types/             # TypeScript type definitions
└── src/utils/             # Helper functions
```

## 📚 Additional Resources

### Documentation Links
- **Main Project**: [README.md](./README.md) - Complete system overview
- **Backend API**: [password-vault-api/README.md](./password-vault-api/README.md) - API documentation
- **React Native App**: [Pasword-Vault/README.md](./Pasword-Vault/README.md) - App-specific docs

### External Documentation
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Community & Support
- Create GitHub issues for bugs or feature requests
- Check existing issues before creating new ones
- Follow React Native and Expo best practices
- Join relevant Discord/Slack communities for support

## 📞 Getting Help & Support

### Troubleshooting Steps
1. **Check this setup guide** - Most issues are covered here
2. **Review the troubleshooting section** above for common problems
3. **Check individual component documentation**:
   - [Main README.md](./README.md) - System overview and architecture
   - [Backend API docs](./password-vault-api/README.md) - API endpoints and configuration
   - [React Native App docs](./Pasword-Vault/README.md) - App-specific setup and features

### Debug Information
When seeking help, please provide:
- Operating system and version
- Node.js version (`node --version`)
- Docker version (`docker --version`)
- Exact error messages
- Steps that led to the issue
- Your IP address configuration

### Common Questions
**Q: Why can't I use localhost?**
A: React Native apps run on devices/emulators that can't access your computer's localhost. You must use your computer's IP address.

**Q: How do I find my IP address?**
A: Run `ipconfig` on Windows and look for IPv4 Address (usually starts with 192.168.x.x or 10.x.x.x).

**Q: Is this secure for production?**
A: This setup is for development. For production, implement HTTPS, proper environment variables, and additional security measures.

**Q: Can I use this on iOS/Android?**
A: Yes! The React Native app works on both platforms. Use Expo Go app or set up iOS/Android development environments.

## 🔐 Security Best Practices

### Development Security
- ✅ Never commit `.env` files or secrets to version control
- ✅ Use strong master passwords for testing
- ✅ Change default JWT secrets before any production use
- ✅ Regularly update dependencies for security patches
- ✅ Monitor API logs for suspicious activity
- ✅ Use HTTPS in production environments
- ✅ Implement proper rate limiting for production

### Production Security Checklist
- [ ] HTTPS/SSL certificates configured
- [ ] Strong, unique JWT secrets
- [ ] Database authentication enabled
- [ ] Rate limiting implemented
- [ ] Input validation and sanitization
- [ ] Error logging and monitoring
- [ ] Regular security audits
- [ ] Backup and recovery procedures

## 🤖 AI Development Notes

### AI-Assisted Development
This Password Vault system was developed with AI assistance to accelerate development and ensure best practices:

#### What AI Helped With
- **📝 Boilerplate Code**: Base authentication, encryption, and API frameworks
- **🔐 Security Implementation**: AES encryption patterns and JWT authentication
- **🎨 UI/UX Design**: React Native screen layouts and Tailwind CSS styling
- **📚 Documentation**: Comprehensive setup guides and API documentation
- **🐛 Error Handling**: Robust error patterns and user feedback systems

#### Human Oversight & Quality Assurance
All AI-generated content was:
- ✅ **Thoroughly reviewed** by myself
- ✅ **Tested extensively** on android
- ✅ **Customized** to meet specific project requirements
- ✅ **Documented** with clear setup and troubleshooting guides

#### Transparency & Learning
- **Open Process**: AI assistance is clearly documented for transparency
- **Knowledge Transfer**: Human developers understand and can maintain all code
- **Continuous Improvement**: Lessons learned applied to future development
- **Community Benefit**: Best practices shared through comprehensive documentation

#### For Contributors
When contributing to this AI-assisted project:
- 🔍 **Review Thoroughly**: Understand the code you're modifying
- 🧪 **Test Extensively**: Verify changes work across all platforms
- 📖 **Document Changes**: Update both code and documentation
- 🔒 **Security Focus**: Maintain encryption and authentication integrity
- 🤝 **Collaborate**: Build on existing patterns and architecture

---

## 🎉 Success!

**Congratulations! You now have a fully functional Password Vault system running locally.**

### What You've Accomplished
✅ Set up a secure backend API with MongoDB  
✅ Configured React Native app with proper networking  
✅ Implemented end-to-end encryption for password storage  
✅ Created a modern, responsive user interface  
✅ Established a complete development workflow  

### You're Ready To
- Add and manage encrypted passwords securely
- Customize the UI and add new features
- Deploy to production environments
- Scale the system for multiple users

**Happy coding! 🚀**
