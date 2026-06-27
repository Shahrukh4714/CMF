import Link from "next/link";
import { Image, FileText, Video, Music, Wrench } from "lucide-react";
import type { ToolDefinition } from "@/data/tools";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ReactNode> = {
  image: <Image className="h-4 w-4 text-fg-brand" />,
  "file-text": <FileText className="h-4 w-4 text-fg-brand" />,
  video: <Video className="h-4 w-4 text-fg-brand" />,
  music: <Music className="h-4 w-4 text-fg-brand" />,
  wrench: <Wrench className="h-4 w-4 text-fg-brand" />,
};

interface ToolCardProps {
  tool: ToolDefinition;
  className?: string;
  compact?: boolean;
}

export function ToolCard({ tool, className, compact }: ToolCardProps) {
  if (tool.comingSoon) return null;
  const catIcon = iconMap[tool.categoryId] || <Wrench className="h-4 w-4 text-fg-brand" />;

  if (compact) {
    return (
      <Link
        href={`/convert/${tool.slug}`}
        aria-label={`Convert ${tool.name}`}
        className={cn(
          "card-interactive flex items-center gap-3 px-3 py-2.5 no-underline",
          tool.comingSoon && "opacity-50 pointer-events-none",
          className
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-softer text-[10px] font-semibold text-fg-brand">
          {tool.inputFormat.ext.toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-heading truncate">{tool.shortName || tool.name}</p>
          <p className="text-[10px] text-body-subtle truncate">{tool.categoryId}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/convert/${tool.slug}`}
      aria-label={`Convert ${tool.name} - ${tool.description}`}
      className={cn(
        "card-interactive relative flex flex-col items-center gap-3 p-5 no-underline",
        tool.comingSoon && "opacity-50 pointer-events-none",
        className
      )}
    >
      {tool.comingSoon && (
        <span className="absolute -top-2 -right-2 rounded-full border border-border-default bg-neutral-tertiary px-2 py-0.5 text-[10px] font-medium text-body">
          Soon
        </span>
      )}
      <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-brand-softer">
        {catIcon}
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-heading leading-tight">{tool.shortName || tool.name}</p>
        <p className="mt-0.5 text-xs text-body line-clamp-2">{tool.description}</p>
      </div>
    </Link>
  );
}
