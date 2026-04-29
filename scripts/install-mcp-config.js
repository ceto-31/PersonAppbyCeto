// Restore + extend the Claude Desktop config from the .bak file, adding the
// person-app MCP server entry. Uses Node (not PowerShell) so the output is
// plain UTF-8 with standard JSON escaping.
const fs = require('fs');
const path = require('path');

const dir = path.join(process.env.APPDATA, 'Claude');
const cfgPath = path.join(dir, 'claude_desktop_config.json');
const bakPath = cfgPath + '.bak';
const envPath = path.join(__dirname, '..', '.env');

const env = fs.readFileSync(envPath, 'utf8');
const m = env.match(/DATABASE_URL\s*=\s*"([^"]+)"/);
if (!m) {
  console.error('DATABASE_URL not found in .env');
  process.exit(1);
}
const databaseUrl = m[1];

const cfg = JSON.parse(fs.readFileSync(bakPath, 'utf8'));

cfg.mcpServers = cfg.mcpServers || {};
cfg.mcpServers['person-app'] = {
  command: 'node',
  args: [
    'C:/Users/anice/OneDrive/Documents/ECA/Week3&4/person-app/node_modules/tsx/dist/cli.mjs',
    'C:/Users/anice/OneDrive/Documents/ECA/Week3&4/person-app/mcp-server/index.ts',
  ],
  env: { DATABASE_URL: databaseUrl },
};

fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2), 'utf8');
console.log('Wrote', cfgPath);
console.log('mcpServers keys:', Object.keys(cfg.mcpServers));
