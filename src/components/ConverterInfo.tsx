import type { ToolDefinition } from "@/data/tools";

interface ConverterInfoProps {
  tool: ToolDefinition;
}

export function ConverterInfo({ tool }: ConverterInfoProps) {
  const { content, inputFormat: i, outputFormat: o, name } = tool;
  const outputName = o?.name || tool.outputFormats[0].toUpperCase();
  const inputName = i.name;

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="space-y-10">
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-body-subtle">
              About {name}
            </h2>
            <div className="text-sm text-body leading-relaxed whitespace-pre-line">
              {content.introduction}
            </div>
          </div>

          {content.howToGuide.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-body-subtle">
                How to convert {inputName} to {outputName}
              </h2>
              <div className="space-y-4">
                {content.howToGuide.map((step) => (
                  <div key={step.step} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-softer text-sm font-semibold text-fg-brand">
                      {step.step}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-heading font-semibold">{step.title}</p>
                      <p className="text-sm text-body">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {content.benefits.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-body-subtle">
                Why use Convertmyfiles
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {content.benefits.map((benefit, idx) => (
                  <div key={idx} className="rounded-base border border-border-default p-4 space-y-1">
                    <p className="text-sm font-semibold text-heading">{benefit.title}</p>
                    <p className="text-sm text-body">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {content.useCases.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-body-subtle">
                Common use cases
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {content.useCases.map((useCase, idx) => (
                  <div key={idx} className="rounded-base border border-border-default p-4 space-y-1">
                    <p className="text-sm font-semibold text-heading">{useCase.title}</p>
                    <p className="text-sm text-body">{useCase.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
