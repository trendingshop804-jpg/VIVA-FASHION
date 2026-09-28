import React from 'react';
import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';

const FEATURES = [
  {
    icon: Truck,
    title: 'Free Shipping',
    subtitle: 'On orders above ₹999',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    subtitle: '100% secure checkout',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    subtitle: 'Hassle free 7 days',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    subtitle: "We're here to help",
  },
];

export const FeatureBar: React.FC = () => {
  return (
    <section className="w-full bg-[#FCF3F7] py-7 md:py-9">
      <div className="w-full px-6 sm:px-10 lg:px-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="flex items-center gap-3 md:gap-4">
                <Icon size={28} className="text-[#1A1A1A] flex-shrink-0" strokeWidth={1.6} />
                <div>
                  <h4 className="text-[13px] md:text-sm font-bold text-[#1A1A1A]">
                    {feature.title}
                  </h4>
                  <p className="text-[10px] md:text-xs text-[#6B6B6B]">
                    {feature.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
