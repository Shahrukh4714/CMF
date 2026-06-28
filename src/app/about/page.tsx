import { Shield, Cpu, Zap, Lock, Info } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="max-w-[920px] mx-auto px-6 py-16 md:py-24">
      {/* Header section */}
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accentbg border border-accentbd text-xs font-mono font-medium text-fg-brand">
          <Info className="h-3 w-3 text-fg-brand" />
          About the Project
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-heading">
          About Convertmyfiles
        </h1>
        <p className="text-base sm:text-lg text-body max-w-[640px] mx-auto leading-relaxed">
          We believe file conversion should be fast, private, and free for everyone. 
          That&apos;s why we built a converter that runs entirely on your terms.
        </p>
      </div>

      {/* Grid of key sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Why we built it */}
        <div className="card-interactive p-8 flex flex-col gap-4">
          <div className="w-10 h-10 rounded-lg bg-accentbg border border-accentbd flex items-center justify-center text-fg-brand">
            <Zap className="h-5 w-5 text-fg-brand" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-heading mb-2">Why we built it</h2>
            <p className="text-sm text-body leading-relaxed">
              Most online file converters upload your files to a remote server, process them, and ask you to download the result. 
              This means your private documents, personal photos, and sensitive videos pass through someone else&apos;s computer. 
              We wanted to build a safer alternative: a tool where you retain 100% ownership of your data.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="card-interactive p-8 flex flex-col gap-4">
          <div className="w-10 h-10 rounded-lg bg-accentbg border border-accentbd flex items-center justify-center text-fg-brand">
            <Cpu className="h-5 w-5 text-fg-brand" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-heading mb-2">How it works</h2>
            <p className="text-sm text-body leading-relaxed">
              Convertmyfiles utilizes high-performance modern web technologies like <strong>WebAssembly (WASM)</strong> to run client-side ports of FFmpeg for audio/video, the Canvas API for image transcoding, and pdf-lib for local PDF modifications directly in your browser. For document conversions requiring external layout engines (such as DOCX to PDF, PDF to Word, or EPUB to PDF), files are securely processed in-memory via our transient serverless APIs and never written to disk.
            </p>
          </div>
        </div>

        {/* What we support */}
        <div className="card-interactive p-8 flex flex-col gap-4">
          <div className="w-10 h-10 rounded-lg bg-accentbg border border-accentbd flex items-center justify-center text-fg-brand">
            <Lock className="h-5 w-5 text-fg-brand" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-heading mb-2">What we support</h2>
            <p className="text-sm text-body leading-relaxed">
              We support over 100+ file format combinations across video, audio, images, documents, and developer utility datasets. 
              Whether you need to extract MP3 audio from a video, convert an iPhone HEIC photo to standard JPG, minify JSON datasets, or encrypt/rotate PDFs — you can do it instantly without installing any desktop programs.
            </p>
          </div>
        </div>

        {/* Our commitment to privacy */}
        <div className="card-interactive p-8 flex flex-col gap-4">
          <div className="w-10 h-10 rounded-lg bg-accentbg border border-accentbd flex items-center justify-center text-fg-brand">
            <Shield className="h-5 w-5 text-fg-brand" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-heading mb-2">Our commitment to privacy</h2>
            <p className="text-sm text-body leading-relaxed">
              We do not collect your files, store your logs, or track your document conversions. 
              There are no user accounts to create, no registration forms, and no database tracking. 
              Local files stay on your device, and API files are processed purely in-memory and immediately destroyed. Once you close the tab, all session caches are wiped clean.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
