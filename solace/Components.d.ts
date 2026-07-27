// Components.d.ts — the complete catalog of the 1 component(s) in
// Components.bundle.js. READ THIS FILE BEFORE USING THE BUNDLE: component
// names are derived from Figma layer names (sanitized to PascalCase,
// deduplicated) and may differ from what the design calls them — the
// "figma layer" comment above each interface maps them back.
// After the bundle <script> loads, every component is a window global
// (e.g. window.SOLACEHP) and usable directly in JSX.
import * as React from 'react';

// figma layer: "SOLACE HP" (node 1803:2)
export interface SOLACEHPProps {
  className?: string;
  style?: React.CSSProperties;
}

declare const SOLACEHP: React.FC<SOLACEHPProps>;
declare global {
  interface Window {
    SOLACEHP: React.FC<SOLACEHPProps>;
  }
}
