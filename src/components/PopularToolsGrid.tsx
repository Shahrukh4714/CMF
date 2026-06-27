import Link from "next/link";
import { Music, FileText, Image, Video } from "lucide-react";

interface PopularTool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const popularTools: PopularTool[] = [
  {
    id: "mp4-to-mp3", name: "MP4 to MP3", description: "Extract audio from video files",
    icon: <Music className="h-5 w-5 text-fg-brand" />, href: "/convert/mp4-to-mp3",
  },
  {
    id: "pdf-to-jpg", name: "PDF to JPG", description: "Convert PDF pages to high-quality images",
    icon: <FileText className="h-5 w-5 text-fg-brand" />, href: "/convert/pdf-to-jpg",
  },
  {
    id: "jpg-to-png", name: "JPG to PNG", description: "Convert JPG images to PNG with lossless quality",
    icon: <Image className="h-5 w-5 text-fg-brand" />, href: "/convert/jpg-to-png",
  },
  {
    id: "png-to-webp", name: "PNG to WebP", description: "Convert PNG to modern WebP format for smaller files",
    icon: <Image className="h-5 w-5 text-fg-brand" />, href: "/convert/png-to-webp",
  },
  {
    id: "mov-to-mp4", name: "MOV to MP4", description: "Convert QuickTime videos to widely compatible MP4",
    icon: <Video className="h-5 w-5 text-fg-brand" />, href: "/convert/mov-to-mp4",
  },
  {
    id: "mp4-to-gif", name: "MP4 to GIF", description: "Turn video clips into animated GIFs",
    icon: <Video className="h-5 w-5 text-fg-brand" />, href: "/convert/mp4-to-gif",
  },
  {
    id: "wav-to-mp3", name: "WAV to MP3", description: "Compress WAV audio to space-saving MP3",
    icon: <Music className="h-5 w-5 text-fg-brand" />, href: "/convert/wav-to-mp3",
  },
  {
    id: "webp-to-jpg", name: "WebP to JPG", description: "Convert WebP images to widely-supported JPG",
    icon: <Image className="h-5 w-5 text-fg-brand" />, href: "/convert/webp-to-jpg",
  },
];

export function PopularToolsGrid() {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-8 gap-3">
          {popularTools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="flex flex-col items-center text-center gap-3 rounded-base border border-border-default bg-neutral-primary-soft p-5 transition-all hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:border-border-default-strong no-underline"
            >
              <div className="w-12 h-12 rounded-base bg-brand-softer flex items-center justify-center">
                {tool.icon}
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-heading">{tool.name}</h3>
                <p className="text-sm text-body mt-0.5">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
