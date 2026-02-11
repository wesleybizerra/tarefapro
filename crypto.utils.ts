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
}
