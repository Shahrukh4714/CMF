import type { ReactNode } from "react";

const ShieldSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
const ServerSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
);
const LockSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
const EyeSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);
const TrashSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
);
const GlobeSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);

interface Principle {
  icon: ReactNode;
  title: string;
  description: string;
}

const items: Principle[] = [
  {
    icon: <ShieldSvg />, title: "Zero Uploads",
    description: "All file conversion happens entirely in your browser using WebAssembly, Canvas APIs, and client-side JavaScript. Your files never leave your device.",
  },
  {
    icon: <ServerSvg />, title: "No Servers",
    description: "We don't operate conversion servers. There's nothing to upload to - your data stays on your machine from start to finish.",
  },
  {
    icon: <LockSvg />, title: "Encryption Not Needed",
    description: "Since your files never leave your device, encryption during transit is unnecessary. Your data never transits anywhere.",
  },
  {
    icon: <EyeSvg />, title: "No Tracking",
    description: "We do not use analytics trackers, cookies, or any form of user tracking. We don't know who you are or what you convert.",
  },
  {
    icon: <TrashSvg />, title: "Automatic Cleanup",
    description: "The moment you close the tab, every trace of your conversion - including blob URLs and cached data - is gone forever.",
  },
  {
    icon: <GlobeSvg />, title: "Open Source",
    description: "Our code is open source and auditable. Anyone can verify that we do what we say - no hidden data collection, no backdoors.",
  },
];

function Badge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border-default px-3 py-1 text-xs text-body">
      <ShieldSvg className="h-3.5 w-3.5" />
      Privacy First
    </div>
  );
}

export const PrivacyPrinciples = { items, Badge };
