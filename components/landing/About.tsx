export default function About() {
  const values = [
    {
      number: "01",
      title: "Traditional Milling",
      description:
        "Time-tested chakki milling techniques that preserve natural nutrients and authentic flavors of every grain.",
    },
    {
      number: "02",
      title: "Pure & Natural",
      description:
        "No additives, preservatives, or chemicals. Every product is exactly as nature intended — wholesome and honest.",
    },
    {
      number: "03",
      title: "Community First",
      description:
        "A family-run store in Gurugram, serving our neighbourhood with food that nourishes body and soul.",
    },
  ];

  return (
    <section id="about" className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="font-script text-primary text-2xl md:text-3xl block leading-none mb-1">
            Our Story
          </span>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-charcoal mt-2 mb-6 leading-tight">
            Milling with Purpose,
            <br />
            <span className="text-primary">Serving with Heart</span>
          </h2>
          <p className="text-muted leading-relaxed text-base max-w-2xl">
            Master Miller was born from a simple belief: food should be pure,
            fresh, and full of natural goodness. From freshly ground flours to
            aromatic spices, cold-pressed oils to wholesome pulses — every
            product is carefully sourced and prepared to retain maximum
            nutrition and authentic taste.
          </p>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {values.map((value) => (
            <div
              key={value.number}
              className="border-t-2 border-primary/20 pt-6"
            >
              <span className="font-heading text-5xl font-extrabold text-primary/30">
                {value.number}
              </span>
              <h3 className="font-heading text-2xl font-bold text-charcoal mt-3 mb-2">
                {value.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {/* Banner strip */}
        <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-heading text-3xl md:text-4xl font-extrabold text-charcoal">
              Freshly milled,{" "}
              <span className="text-secondary">every day.</span>
            </h3>
            <p className="text-muted mt-2 text-sm">
              Shop No. 2 &amp; 3, Sector 65, Gurugram
            </p>
          </div>
          <div className="flex gap-8 shrink-0">
            <div className="text-center">
              <p className="font-heading text-4xl font-bold text-primary">
                100+
              </p>
              <p className="text-xs text-muted uppercase tracking-wider">
                Products
              </p>
            </div>
            <div className="text-center">
              <p className="font-heading text-4xl font-bold text-primary">
                1000+
              </p>
              <p className="text-xs text-muted uppercase tracking-wider">
                Customers
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
