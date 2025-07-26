import express, { Response } from 'express';
import { Account } from '../models/Account';
import { User } from '../models/User';
import { EncryptionService } from '../services/EncryptionService';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { createAccountSchema, updateAccountSchema } from '../utils/validation';

const router = express.Router();

// Secret key for encrypting master passwords
const MASTER_PASSWORD_SECRET = process.env.JWT_SECRET || 'fallback-master-password-secret';

/**
 * Create a new account
 * POST /api/accounts
 */
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Validate request data
    const { error, value } = createAccountSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const { username, password, comment, masterPassword } = value;

    if (!masterPassword) {
      res.status(400).json({ error: 'Master password is required to encrypt account password' });
      return;
    }

    // Verify master password
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const isValidMasterPassword = EncryptionService.validateMasterPassword(
      masterPassword,
      user.masterPasswordHash,
      MASTER_PASSWORD_SECRET
    );

    if (!isValidMasterPassword) {
      res.status(401).json({ error: 'Invalid master password' });
      return;
    }

    // Generate unique account ID
    const accountId = EncryptionService.generateAccountId();

    // Encrypt account password using SHA1 hash of master password as key
    const encryptedPassword = EncryptionService.encryptAccountPassword(password, masterPassword);

    // Create new account
    const account = new Account({
      accountId,
      userId: req.userId,
      username,
      encryptedPassword,
      comment: comment || ''
    });

    await account.save();

    res.status(201).json({
      message: 'Account created successfully',
      account: {
        id: account._id,
        accountId: account.accountId,
        username: account.username,
        comment: account.comment,
        createdAt: account.createdAt
      }
    });
  } catch (error) {
    console.error('Create account error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get all accounts for the authenticated user
 * POST /api/accounts/list (POST because we need master password for decryption)
 */
router.post('/list', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { masterPassword } = req.body;

    if (!masterPassword) {
      res.status(400).json({ error: 'Master password is required to decrypt account passwords' });
      return;
    }

    // Verify master password
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const isValidMasterPassword = EncryptionService.validateMasterPassword(
      masterPassword,
      user.masterPasswordHash,
      MASTER_PASSWORD_SECRET
    );

    if (!isValidMasterPassword) {
      res.status(401).json({ error: 'Invalid master password' });
      return;
    }

    // Get all accounts for this user
    const accounts = await Account.find({ userId: req.userId }).sort({ createdAt: -1 });

    // Decrypt passwords and return account details
    const decryptedAccounts = accounts.map(account => {
      try {
        const decryptedPassword = EncryptionService.decryptAccountPassword(
          account.encryptedPassword,
          masterPassword
        );

        return {
          id: account._id,
          accountId: account.accountId,
          username: account.username,
          password: decryptedPassword, // Show in clear text as required
          comment: account.comment,
          createdAt: account.createdAt,
          updatedAt: account.updatedAt
        };
      } catch (decryptError) {
        console.error('Decryption error for account:', account.accountId, decryptError);
        return {
          id: account._id,
          accountId: account.accountId,
          username: account.username,
          password: '[DECRYPTION_ERROR]',
          comment: account.comment,
          createdAt: account.createdAt,
          updatedAt: account.updatedAt
        };
      }
    });

    res.json({
      message: 'Accounts retrieved successfully',
      accounts: decryptedAccounts,
      total: decryptedAccounts.length
    });
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get a specific account by account ID
 * POST /api/accounts/:accountId (POST because we need master password for decryption)
 */
router.post('/:accountId', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { accountId } = req.params;
    const { masterPassword } = req.body;

    if (!masterPassword) {
      res.status(400).json({ error: 'Master password is required to decrypt account password' });
      return;
    }

    // Verify master password
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const isValidMasterPassword = EncryptionService.validateMasterPassword(
      masterPassword,
      user.masterPasswordHash,
      MASTER_PASSWORD_SECRET
    );

    if (!isValidMasterPassword) {
      res.status(401).json({ error: 'Invalid master password' });
      return;
    }

    // Find the account
    const account = await Account.findOne({ accountId, userId: req.userId });
    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    // Decrypt password
    const decryptedPassword = EncryptionService.decryptAccountPassword(
      account.encryptedPassword,
      masterPassword
    );

    res.json({
      message: 'Account retrieved successfully',
      account: {
        id: account._id,
        accountId: account.accountId,
        username: account.username,
        password: decryptedPassword, // Show in clear text as required
        comment: account.comment,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt
      }
    });
  } catch (error) {
    console.error('Get account error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Update an account
 * PUT /api/accounts/:accountId
 */
router.put('/:accountId', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { accountId } = req.params;
    
    // Validate request data
    const { error, value } = updateAccountSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const { username, password, comment, masterPassword } = value;

    // Find the account
    const account = await Account.findOne({ accountId, userId: req.userId });
    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    // If password is being updated, verify master password and encrypt new password
    if (password && masterPassword) {
      // Verify master password
      const user = await User.findById(req.userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const isValidMasterPassword = EncryptionService.validateMasterPassword(
        masterPassword,
        user.masterPasswordHash,
        MASTER_PASSWORD_SECRET
      );

      if (!isValidMasterPassword) {
        res.status(401).json({ error: 'Invalid master password' });
        return;
      }

      // Encrypt new password
      account.encryptedPassword = EncryptionService.encryptAccountPassword(password, masterPassword);
    } else if (password && !masterPassword) {
      res.status(400).json({ error: 'Master password is required to update account password' });
      return;
    }

    // Update other fields
    if (username !== undefined) account.username = username;
    if (comment !== undefined) account.comment = comment;

    await account.save();

    res.json({
      message: 'Account updated successfully',
      account: {
        id: account._id,
        accountId: account.accountId,
        username: account.username,
        comment: account.comment,
        updatedAt: account.updatedAt
      }
    });
  } catch (error) {
    console.error('Update account error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Delete an account
 * DELETE /api/accounts/:accountId
 */
router.delete('/:accountId', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { accountId } = req.params;

    // Find and delete the account
    const account = await Account.findOneAndDelete({ accountId, userId: req.userId });
    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    res.json({
      message: 'Account deleted successfully',
      accountId: account.accountId
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get account statistics
 * GET /api/accounts/stats
 */
router.get('/stats', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const totalAccounts = await Account.countDocuments({ userId: req.userId });
    
    res.json({
      message: 'Account statistics retrieved successfully',
      stats: {
        totalAccounts,
        userId: req.userId
      }
    });
  } catch (error) {
    console.error('Get account stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
