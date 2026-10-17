type FeatureCardProps = {
  title: string;
  description: string;
};

// Capped at 384px wide so a single column of cards stays readable.
export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="mx-auto flex w-full max-w-96 card-hover flex-col gap-4 rounded-card bg-tint-100 p-8 text-center lg:p-10.5">
      <h3 className="text-xl font-medium text-brand">{title}</h3>
      <p className="text-lg leading-relaxed md:text-xl">{description}</p>
    </div>
  );
}
