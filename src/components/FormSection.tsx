import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description: string;
  children: ReactNode;
  rightElement?: ReactNode;
}

export default function FormSection({
  title,
  description,
  children,
  rightElement,
}: FormSectionProps) {
  return (
    <div className="grid grid-cols-[300px_1fr] gap-8 items-start border-b border-border pb-6">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">{title}</h3>
          {rightElement}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}
