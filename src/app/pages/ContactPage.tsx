import React from "react";
import { MessageCircle } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { SEO } from "../components/SEO";
import { ContactForm } from "../components/ContactForm";
import { ContactInfo } from "../components/ContactInfo";
import { FAQSection } from "../components/FAQSection";
import { BusinessHours } from "../components/BusinessHours";

export const ContactPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Contact Us - Get Help & Support | Trendify"
        description="Need help? Contact Trendify support team. Get answers to FAQs, submit inquiries, or reach out for assistance with your orders and products."
        keywords="contact, support, help, FAQ, customer service, Trendify"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Trendify",
          description: "Get in touch with Trendify customer support",
          mainEntity: {
            "@type": "Organization",
            name: "Trendify",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "1-800-SHOP-HUB",
              email: "support@trendify.com",
              contactType: "customer service",
              availableLanguage: "English",
            },
          },
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <header className="text-center mb-12 md:mb-16">
              <Badge variant="secondary" className="mb-4 px-4 py-2">
                <MessageCircle className="w-4 h-4 mr-2" aria-hidden="true" />
                Get In Touch
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Contact Us
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
                Have questions? Need help? We're here for you! Our friendly
                support team is ready to assist you with anything from order
                inquiries to product recommendations.
              </p>
            </header>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 md:mb-16">
              {/* Contact Info */}
              <ContactInfo className="lg:col-span-1" />

              {/* Contact Form */}
              <ContactForm className="lg:col-span-2" />
            </div>

            {/* FAQ Section */}
            <FAQSection className="mb-12 md:mb-16" />

            {/* Business Hours & Location */}
            <BusinessHours />
          </div>
        </div>
      </div>
    </>
  );
};
