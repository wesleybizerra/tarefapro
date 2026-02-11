
import crypto from 'crypto';
// Fix: Added explicit Buffer import to resolve "Cannot find name 'Buffer'" errors
import { Buffer } from 'buffer';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const KEY = process.env.ENCRYPTION_KEY || 'default_key_32_chars_long_1234567'; // Deve ter 32 chars

export function encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    // Fix: Using Buffer.from which is now available from explicit import
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(KEY), iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');

    // Retorna IV:Tag:Conteúdo
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

export function decrypt(hash: string): string {
    const [ivHex, authTagHex, encryptedText] = hash.split(':');

    // Fix: Using Buffer.from which is now available from explicit import
    const iv = Buffer.from(ivHex, 'hex');
    // Fix: Using Buffer.from which is now available from explicit import
    const authTag = Buffer.from(authTagHex, 'hex');
    // Fix: Using Buffer.from which is now available from explicit import
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(KEY), iv);

    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}
