// Read Electron v1 fuses from a binary (sentinel + version byte + count + fuse bytes).
// Fuse states: 0x00=REMOVED, 0x30=DISABLED('0'), 0x31=ENABLED('1')
const fs = require('fs');
const SENTINEL = 'dL7pKGdnNz796PbbjQWNKmHXBZaB9tsX';
const NAMES = [
  'RunAsNode',
  'EnableCookieEncryption',
  'EnableNodeOptionsEnvironmentVariable',
  'EnableNodeCliInspectArguments',
  'EnableEmbeddedAsarIntegrityValidation',
  'OnlyLoadAppFromAsar',
  'LoadBrowserProcessSpecificV8Snapshot',
  'GrantFileProtocolExtraPrivileges',
];
for (const p of process.argv.slice(2)) {
  const buf = fs.readFileSync(p);
  const idx = buf.indexOf(SENTINEL);
  console.log('== ' + p);
  if (idx === -1) { console.log('   no fuse sentinel found'); continue; }
  const version = buf[idx + 32];
  const count = buf[idx + 33];
  console.log(`   sentinel@${idx} version=${version} count=${count}`);
  for (let i = 0; i < count && i < NAMES.length; i++) {
    const b = buf[idx + 34 + i];
    const state = b === 0x31 ? 'ENABLED' : b === 0x30 ? 'disabled' : b === 0 ? 'REMOVED' : '0x' + b.toString(16);
    console.log(`   [${i}] ${NAMES[i]}: ${state}`);
  }
}
