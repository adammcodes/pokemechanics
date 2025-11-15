#!/usr/bin/env node

/**
 * Script to identify which Pokemon routes might have failed during build
 * by attempting to access them via the build output
 */

const fs = require('fs');
const path = require('path');

// Sample some routes that commonly had 503 errors
const testRoutes = [
  '/pokemon/bulbasaur/red-blue/kanto',
  '/pokemon/charizard/red-blue/kanto',
  '/pokemon/pikachu/red-blue/kanto',
  '/pokemon/mewtwo/red-blue/kanto',
  '/pokemon/chikorita/gold-silver/original-johto',
  '/pokemon/lugia/gold-silver/original-johto',
  '/pokemon/groudon/ruby-sapphire/hoenn',
  '/pokemon/rayquaza/emerald/hoenn',
  '/pokemon/dialga/diamond-pearl/original-sinnoh',
  '/pokemon/arceus/platinum/extended-sinnoh',
];

console.log('Checking .next prerender manifest for failed routes...\n');

try {
  const prerenderManifest = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), '.next/prerender-manifest.json'), 'utf8')
  );

  const { routes, dynamicRoutes } = prerenderManifest;

  console.log(`Total static routes in manifest: ${Object.keys(routes).length}`);
  console.log(`Total dynamic routes: ${Object.keys(dynamicRoutes || {}).length}\n`);

  console.log('Sampling test routes:\n');

  testRoutes.forEach(route => {
    const exists = routes[route] || false;
    console.log(`${exists ? '✅' : '❌'} ${route}`);
  });

  // Count Pokemon routes
  const pokemonRoutes = Object.keys(routes).filter(r => r.startsWith('/pokemon/'));
  console.log(`\nTotal Pokemon routes generated: ${pokemonRoutes.length}`);

  // Sample 10 random Pokemon routes
  console.log('\nRandom sample of 10 generated Pokemon routes:');
  const sample = pokemonRoutes.sort(() => Math.random() - 0.5).slice(0, 10);
  sample.forEach(route => console.log(`  ${route}`));

} catch (error) {
  console.error('Error reading prerender manifest:', error.message);
  process.exit(1);
}
