import type { Browser } from 'puppeteer';

// Module-level singleton — reused across requests in long-running Node.js processes.
// For serverless (Vercel/Lambda), replace with puppeteer-core + @sparticuz/chromium.
let _browser: Browser | null = null;
let _launch: Promise<Browser> | null = null;

const ARGS = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-accelerated-2d-canvas',
  '--no-first-run',
  '--no-zygote',
  '--disable-gpu',
];

async function spawn(): Promise<Browser> {
  const { default: puppeteer } = await import('puppeteer');
  const b = await puppeteer.launch({ headless: true, args: ARGS });
  _browser = b;
  b.once('disconnected', () => { _browser = null; _launch = null; });
  return b;
}

export async function getBrowser(): Promise<Browser> {
  if (_browser?.connected) return _browser;
  if (!_launch) {
    _launch = spawn().catch(err => { _launch = null; throw err; });
  }
  return _launch;
}
