import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';

const DATA_FILE = path.resolve(process.cwd(), 'data/records.json');

function ensureDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/Jessica-agent/' : '/',
  plugins: [
    react(),
    {
      name: 'json-storage',
      configureServer(server) {
        server.middlewares.use(
          '/api/records',
          (req: IncomingMessage, res: ServerResponse) => {
            res.setHeader('Content-Type', 'application/json');

            if (req.method === 'GET') {
              try {
                const data = fs.existsSync(DATA_FILE)
                  ? fs.readFileSync(DATA_FILE, 'utf-8')
                  : '[]';
                res.end(data);
              } catch {
                res.statusCode = 500;
                res.end('[]');
              }
            } else if (req.method === 'POST') {
              let body = '';
              req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
              req.on('end', () => {
                try {
                  JSON.parse(body); // validate before writing
                  ensureDir();
                  fs.writeFileSync(DATA_FILE, JSON.stringify(JSON.parse(body), null, 2), 'utf-8');
                  res.end('{"ok":true}');
                } catch {
                  res.statusCode = 400;
                  res.end('{"error":"invalid json"}');
                }
              });
            } else {
              res.statusCode = 405;
              res.end('{}');
            }
          }
        );
      },
    },
  ],
});
