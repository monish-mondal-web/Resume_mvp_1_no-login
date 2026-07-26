import type { TemplateId, TemplateOptions } from '@/types/resume.types';

const CSS_PIXELS_PER_INCH = 96;
const MILLIMETRES_PER_INCH = 25.4;

export const A4_WIDTH_PX = (210 / MILLIMETRES_PER_INCH) * CSS_PIXELS_PER_INCH;
export const A4_HEIGHT_PX = (297 / MILLIMETRES_PER_INCH) * CSS_PIXELS_PER_INCH;

export interface ResumePagePadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ResumePageMetrics {
  width: number;
  height: number;
  padding: ResumePagePadding;
  contentWidth: number;
  contentHeight: number;
}

export interface ResumePageRenderLayout {
  mode: 'columns' | 'print';
  contentWidth: number;
  contentHeight: number;
}

export function getResumePageMetrics(
  templateId: TemplateId,
  options: TemplateOptions
): ResumePageMetrics {
  const paddingPreset = options.pagePadding ?? 'normal';

  const [vertical, horizontal] =
    templateId === 'template2'
      ? paddingPreset === 'narrow'
        ? [12, 20]
        : paddingPreset === 'wide'
          ? [28, 48]
          : [20, 36]
      : paddingPreset === 'narrow'
        ? [10, 16]
        : paddingPreset === 'wide'
          ? [24, 40]
          : [16, 28];

  const padding = {
    top: vertical,
    right: horizontal,
    bottom: vertical,
    left: horizontal,
  };

  return {
    width: A4_WIDTH_PX,
    height: A4_HEIGHT_PX,
    padding,
    contentWidth: A4_WIDTH_PX - padding.left - padding.right,
    contentHeight: A4_HEIGHT_PX - padding.top - padding.bottom,
  };
}
