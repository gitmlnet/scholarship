import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';

interface PageShellProps {
  title: string;
  description?: string;
  children: ReactNode;
}

/** Standard inner-page scaffold (consistent heading hierarchy + spacing). */
export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <Container as="section" className="py-12 md:py-16">
      <h1 className="text-navy-950 max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
        {title}
      </h1>
      {description && <p className="text-ink-muted mt-4 max-w-2xl text-lg">{description}</p>}
      {children && <div className="mt-10">{children}</div>}
    </Container>
  );
}
