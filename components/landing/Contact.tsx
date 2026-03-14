import { MapPin, Phone, Mail, Instagram, Clock } from 'lucide-react';

export default function Contact() {
  const contactItems = [
    {
      icon: MapPin,
      label: 'Address',
      content: (
        <address className="not-italic text-muted text-sm leading-relaxed">
          Shop No. 2 &amp; 3, Near Indian Oil Petrol Pump,<br />
           Golf Course Extension Road,<br />
          Sector 65, Gurugram – 122102, Haryana
        </address>
      ),
    },
    {
      icon: Phone,
      label: 'Phone',
      content: (
        <div className="space-y-1">
          <a href="tel:+918404003000" className="block text-sm text-muted hover:text-primary transition-colors">+91 84040-03000</a>
          <a href="tel:+918404002000" className="block text-sm text-muted hover:text-primary transition-colors">+91 84040-02000</a>
        </div>
      ),
    },
    {
      icon: Mail,
      label: 'Email',
      content: (
        <a href="mailto:mastermiller65@gmail.com" className="text-sm text-muted hover:text-primary transition-colors">
          mastermiller65@gmail.com
        </a>
      ),
    },
    {
      icon: Instagram,
      label: 'Instagram',
      content: (
        <a href="https://www.instagram.com/mastermiller_store" target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-primary transition-colors">
          @mastermiller_store
        </a>
      ),
    },
    {
      icon: Clock,
      label: 'Hours',
      content: <p className="text-sm text-muted">Monday – Sunday, 10:00 AM – 9:00 PM</p>,
    },
  ];

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">Get In Touch</span>
            <h2 className="font-heading text-5xl md:text-6xl font-bold text-charcoal mt-3 mb-6 leading-tight">
              Visit Our<br />
              <span className="italic text-primary">Store</span>
            </h2>
            <p className="text-muted text-sm leading-relaxed mb-10 max-w-md">
              Come experience the Master Miller difference in person. We&apos;re open every day to serve you fresh products.
            </p>

            <div className="space-y-6">
              {contactItems.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-cream flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wider uppercase text-charcoal mb-1">{item.label}</p>
                    {item.content}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden h-[500px] bg-cream">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3508.985!2d77.08!3d28.41!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDI0JzM2LjAiTiA3N8KwMDQnNDguMCJF!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Master Miller Location"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
