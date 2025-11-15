#!/usr/bin/env node

/**
 * Script to run a build with monitoring for 503 errors and route failures
 * Logs all failed routes to a file for inspection
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const failedRoutes = [];
const errors503 = [];
let buildSucceeded = false;

console.log('Starting monitored build...\n');
console.log('='.repeat(60));
console.log('Monitoring build output for 503 errors and route failures');
console.log('='.repeat(60));
console.log('');

// Run npm run build and capture output
const buildProcess = spawn('npm', ['run', 'build'], {
  stdio: 'pipe',
  shell: true,
});

// Parse stdout for errors
buildProcess.stdout.on('data', (data) => {
  const output = data.toString();
  process.stdout.write(output);

  // Look for 503 errors in output
  if (output.includes('503') || output.includes('Service Unavailable')) {
    const lines = output.split('\n');
    lines.forEach(line => {
      if (line.includes('503') || line.includes('Service Unavailable')) {
        errors503.push(line.trim());
      }
    });
  }

  // Look for route failures
  if (output.includes('Error occurred') || output.includes('Failed to')) {
    const lines = output.split('\n');
    lines.forEach(line => {
      if (line.includes('/pokemon/')) {
        const match = line.match(/\/pokemon\/[^\s]+/);
        if (match) {
          failedRoutes.push(match[0]);
        }
      }
    });
  }
});

// Also capture stderr
buildProcess.stderr.on('data', (data) => {
  const output = data.toString();
  process.stderr.write(output);

  // Look for errors in stderr too
  if (output.includes('503') || output.includes('Service Unavailable')) {
    errors503.push(output.trim());
  }
});

buildProcess.on('close', (code) => {
  buildSucceeded = code === 0;

  console.log('\n');
  console.log('='.repeat(60));
  console.log('BUILD COMPLETE - SUMMARY');
  console.log('='.repeat(60));
  console.log('');
  console.log(`Build exit code: ${code} (${buildSucceeded ? 'SUCCESS' : 'FAILED'})`);
  console.log('');

  // Analyze prerender manifest
  try {
    const prerenderManifest = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), '.next/prerender-manifest.json'), 'utf8')
    );

    const totalRoutes = Object.keys(prerenderManifest.routes).length;
    const pokemonRoutes = Object.keys(prerenderManifest.routes).filter(r => r.startsWith('/pokemon/'));

    console.log(`Total routes generated: ${totalRoutes}`);
    console.log(`Pokemon routes generated: ${pokemonRoutes.length}`);
    console.log('');
  } catch (error) {
    console.log('Could not read prerender manifest:', error.message);
  }

  // Report 503 errors
  if (errors503.length > 0) {
    console.log(`⚠️  Found ${errors503.length} instances of 503 errors in output`);
    console.log('');

    // Save to file
    const logFile = path.join(process.cwd(), 'build-errors.log');
    const logContent = [
      'BUILD ERRORS LOG',
      `Generated: ${new Date().toISOString()}`,
      `Build exit code: ${code}`,
      '',
      '503 ERRORS:',
      '='.repeat(60),
      ...errors503,
      '',
    ].join('\n');

    fs.writeFileSync(logFile, logContent);
    console.log(`Full error log saved to: build-errors.log`);
    console.log('');
  } else {
    console.log('✅ No 503 errors detected in build output!');
    console.log('');
  }

  // Report failed routes
  if (failedRoutes.length > 0) {
    console.log(`Failed routes detected: ${failedRoutes.length}`);
    console.log('Sample failed routes:');
    failedRoutes.slice(0, 10).forEach(route => {
      console.log(`  - ${route}`);
    });
    console.log('');
  }

  console.log('='.repeat(60));
  console.log('');

  process.exit(code);
});
