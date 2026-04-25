export async function downloadAsPDF(elementId: string, filename = 'resume.pdf'): Promise<void> {
  const el = document.getElementById(elementId);
  if (!el) throw new Error(`Element #${elementId} not found`);

  const html2canvas = (await import('html2canvas')).default;
  const { jsPDF } = await import('jspdf');

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    allowTaint: false,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: 'a4',
  });

  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const ratio = canvas.width / canvas.height;
  const imgH  = pageW / ratio;

  let yPos = 0;
  let remaining = imgH;

  while (remaining > 0) {
    pdf.addImage(imgData, 'PNG', 0, -yPos, pageW, imgH);
    remaining -= pageH;
    yPos += pageH;
    if (remaining > 0) pdf.addPage();
  }

  pdf.save(filename);
}

export async function downloadAsImage(
  elementId: string,
  format: 'png' | 'jpg' = 'png',
  filename?: string
): Promise<void> {
  const el = document.getElementById(elementId);
  if (!el) throw new Error(`Element #${elementId} not found`);

  const html2canvas = (await import('html2canvas')).default;

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    allowTaint: false,
    backgroundColor: '#ffffff',
  });

  const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
  const defaultName = filename ?? `resume.${format}`;

  const link = document.createElement('a');
  link.download = defaultName;
  link.href = canvas.toDataURL(mimeType, 0.95);
  link.click();
}
