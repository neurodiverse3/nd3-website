import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Load env vars (mimicking diagnostics route getEnvVars)
export function getEnvVars() {
  const env = { ...process.env };
  try {
    const filePath = path.join(process.cwd(), '.env.production.local');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      content.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || '';
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          }
          env[key] = value;
        }
      });
    }
  } catch (err) {
    console.error('[AdminAuth] Failed to parse .env.production.local:', err.message);
  }
  return env;
}

// Constant-time comparison using SHA-256 hashes to support arbitrary length strings safely
export function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const aHash = crypto.createHash('sha256').update(a).digest();
  const bHash = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(aHash, bHash);
}

// Generate signed session cookie value
export function signSession(expiresAt, password) {
  const payload = JSON.stringify({ expiresAt });
  const signature = crypto.createHmac('sha256', password).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

// Verify session cookie value
export function verifySession(cookieValue, password) {
  if (!cookieValue) return null;
  const parts = cookieValue.split('.');
  if (parts.length !== 2) return null;
  const [payloadStr, signature] = parts;
  
  const expectedSignature = crypto.createHmac('sha256', password).update(payloadStr).digest('hex');
  if (signature !== expectedSignature) {
    return null; // signature mismatch
  }
  
  try {
    const payload = JSON.parse(payloadStr);
    if (payload.expiresAt < Date.now()) {
      return null; // expired
    }
    return payload;
  } catch {
    return null;
  }
}

// Get client IP address
export function getIpAddress(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.ip || '127.0.0.1';
}

// Rate Limiting Store
const failedAttempts = new Map();

export function isLockedOut(ip) {
  const attempt = failedAttempts.get(ip);
  if (!attempt) return false;
  if (attempt.lockoutUntil > Date.now()) {
    return true;
  }
  return false;
}

export function getLockoutDuration(ip) {
  const attempt = failedAttempts.get(ip);
  if (!attempt || attempt.lockoutUntil <= Date.now()) return 0;
  return Math.ceil((attempt.lockoutUntil - Date.now()) / 1000);
}

export function recordFailedAttempt(ip) {
  const attempt = failedAttempts.get(ip) || { count: 0, lockoutUntil: 0 };
  attempt.count += 1;
  if (attempt.count >= 5) {
    attempt.lockoutUntil = Date.now() + 15 * 60 * 1000; // 15-minute lockout
  }
  failedAttempts.set(ip, attempt);
  return attempt;
}

export function clearFailedAttempts(ip) {
  failedAttempts.delete(ip);
}
