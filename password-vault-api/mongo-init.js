// MongoDB initialization script
db = db.getSiblingDB('password_vault');

// Create collections
db.createCollection('users');
db.createCollection('accounts');

// Create indexes for better performance
db.users.createIndex({ "username": 1 }, { unique: true });
db.accounts.createIndex({ "userId": 1 });
db.accounts.createIndex({ "accountId": 1 }, { unique: true });

print('Database initialized successfully');
