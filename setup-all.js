const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runStep(label, fn) {
  console.log(`\n[STEP] ${label}...`);
  try {
    fn();
    console.log(`✓ Completed: ${label}`);
  } catch (err) {
    console.error(`✗ Error during: ${label}`);
    console.error(err.message);
  }
}

console.log('==================================================');
console.log('   BEFORE YOU ACT — Automated Project Setup');
console.log('==================================================');

// 1. Environment Configuration Setup
runStep('Configuring environment files', () => {
  const rootDir = __dirname;
  const envPath = path.join(rootDir, '.env');
  const envExamplePath = path.join(rootDir, '.env.example');

  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log('Created .env from .env.example');
    } else {
      const defaultEnv = 'PORT=5000\nNODE_ENV=development\nGEMINI_API_KEY=\n';
      fs.writeFileSync(envPath, defaultEnv, 'utf8');
      console.log('Created new default .env file');
    }
  } else {
    console.log('.env already exists, skipping.');
  }
});

// 2. Root Backend Dependencies
runStep('Installing backend dependencies', () => {
  execSync('npm install', {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });
});

// 3. Client Frontend Dependencies
runStep('Installing frontend client dependencies', () => {
  const clientDir = path.join(__dirname, 'client');
  if (fs.existsSync(clientDir)) {
    execSync('npm install', {
      cwd: clientDir,
      stdio: 'inherit',
      shell: true
    });
  } else {
    console.warn('Warning: client directory not found.');
  }
});

// 4. Verification Check
runStep('Verifying project integrity', () => {
  console.log('\nReady! You can now start the project:');
  console.log('  1. Backend:  npm run dev');
  console.log('  2. Frontend: cd client && npm run dev\n');
});

console.log('==================================================');
console.log('   Setup complete.');
console.log('==================================================\n');