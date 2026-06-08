# Optional Feature: PDF Export

If you decide you want to add the PDF export functionality back into RepoRoast (e.g., to sell audits to clients), follow these steps to integrate it in one go.

### 1. Install Dependencies
Run this in your `client` terminal:
```bash
npm install react-to-print
```

### 2. Update `client/src/pages/ResultPage.tsx`
Import the necessary hooks and icons:
```tsx
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Download } from 'lucide-react';
```

Inside the component, initialize the print handler:
```tsx
  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef });
```

Add the Download button to the navbar:
```tsx
  <button 
    onClick={() => handlePrint()}
    className="flex items-center gap-2 text-sm font-medium text-textSecondary hover:text-textPrimary transition-colors bg-surface border border-border px-4 py-2 rounded-full hover:border-[#8b949e] cursor-pointer"
  >
    <Download className="w-4 h-4" />
    <span className="hidden sm:inline">Download PDF</span>
  </button>
```

Wrap the `<main>` tag with the ref and apply print-specific Tailwind overrides to kill animations:
```tsx
  <main ref={contentRef} className="print:p-8 print:bg-background print:text-textPrimary">
```
And add `print:!pb-0 print:!transform-none print:!filter-none print:!opacity-100` to the outermost `<motion.div>` class list.

### 3. Update `client/src/components/CategorySection.tsx`
To make sure Framer Motion doesn't break the PDF rendering, force the expandable sections to be visible during print:

```tsx
  <motion.div
    initial={false}
    animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    className="overflow-hidden print:!h-auto print:!opacity-100 print:!overflow-visible print:!transform-none"
  >
```
And add `print:break-before-page print:!transform-none print:!opacity-100` to the outer `<motion.div>`.

### 4. Update `client/src/components/IssueCard.tsx`
Kill animations on the issue cards during print by adding `print:!transform-none print:!opacity-100` to the `motion.div` class list.
