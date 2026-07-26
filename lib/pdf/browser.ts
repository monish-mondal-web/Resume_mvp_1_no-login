import type { Browser } from 'puppeteer-core';

// Module-level singleton — reused across requests in long-running Node.js processes.
// Supports both local Node.js and Vercel/Lambda serverless execution.
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
  const isServerless = !!(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.NEXT_PUBLIC_VERCEL_ENV
  );

  if (isServerless) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chromium = (await import('@sparticuz/chromium')).default as any;
    const puppeteer = (await import('puppeteer-core')).default;

    let executablePath: string;
    try {
      executablePath = await chromium.executablePath();
    } catch (e) {
      console.warn('[pdf/browser] Local chromium binary resolution failed, using remote release fallback:', e);
      executablePath = await chromium.executablePath(
        'https://github.com/Sparticuz/chromium/releases/download/v149.0.0/chromium-v149.0.0-pack.tar'
      );
    }

    const b = await puppeteer.launch({
      args: [...(chromium.args || []), '--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
      defaultViewport: chromium.defaultViewport || { width: 1200, height: 800 },
      executablePath,
      headless: chromium.headless ?? true,
    });
    _browser = b as unknown as Browser;
  } else {
    try {
      const puppeteer = (await import('puppeteer')).default;
      const b = await puppeteer.launch({ headless: true, args: ARGS });
      _browser = b as unknown as Browser;
    } catch {
      // Fallback to puppeteer-core + @sparticuz/chromium if local puppeteer binary is not found
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const chromium = (await import('@sparticuz/chromium')).default as any;
      const puppeteer = (await import('puppeteer-core')).default;
      
      let executablePath: string;
      try {
        executablePath = await chromium.executablePath();
      } catch {
        executablePath = await chromium.executablePath(
          'https://github.com/Sparticuz/chromium/releases/download/v149.0.0/chromium-v149.0.0-pack.tar'
        );
      }

      const b = await puppeteer.launch({
        args: [...(chromium.args || []), '--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
        defaultViewport: chromium.defaultViewport || { width: 1200, height: 800 },
        executablePath,
        headless: chromium.headless ?? true,
      });
      _browser = b as unknown as Browser;
    }
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

