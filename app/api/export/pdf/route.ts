import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, getIP, createRateLimitResponse } from '@/lib/security/limiter';
import type { ResumeData, TemplateId, TemplateOptions } from '@/types/resume.types';

// Must run in Node.js — Puppeteer requires native modules unavailable in Edge.
export const runtime = 'nodejs';
// Allow up to 30 s for browser launch + render on cold start.
export const maxDuration = 30;

// ── Request schema ────────────────────────────────────────────────────────────
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
  headingFont:       z.enum(['sans', 'serif', 'mono', 'inter', 'georgia']).optional(),
  showContactIcons:  z.boolean().optional(),
  imageShape:        z.enum(['circle', 'rounded', 'square']).optional(),
  imageSize:         z.enum(['sm', 'md', 'lg']).optional(),
  imageBorder:       z.boolean().optional(),
});

const RequestSchema = z.object({
  data:       z.record(z.string(), z.unknown()),
  templateId: z.enum(['template1', 'template2', 'template3']),
  options:    OptionsSchema,
  pageBreaks: z.array(z.number().int().min(1).max(200)).max(100).optional(),
});

// ── POST /api/export/pdf ──────────────────────────────────────────────────────
export async function POST(req: NextRequest): Promise<NextResponse> {
  // Rate Limiting
  const ip = getIP(req);
  const rl = rateLimit(ip, 'export:pdf', { limit: 5, windowMs: 60 * 1000 }); // 5 per min
  if (!rl.success) return createRateLimitResponse(rl.resetAt);

  // Size guard (5 MB)
  const cl = req.headers.get('content-length');
  if (cl && parseInt(cl, 10) > 5_242_880) {
    return NextResponse.json({ error: 'Request body too large' }, { status: 413 });
  }

  // Parse + validate
  let raw: unknown;
  try { raw = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const parsed = RequestSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request data', issues: parsed.error.issues }, { status: 400 });
  }

  const { data, templateId, options, pageBreaks = [] } = parsed.data;

  const personal = (data as Record<string, unknown>).personal as Record<string, unknown> | undefined;
  if (personal?.image) {
    const img = personal.image as { url?: string };
    if (typeof img.url === 'string' && img.url.startsWith('blob:')) {
      personal.image = null;
    }
  }

  // Render HTML + generate PDF
  try {
    const [{ renderReactResumeHTML }, { getBrowser }] = await Promise.all([
      import('@/lib/pdf/renderReactTemplate'),
      import('@/lib/pdf/browser'),
    ]);

    const html = renderReactResumeHTML(
      data as unknown as ResumeData,
      templateId as TemplateId,
      options as TemplateOptions,
      pageBreaks,
    );

    const browser = await getBrowser();
    const page = await browser.newPage();

    try {
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

      const usesRemoteFont = [options.fontFamily, options.headingFont]
        .some((font) => font === 'inter' || font === 'serif');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const waitUntil: any = usesRemoteFont ? 'networkidle0' : 'domcontentloaded';
      await page.setContent(html, { waitUntil, timeout: 20_000 });

      await page.evaluate(async () => {
        await document.fonts.ready;
      });
      await page.evaluate(() =>
        Promise.all(
          Array.from(document.images)
            .filter(img => !img.complete)
            .map(img => new Promise<void>(res => { img.onload = img.onerror = () => res(); }))
        )
      );

      const pdfBuffer = await page.pdf({
        format:              'A4',
        printBackground:     true,
        preferCSSPageSize:   true,
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
