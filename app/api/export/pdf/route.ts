import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { ResumeData, TemplateId, TemplateOptions } from '@/types/resume.types';

// Must run in Node.js — Puppeteer requires native modules unavailable in Edge.
export const runtime = 'nodejs';
// Allow up to 30 s for browser launch + render on cold start.
export const maxDuration = 30;

// ── Request schema ────────────────────────────────────────────────────────────
// Zod v4 breaking change: z.record() now requires (keySchema, valueSchema)
const OptionsSchema = z.object({
  accentColor:       z.enum(['indigo','violet','blue','sky','teal','emerald','rose','orange','amber','slate']),
  fontSize:          z.enum(['sm', 'md', 'lg']),
  spacing:           z.enum(['compact', 'normal', 'relaxed']),
  fontFamily:        z.enum(['sans', 'serif', 'mono', 'inter', 'georgia']),
  showPhoto:         z.boolean(),
  customAccentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  pagePadding:       z.enum(['narrow', 'normal', 'wide']).optional(),
  linkColor:         z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  lineWeight:        z.enum(['thin', 'normal', 'thick']).optional(),
});

const RequestSchema = z.object({
  data:       z.record(z.string(), z.unknown()), // ResumeData — trusted, user session data
  templateId: z.enum(['template1', 'template2', 'template3']),
  options:    OptionsSchema,
});

// ── POST /api/export/pdf ──────────────────────────────────────────────────────
export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── 1. Size guard (5 MB) ────────────────────────────────────────────────────
  const cl = req.headers.get('content-length');
  if (cl && parseInt(cl, 10) > 5_242_880) {
    return NextResponse.json({ error: 'Request body too large' }, { status: 413 });
  }

  // ── 2. Parse + validate ─────────────────────────────────────────────────────
  let raw: unknown;
  try { raw = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const parsed = RequestSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request data', issues: parsed.error.issues }, { status: 400 });
  }

  const { data, templateId, options } = parsed.data;

  // blob: URLs are browser-local and can't be resolved by Puppeteer — strip them
  const personal = (data as Record<string, unknown>).personal as Record<string, unknown> | undefined;
  if (personal?.image) {
    const img = personal.image as { url?: string };
    if (typeof img.url === 'string' && img.url.startsWith('blob:')) {
      personal.image = null;
    }
  }

  // ── 3. Render HTML + generate PDF ───────────────────────────────────────────
  try {
    // Dynamic imports keep these heavy modules out of the edge bundle
    const [{ renderResumeHTML }, { getBrowser }] = await Promise.all([
      import('@/lib/pdf/renderTemplate'),
      import('@/lib/pdf/browser'),
    ]);

    const html = renderResumeHTML(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data as unknown as ResumeData,
      templateId as TemplateId,
      options as TemplateOptions,
    );

    const browser = await getBrowser();
    const page = await browser.newPage();

    try {
      // Restrict outbound requests: allow fonts/images, block everything else
      await page.setRequestInterception(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      page.on('request', (r: any) => {
        const type: string = r.resourceType();
        if (['document', 'stylesheet', 'font', 'image'].includes(type)) {
          r.continue();
        } else {
          r.abort();
        }
      });

      const waitUntil = options.fontFamily === 'inter' ? 'networkidle0' : 'domcontentloaded';
      await page.setContent(html, { waitUntil, timeout: 20_000 });

      // Wait for fonts and images to finish loading
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(() =>
        Promise.all(
          Array.from(document.images)
            .filter(img => !img.complete)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map(img => new Promise<void>(res => { img.onload = img.onerror = () => res(); }))
        )
      );

      const pdfBuffer = await page.pdf({
        format:              'A4',
        printBackground:     true,
        preferCSSPageSize:   false,
        displayHeaderFooter: false,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      });

      return new NextResponse(new Uint8Array(pdfBuffer), {
        status: 200,
        headers: {
          'Content-Type':           'application/pdf',
          'Content-Disposition':    'attachment; filename="resume.pdf"',
          'Cache-Control':          'no-store',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    } finally {
      await page.close();
    }
  } catch (err) {
    console.error('[pdf/export] Error:', err);
    return NextResponse.json(
      { error: 'PDF generation failed. Please try again.' },
      { status: 500 },
    );
  }
}
