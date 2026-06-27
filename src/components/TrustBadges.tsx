import { Shield, Globe, UserX, DollarSign } from "lucide-react";

const badges = [
  {
    icon: <DollarSign className="h-4 w-4" />,
    label: "Free",
    description: "No hidden costs",
  },
  {
    icon: <Shield className="h-4 w-4" />,
    label: "Secure",
    description: "100% browser-based",
  },
  {
    icon: <UserX className="h-4 w-4" />,
    label: "No signup",
    description: "No account needed",
  },
  {
    icon: <Globe className="h-4 w-4" />,
    label: "Browser based",
    description: "Works anywhere",
  },
];

export function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
      {badges.map((badge) => (
        <div
          key={badge.label}
          className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-border-default bg-neutral-primary-soft"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-softer text-fg-brand">
            {badge.icon}
          </div>
          <div className="text-left">
            <span className="text-sm font-medium text-heading leading-tight block">
              {badge.label}
            </span>
            <span className="text-[11px] text-body leading-tight block">
              {badge.description}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
