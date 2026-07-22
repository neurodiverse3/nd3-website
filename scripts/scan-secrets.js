import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const SECRET_PATTERNS = [
  { name: 'Notion Integration Secret', regex: /ntn_[a-zA-Z0-9]{25,}/ },
  { name: 'Secret API Key (sk_live/test)', regex: /sk_(live|test)_[a-zA-Z0-9]{24,}/ },
  { name: 'Composio Consumer Key', regex: /ck_[a-zA-Z0-9_-]{15,}/ },
  { name: 'Private RSA/SSH Key', regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { name: 'Hardcoded ENV Value in Code', regex: /(NOTION_TOKEN|STRAPI_API_TOKEN|RESEND_API_KEY|POLAR_ACCESS_TOKEN|BING_WEBMASTER_API_KEY|COMPOSIO_API_KEY)\s*=\s*['"][a-zA-Z0-9_-]{10,}['"]/ },
];

function checkStagedFiles() {
  try {
    const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' })
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    let leaksFound = false;

    for (const file of stagedFiles) {
      // Skip .env.example or binary assets
      if (file === '.env.example' || file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.ico') || file.endsWith('.svg') || file.endsWith('.webm')) {
        continue;
      }

      if (file === '.env' || file.endsWith('.env.local')) {
        console.error(`\n🚨 CRITICAL SECURITY ERROR: Attempting to commit environment file "${file}"!`);
        console.error(`Environment files must NEVER be committed to Git. Removing "${file}" from commit staging...`);
        execSync(`git reset HEAD "${file}"`);
        leaksFound = true;
        continue;
      }

      if (!fs.existsSync(file)) continue;

      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');

      lines.forEach((line, idx) => {
        for (const pattern of SECRET_PATTERNS) {
          if (pattern.regex.test(line)) {
            console.error(`\n🚨 CRITICAL SECRET DETECTED in staged file!`);
            console.error(`  - File: ${file}:${idx + 1}`);
            console.error(`  - Match Type: ${pattern.name}`);
            console.error(`  - Line Content: ${line.trim().slice(0, 60)}...`);
            leaksFound = true;
          }
        }
      });
    }

    if (leaksFound) {
      console.error('\n❌ PRE-COMMIT AUDIT FAILED: Commit blocked to prevent secret leaks.');
      console.error('Please remove hardcoded secrets or unstage sensitive files before committing.\n');
      process.exit(1);
    }

    console.log('✅ Pre-commit secret audit passed. No secrets detected in staged files.');
  } catch (err) {
    if (err.status === 1) {
      process.exit(1);
    }
    console.warn('⚠️ Secret scanner warning:', err.message);
  }
}

checkStagedFiles();
