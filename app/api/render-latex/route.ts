/**
 * POST /api/render-latex
 *
 * Compiles a LaTeX string server-side and returns a PDF.
 *
 * PREREQUISITES:
 *   Windows: Install MiKTeX → https://miktex.org/download
 *   Linux:   apt install texlive-full
 *   Docker:  FROM texlive/texlive:latest
 *
 * Body: { latex: string; filename?: string }
 * Response: application/pdf  (or JSON { error } on failure)
 *
 * Frontend usage (debounced, ~1s after user stops typing):
 *
 *   const res = await fetch('/api/render-latex', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ latex }),
 *   });
 *   if (res.ok) {
 *     const blob = await res.blob();
 *     const url  = URL.createObjectURL(blob);
 *     iframeRef.current.src = url;
 *   }
 */

import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { writeFile, readFile, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Find pdflatex — MiKTeX on Windows installs to one of these paths
const PDFLATEX_CANDIDATES = [
  'pdflatex',                                            // on PATH
  'C:\\Program Files\\MiKTeX\\miktex\\bin\\x64\\pdflatex.exe',
  'C:\\Users\\USER\\AppData\\Local\\Programs\\MiKTeX\\miktex\\bin\\x64\\pdflatex.exe',
  '/usr/bin/pdflatex',
  '/usr/local/bin/pdflatex',
];

async function findPdflatex(): Promise<string | null> {
  for (const candidate of PDFLATEX_CANDIDATES) {
    try {
      await execAsync(`"${candidate}" --version`);
      return candidate;
    } catch {}
  }
  return null;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.latex) {
    return NextResponse.json({ error: 'Missing latex field' }, { status: 400 });
  }

  const pdflatex = await findPdflatex();
  if (!pdflatex) {
    return NextResponse.json(
      { error: 'pdflatex not found. Install MiKTeX (Windows) or texlive (Linux) and ensure pdflatex is on PATH.' },
      { status: 503 },
    );
  }

  const id  = randomUUID();
  const dir = join(tmpdir(), `resume-${id}`);
  const tex = join(dir, 'resume.tex');
  const pdf = join(dir, 'resume.pdf');

  try {
    await rm(dir, { recursive: true, force: true });
    await import('fs').then(fs => fs.promises.mkdir(dir, { recursive: true }));
    await writeFile(tex, body.latex, 'utf8');

    // Run twice for correct cross-references
    const cmd = `"${pdflatex}" -interaction=nonstopmode -output-directory="${dir}" "${tex}"`;
    await execAsync(cmd, { timeout: 30_000 });

    const pdfBuffer = await readFile(pdf);
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${body.filename ?? 'resume.pdf'}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[render-latex] Compilation error:', msg);
    return NextResponse.json({ error: 'LaTeX compilation failed', details: msg }, { status: 500 });
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}
