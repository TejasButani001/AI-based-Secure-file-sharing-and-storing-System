import crypto from 'crypto';

// AES-256 Encryption/Decryption Utility
// Uses Node.js built-in crypto module for security

const ALGORITHM = 'aes-256-cbc';
const ENCODING = 'hex';
const IV_LENGTH = 16; // AES block size in bytes

/**
 * Derive a 256-bit (32 bytes) key from a password using PBKDF2
 * @param password - User password or encryption key
 * @param salt - Optional salt for key derivation
 */
export function deriveKey(password: string, salt: string = 'securevault_salt'): Buffer {
    return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
}

/**
 * Generate a master encryption key from environment variable
 */
export function getMasterKey(): Buffer {
    const masterKeyEnv = process.env.ENCRYPTION_KEY;
    if (!masterKeyEnv) {
        throw new Error('ENCRYPTION_KEY environment variable not set');
    }
    
    // If the key is in hex format (64 chars for 256-bit key)
    if (masterKeyEnv.length === 64) {
        return Buffer.from(masterKeyEnv, 'hex');
    }
    
    // Otherwise derive it from the provided password/key
    return deriveKey(masterKeyEnv);
}

/**
 * Encrypt file data with AES-256-CBC
 * @param fileBuffer - The file data to encrypt
 * @param encryptionKey - Optional custom key (uses master key if not provided)
 */
export function encryptFile(
    fileBuffer: Buffer,
    encryptionKey?: Buffer
): string {
    try {
        const key = encryptionKey || getMasterKey();
        
        // Generate random IV for each encryption
        const iv = crypto.randomBytes(IV_LENGTH);
        
        // Create cipher
        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
        
        // Encrypt the file
        let encrypted = cipher.update(fileBuffer);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        
        // Return IV + encrypted data in hex format
        // Format: <iv_hex>:<encrypted_data_hex>
        return `${iv.toString(ENCODING)}:${encrypted.toString(ENCODING)}`;
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error(`Failed to encrypt file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Decrypt file data with AES-256-CBC
 * @param encryptedData - The encrypted data (format: iv:encrypted_data in hex)
 * @param encryptionKey - Optional custom key (uses master key if not provided)
 */
export function decryptFile(
    encryptedData: string,
    encryptionKey?: Buffer
): Buffer {
    try {
        const key = encryptionKey || getMasterKey();
        
        // Parse the encrypted data (IV:encrypted_data)
        const parts = encryptedData.split(':');
        if (parts.length !== 2) {
            throw new Error('Invalid encrypted data format');
        }
        
        const iv = Buffer.from(parts[0], ENCODING);
        const encrypted = Buffer.from(parts[1], ENCODING);
        
        // Validate IV length
        if (iv.length !== IV_LENGTH) {
            throw new Error('Invalid IV length');
        }
        
        // Create decipher
        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        
        // Decrypt the file
        let decrypted = decipher.update(encrypted);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        
        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error(`Failed to decrypt file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Generate a random 256-bit encryption key in hex format
 * Use this to generate the ENCRYPTION_KEY for .env
 */
export function generateRandomKey(): string {
    const key = crypto.randomBytes(32); // 32 bytes = 256 bits
    return key.toString('hex');
}

/**
 * Hash encrypted file for integrity verification
 */
export function hashEncryptedData(encryptedData: string): string {
    return crypto
        .createHash('sha256')
        .update(encryptedData)
        .digest('hex');
}

/**
 * Verify encrypted file integrity
 */
export function verifyEncryptedDataIntegrity(
    encryptedData: string,
    hash: string
): boolean {
    return hashEncryptedData(encryptedData) === hash;
}
