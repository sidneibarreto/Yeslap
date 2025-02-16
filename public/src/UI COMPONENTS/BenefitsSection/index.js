import React from "react";
import { CalendarDays, FileText, Users } from "lucide-react";

export function BenefitsSection() {
  const benefits = [
    {
      icon: <CalendarDays className="w-6 h-6 text-blue-500" />,
      title: "Event Management",
      description: "Create and manage multiple events with ease. Track all your event details in one place.",
    },
    {
      icon: <FileText className="w-6 h-6 text-blue-500" />,
      title: "Budget Tracking",
      description: "Organize budgets by categories, track quotes, and manage supplier documents efficiently.",
    },
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      title: "Supplier Collaboration",
      description: "Seamlessly work with suppliers, compare quotes, and make informed decisions.",
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold text-center mb-8 text-gray-900">
          Why Choose EventFlow Pro?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm"
            >
              <div className="mb-4">{benefit.icon}</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
