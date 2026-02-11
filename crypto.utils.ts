<<<<<<< HEAD
<<<<<<< HEAD
import { Buffer } from 'buffer';

const KEY_STRING = process.env.ENCRYPTION_KEY || 'default_key_32_chars_long_1234567';

async function getCryptoKey() {
  const enc = new TextEncoder();
  const keyData = enc.encode(KEY_STRING.padEnd(32, '0').slice(0, 32));
  return await window.crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encrypt(text: string): Promise<string> {
  const enc = new TextEncoder();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await getCryptoKey();
  
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(text)
  );

  const ivHex = Buffer.from(iv).toString('hex');
  const contentHex = Buffer.from(new Uint8Array(encrypted)).toString('hex');
  
  return `${ivHex}:${contentHex}`;
}

export async function decrypt(hash: string): Promise<string> {
  try {
    const parts = hash.split(':');
    if (parts.length < 2) throw new Error('Hash inválido');
    
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedData = Buffer.from(parts[1], 'hex');
    const key = await getCryptoKey();

    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedData
    );

    return new TextDecoder().decode(decrypted);
  } catch (e) {
    console.error('Erro na descriptografia:', e);
    return 'DADO_PROTEGIDO';
  }
=======

/**
 * Utilitários de Criptografia para Navegador (LGPD Compliance)
 * Utiliza Web Crypto API para AES-GCM 256
 */

const ENCRYPTION_KEY_STRING = 'default_key_32_chars_long_1234567';

async function getKey() {
    const enc = new TextEncoder();
    const keyData = enc.encode(ENCRYPTION_KEY_STRING);
    return await window.crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
    );
}

export async function encrypt(text: string): Promise<string> {
    const enc = new TextEncoder();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await getKey();

=======

/**
 * Utilitários de Criptografia para Navegador (LGPD Compliance)
 * Utiliza Web Crypto API para AES-GCM 256
 */

const ENCRYPTION_KEY_STRING = 'default_key_32_chars_long_1234567';

async function getKey() {
    const enc = new TextEncoder();
    const keyData = enc.encode(ENCRYPTION_KEY_STRING);
    return await window.crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
    );
}

export async function encrypt(text: string): Promise<string> {
    const enc = new TextEncoder();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await getKey();

>>>>>>> 46d733016c8728a7432888dc3beb8afab971025e
    const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        enc.encode(text)
    );

    const encryptedArray = new Uint8Array(encrypted);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);

    return btoa(String.fromCharCode(...combined));
}

export async function decrypt(base64Hash: string): Promise<string> {
    try {
        const combined = new Uint8Array(
            atob(base64Hash).split('').map(c => c.charCodeAt(0))
        );
        const iv = combined.slice(0, 12);
        const data = combined.slice(12);
        const key = await getKey();

        const decrypted = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            key,
            data
        );

        return new TextDecoder().decode(decrypted);
    } catch (e) {
        console.error('Erro na descriptografia:', e);
        return 'erro_decodificacao';
    }
<<<<<<< HEAD
>>>>>>> 78732ff (fix: ajuste de build e deploy para Railway)
=======
>>>>>>> 46d733016c8728a7432888dc3beb8afab971025e
}
