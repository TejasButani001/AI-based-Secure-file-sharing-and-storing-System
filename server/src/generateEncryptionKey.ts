import { generateRandomKey } from './encryptionUtils';

/**
 * Encryption Key Generator
 * 
 * Run this script to generate a new AES-256 encryption key
 * Usage: npx ts-node server/src/generateEncryptionKey.ts
 * 
 * Copy the output and add it to your .env file as:
 * ENCRYPTION_KEY=<generated_key>
 */

console.log('\n🔐 AES-256 Encryption Key Generator\n');
console.log('Generating a secure 256-bit (32 bytes) encryption key...\n');

try {
    const key = generateRandomKey();
    console.log('✅ Encryption Key Generated Successfully!\n');
    console.log('Add this to your .env file:\n');
    console.log(`ENCRYPTION_KEY=${key}\n`);
    console.log('⚠️  IMPORTANT SECURITY NOTES:');
    console.log('   - Keep this key SECRET and secure');
    console.log('   - Do NOT commit this key to version control');
    console.log('   - Store it in environment variables or a secure vault');
    console.log('   - Changing this key will make previously encrypted files unreadable!\n');
} catch (error) {
    console.error('❌ Error generating key:', error);
    process.exit(1);
}
