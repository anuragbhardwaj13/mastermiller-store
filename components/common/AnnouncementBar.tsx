'use client';

import { useState, useEffect } from 'react';

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    // Set sale end to 2 days from now (resets each session)
    const saleEnd = new Date();
    saleEnd.setDate(saleEnd.getDate() + 2);
    saleEnd.setHours(23, 59, 59, 0);

    const tick = () => {
      const now = new Date().getTime();
      const diff = saleEnd.getTime() - now;
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="flex items-center gap-1 font-heading font-bold text-charcoal">
      <span className="text-sm font-body font-bold tracking-wide uppercase">Sale Ends In:</span>
      <div className="flex items-center gap-0.5 ml-2">
        <div className="text-center">
          <span className="text-2xl">{pad(timeLeft.days)}</span>
          <span className="block text-[9px] font-body font-normal uppercase tracking-wider">days</span>
        </div>
        <span className="text-2xl mx-0.5">:</span>
        <div className="text-center">
          <span className="text-2xl">{pad(timeLeft.hours)}</span>
          <span className="block text-[9px] font-body font-normal uppercase tracking-wider">Hrs</span>
        </div>
        <span className="text-2xl mx-0.5">:</span>
        <div className="text-center">
          <span className="text-2xl">{pad(timeLeft.mins)}</span>
          <span className="block text-[9px] font-body font-normal uppercase tracking-wider">Mins</span>
        </div>
        <span className="text-2xl mx-0.5">:</span>
        <div className="text-center">
          <span className="text-2xl">{pad(timeLeft.secs)}</span>
          <span className="block text-[9px] font-body font-normal uppercase tracking-wider">Secs</span>
        </div>
      </div>
    </div>
  );
}

export default function AnnouncementBar() {
  const announcements = [
    'Freshly Milled & Packed Daily',
    '100% Natural Products',
    'Premium Quality Traditional Milling',
    'Visit Our Store in Gurugram',
  ];

  return (
    <div className="w-full">
      {/* Scrolling Announcements */}
      <div className="bg-primary text-white py-2 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex">
          {[...announcements, ...announcements].map((text, i) => (
            <span key={i} className="mx-8 text-xs font-medium tracking-wide">
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
