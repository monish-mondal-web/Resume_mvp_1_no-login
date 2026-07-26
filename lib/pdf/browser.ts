import type { Browser } from 'puppeteer-core';

// Module-level singleton — reused across requests in long-running Node.js processes.
// Uses @sparticuz/chromium-min (no bundled binary) with remote binary URL for Vercel/serverless.
// Falls back to local puppeteer in development.
let _browser: Browser | null = null;
let _launch: Promise<Browser> | null = null;

// Chromium v149 remote binary — downloaded to /tmp at runtime on serverless.
const CHROMIUM_REMOTE_URL =
  'https://github.com/Sparticuz/chromium/releases/download/v149.0.0/chromium-v149.0.0-pack.tar';

const LOCAL_ARGS = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-accelerated-2d-canvas',
  '--no-first-run',
  '--no-zygote',
  '--disable-gpu',
];

async function spawn(): Promise<Browser> {
  const isServerless = !!(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.NEXT_PUBLIC_VERCEL_ENV
  );

  if (isServerless) {
    // Use chromium-min (no bundled binary) — always download remote binary at runtime.
    // This keeps the serverless function bundle under Vercel's 50 MB limit.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chromium = (await import('@sparticuz/chromium-min')).default as any;
    const puppeteer = (await import('puppeteer-core')).default;

    const executablePath = await chromium.executablePath(CHROMIUM_REMOTE_URL);

    const b = await puppeteer.launch({
      args: [
        ...chromium.args,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process',
      ],
      defaultViewport: chromium.defaultViewport ?? { width: 1240, height: 1754 },
      executablePath,
      headless: chromium.headless ?? true,
    });
    _browser = b as unknown as Browser;
  } else {
    // Local development — use regular puppeteer with bundled Chromium.
    const puppeteer = (await import('puppeteer')).default;
    const b = await puppeteer.launch({ headless: true, args: LOCAL_ARGS });
    _browser = b as unknown as Browser;
  }

  _browser.once('disconnected', () => {
    _browser = null;
    _launch = null;
  });

  return _browser;
}

export async function getBrowser(): Promise<Browser> {
  if (_browser?.connected) return _browser;
  if (!_launch) {
    _launch = spawn().catch((err) => {
      _launch = null;
      throw err;
    });
  }
  return _launch;
}
