#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envFile = path.join(__dirname, '.env');
const configFile = path.join(__dirname, 'config.local.js');

if (!fs.existsSync(envFile)) {
  console.error('Error: .env file not found. Please create it from .env.example');
  process.exit(1);
}

const envContent = fs.readFileSync(envFile, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && !key.startsWith('#')) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const configContent = `// Auto-generated from .env file
// Do not edit manually - edit .env instead

const API_KEY = '${envVars.OPENROUTER_API_KEY || ''}';

if (!API_KEY) {
  console.error('Error: OPENROUTER_API_KEY is not set in .env file');
}
`;

fs.writeFileSync(configFile, configContent);
console.log('✓ config.local.js created from .env file');