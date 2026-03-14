export default function Features() {
  const features = [
    {
      emoji: '🌿',
      title: '100% Natural',
      description: 'No chemicals, preservatives, or additives. Pure products from trusted sources.',
    },
    {
      emoji: '📦',
      title: 'Freshly Packed',
      description: 'Milled and packed fresh to order — maximum freshness and nutrition guaranteed.',
    },
    {
      emoji: '🏆',
      title: 'Premium Quality',
      description: 'Only the finest grains, spices, and ingredients make it to our shelves.',
    },
    {
      emoji: '✅',
      title: 'Quality Assured',
      description: 'Rigorous quality checks and hygienic processing for your peace of mind.',
    },
    {
      emoji: '💬',
      title: 'Easy Ordering',
      description: 'Simple online ordering with convenient WhatsApp checkout for quick delivery.',
    },
    {
      emoji: '⚙️',
      title: 'Traditional Methods',
      description: 'Time-tested chakki milling that preserves nutrients and authentic flavors.',
    },
  ];

  return (
    <section className="section-padding bg-cream">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">Why Us</span>
            <h2 className="font-heading text-5xl md:text-6xl font-bold text-charcoal mt-3 leading-tight">
              Why Choose<br />
              <span className="italic text-primary">Master Miller?</span>
            </h2>
          </div>
          <p className="text-muted text-sm max-w-xs leading-relaxed">
            Committed to delivering excellence in every grain, every spice, every product we offer.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-tan/30">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 hover:bg-cream transition-colors duration-200"
            >
              <span className="text-3xl mb-4 block">{feature.emoji}</span>
              <h3 className="font-heading text-xl font-semibold text-charcoal mb-2">{feature.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
