import Link from "next/link";
import { type ToolCategory, getFormatByExt } from "@/data/tools";

interface CategoryHeroProps {
  category: ToolCategory;
  toolCount: number;
  formatCount: number;
  formats?: string[];
}

export function CategoryHero({ category, toolCount, formatCount, formats }: CategoryHeroProps) {
  const knownFormats = (formats?.map((f) => getFormatByExt(f)).filter((f): f is NonNullable<typeof f> => f != null) || []);

  return (
    <section className="bg-neutral-primary-soft">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-12 pb-8">
        <div className="max-w-3xl space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight text-heading">
            {category.name} Tools
          </h1>

          <p className="text-base text-body leading-relaxed">
            {category.description}. All {toolCount} tools are 100% free, private, and work entirely in your browser.
            No upload required — your files never leave your device.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-body">
            <span className="flex items-center gap-1.5">
              <span className="font-semibold text-heading">{toolCount}</span> tools
            </span>
            <span className="flex items-center gap-1.5">
              <span className="font-semibold text-heading">{formatCount}</span> formats supported
            </span>
            <span className="flex items-center gap-1.5 text-fg-success">
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              All free
            </span>
          </div>

          <hr className="border-border-default" />

          {knownFormats.length > 0 && (
            <div className="flex flex-wrap items-center pt-1">
              <span className="text-xs text-body">
                {knownFormats.slice(0, 12).map((fmt, i) => (
                  <span key={fmt.ext}>
                    {i > 0 && <span className="mx-1.5">&middot;</span>}
                    <Link
                      href={`/convert?format=${fmt.ext}`}
                      className="font-mono hover:text-heading transition-colors text-body"
                    >
                      {fmt.ext.toUpperCase()}
                    </Link>
                  </span>
                ))}
              </span>
              {knownFormats.length > 12 && (
                <span className="text-xs text-body ml-1">
                  &middot; +{knownFormats.length - 12}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
