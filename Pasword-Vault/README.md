# Password Vault - React Native App

A secure React Native password vault application with military-grade encryption, built with Expo and TypeScript.

## Features

- **🔐 Secure User Authentication**: Register and login with encrypted master passwords
- **🛡️ AES Encryption**: All passwords encrypted using AES with Base64 encoding
- **🔑 SHA1 Key Derivation**: Account passwords encrypted using SHA1 hash of master password
- **📱 Cross-Platform**: Works on iOS, Android, and Web
- **🎨 Modern UI**: Built with NativeWind (Tailwind CSS for React Native)
- **💾 Secure Storage**: Uses Expo SecureStore for sensitive data
- **🔄 Real-time Sync**: Syncs with backend API for multi-device access

## Security Architecture

### Master Password Security
- Master passwords are never stored locally in plain text
- Encrypted using AES encryption on the backend
- JWT tokens for secure API authentication
- Automatic token validation and refresh

### Account Password Security
- Each account password is encrypted using AES
- Encryption key derived from SHA1 hash of master password
- Passwords decrypted client-side for viewing
- Master password required for all decryption operations

### Data Flow
1. User enters master password
2. Master password is sent to backend for authentication
3. JWT token returned for API access
4. Account passwords decrypted using master password as key
5. All sensitive data cleared on logout

## Requirements

- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator (for testing)
- Backend API running (see ../password-vault-api)

## Installation

1. **Navigate to the app directory**
   ```powershell
   cd Pasword-Vault
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

3. **Start the development server**
   ```powershell
   npm start
   ```

4. **Run on your preferred platform**
   - iOS: Press `i` in the terminal or `npm run ios`
   - Android: Press `a` in the terminal or `npm run android`
   - Web: Press `w` in the terminal or `npm run web`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx      # Custom button component
│   └── InputField.tsx  # Custom input field component
├── screens/            # App screens
│   ├── LoginScreen.tsx          # User login
│   ├── RegisterScreen.tsx       # User registration
│   ├── DashboardScreen.tsx      # Main dashboard
│   ├── AddAccountScreen.tsx     # Add new account
│   └── EditAccountScreen.tsx    # Edit existing account
├── services/           # API and external services
│   └── ApiService.ts   # Backend API communication
├── types/              # TypeScript type definitions
│   └── api.ts         # API response types
└── utils/              # Utility functions
    └── storage.ts     # Secure storage helpers
```

## Key Components

### Authentication Flow
- **LoginScreen**: Master password authentication
- **RegisterScreen**: New user registration with validation
- **Token Management**: Automatic JWT token handling

### Password Management
- **DashboardScreen**: View all accounts with decrypted passwords
- **AddAccountScreen**: Create new password entries
- **EditAccountScreen**: Modify existing accounts
- **Password Generation**: Built-in secure password generator

### Security Features
- **Secure Storage**: Expo SecureStore for tokens and sensitive data
- **Form Validation**: Client-side validation with error handling
- **Auto-Lock**: Vault locks on app backgrounding
- **Master Password Verification**: Required for all password operations

## API Integration

The app communicates with the backend API for:

- User registration and authentication
- Password vault management
- Encrypted password storage and retrieval
- Account CRUD operations

### API Endpoints Used

```typescript
POST /api/auth/register    // User registration
POST /api/auth/login       // User authentication
GET  /api/auth/verify      // Token verification
POST /api/accounts         // Create account
POST /api/accounts/list    // List accounts (with decryption)
PUT  /api/accounts/:id     // Update account
DELETE /api/accounts/:id   // Delete account
```

## Security Best Practices

### Implemented Security Measures
- No sensitive data stored in plain text
- Master password hashing for encryption keys
- Secure HTTP communication with backend
- Input validation and sanitization
- Automatic session management

### User Security Guidelines
- Use strong, unique master passwords
- Don't share master passwords
- Regular password updates recommended
- Logout when not in use

## Development

### Running in Development Mode

```powershell
# Start Expo development server
npm start

# Run with specific platform
npm run ios     # iOS Simulator
npm run android # Android Emulator
npm run web     # Web browser
```

### Building for Production

```powershell
# Build for production
expo build:ios      # iOS build
expo build:android  # Android build
```

### Environment Configuration

Create a `.env` file in the app root:

```env
API_BASE_URL=http://localhost:3000/api
```

## UI/UX Features

### Design System
- **NativeWind**: Tailwind CSS for React Native styling
- **Consistent Theming**: Professional dark/light theme support
- **Responsive Design**: Works on phones, tablets, and web
- **Accessibility**: Screen reader support and keyboard navigation

### User Experience
- **Intuitive Navigation**: Stack-based navigation with modals
- **Form Validation**: Real-time validation with clear error messages
- **Loading States**: Visual feedback for all async operations
- **Confirmation Dialogs**: Protect against accidental deletions

### Password Management UX
- **Clear Text Display**: Passwords shown in clear text when needed
- **Copy to Clipboard**: One-tap password copying
- **Password Generator**: Built-in secure password generation
- **Search and Filter**: Quick account finding (coming soon)

## Testing

### Manual Testing Checklist
- [ ] User registration with various password strengths
- [ ] Login with correct/incorrect credentials
- [ ] Create accounts with different data types
- [ ] Edit account details and passwords
- [ ] Delete accounts with confirmation
- [ ] Logout and session clearing
- [ ] App backgrounding and foregrounding
- [ ] Network error handling

## Troubleshooting

### Common Issues

**"Cannot connect to API"**
- Ensure backend API is running on localhost:3000
- Check network connectivity
- Verify API base URL configuration

**"Authentication failed"**
- Clear app data and re-login
- Check master password correctness
- Verify backend database connectivity

**"Decryption error"**
- Ensure master password is correct
- Check if account was created with different master password
- Verify encryption/decryption consistency

### Debug Mode

Enable debug logging:
```typescript
// In ApiService.ts
console.log('API Request:', config);
console.log('API Response:', response);
```

## Future Enhancements

### Planned Features
- [ ] Biometric authentication (Face ID, Touch ID)
- [ ] Search and filter accounts
- [ ] Categories and tags
- [ ] Export/import functionality
- [ ] Password strength analysis
- [ ] Breach monitoring integration
- [ ] Multi-vault support
- [ ] Shared vault functionality

### Technical Improvements
- [ ] Offline mode support
- [ ] Background sync
- [ ] Enhanced error handling
- [ ] Performance optimizations
- [ ] Automated testing suite
- [ ] CI/CD pipeline integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting guide
- Review the API documentation

---

**Note**: This application handles sensitive password data. Always follow security best practices and never commit sensitive information to version control.
