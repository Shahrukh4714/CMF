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
              When you load a file onto Convertmyfiles, the conversion happens locally in your browser memory. 
              We utilize high-performance modern web technologies like <strong>WebAssembly (WASM)</strong> to run client-side ports of FFmpeg for audio/video, the Canvas API for image transcoding, and PDFJS/pdf-lib for documents. 
              No files are ever uploaded or transmitted across the internet.
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
              There are no user accounts to create, no registration forms, and no server databases. 
              Everything starts and finishes on your local device. Once you close the browser tab, your file cache is automatically wiped clean by the browser.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
