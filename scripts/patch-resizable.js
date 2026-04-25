const fs = require('fs');
let c = fs.readFileSync('d:/Fresh Resume/app/onboarding/OnboardingClient.tsx', 'utf8');

// 1. Add containerWidth state + useResizablePane hook call after resumeData useMemo
const resumeDataEnd = c.indexOf('], [personalInfo, experience,');
if (resumeDataEnd !== -1) {
  // Find the closing ]); of the useMemo
  const closeIdx = c.indexOf(']);\r\n', resumeDataEnd);
  if (closeIdx !== -1) {
    const insertAt = closeIdx + 5; // after ']);\r\n'
    const toInsert = `\r\n  const [containerWidth, setContainerWidth] = React.useState(1200);\r\n  useEffect(() => {\r\n    const update = () => setContainerWidth(window.innerWidth);\r\n    update();\r\n    window.addEventListener('resize', update);\r\n    return () => window.removeEventListener('resize', update);\r\n  }, []);\r\n  const { leftWidth, onDividerMouseDown } = useResizablePane(containerWidth);\r\n`;
    c = c.slice(0, insertAt) + toInsert + c.slice(insertAt);
    console.log('[OK] Added containerWidth + useResizablePane hook');
  } else {
    console.log('[SKIP] Could not find end of useMemo');
  }
} else {
  console.log('[SKIP] resumeData useMemo end not found');
}

// 2. Replace static width 620 with leftWidth
c = c.replace(
  `style={{ width: 620 }}>`,
  `style={{ width: leftWidth }}>`,
);
console.log('[OK] Replaced static width with leftWidth');

// 3. Add resizable divider between left pane and preview
c = c.replace(
  `      </div>{/* end left pane */}\r\n\r\n      {/* ── Right pane: live preview ── */}`,
  `      </div>{/* end left pane */}\r\n\r\n      {/* ── Resize divider ── */}\r\n      <div\r\n        onMouseDown={onDividerMouseDown}\r\n        className="hidden md:flex w-1.5 flex-shrink-0 cursor-col-resize items-center justify-center bg-slate-200 hover:bg-indigo-400/60 transition-colors active:bg-indigo-500/60 group"\r\n      >\r\n        <div className="h-8 w-0.5 rounded-full bg-slate-400 group-hover:bg-white/80" />\r\n      </div>\r\n\r\n      {/* ── Right pane: live preview ── */}`,
);
console.log('[OK] Added resize divider');

fs.writeFileSync('d:/Fresh Resume/app/onboarding/OnboardingClient.tsx', c, 'utf8');

// Verify
const updated = fs.readFileSync('d:/Fresh Resume/app/onboarding/OnboardingClient.tsx', 'utf8');
console.log('\nuseResizablePane called:', updated.includes('useResizablePane(containerWidth)'));
console.log('leftWidth used:', updated.includes('width: leftWidth'));
console.log('divider present:', updated.includes('Resize divider'));
console.log('onDividerMouseDown present:', updated.includes('onDividerMouseDown'));
