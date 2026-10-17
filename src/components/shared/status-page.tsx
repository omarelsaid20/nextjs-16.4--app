import type { ReactNode } from 'react';
import { Container } from '@/components/shared/container';

type StatusPageProps = {
  title: string;
  body: string;
  actions: ReactNode;
};

// Shared by the Coming soon pages, the 404 page and the error boundary.
export function StatusPage({ title, body, actions }: StatusPageProps) {
  return (
    <section className="bg-tint-50">
      <Container className="flex min-h-[60svh] flex-col items-center justify-center gap-6 py-20 text-center">
        <h1 className="text-3xl leading-snug font-bold text-ink md:text-4xl">
          {title}
        </h1>
        <p className="max-w-xl text-lg leading-relaxed">{body}</p>
        <div className="flex flex-wrap justify-center gap-4">{actions}</div>
      </Container>
    </section>
  );
}
