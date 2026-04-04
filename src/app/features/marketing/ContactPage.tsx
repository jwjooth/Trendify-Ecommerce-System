import React from "react";
import { Badge, MapPin, MessageCircle } from "lucide-react";
import { BusinessHours } from "@/app/shared/layout/BusinessHours";
import { ContactForm } from "@/app/shared/layout/ContactForm";
import { ContactInfo } from "@/app/shared/layout/ContactInfo";
import { FAQSection } from "@/app/shared/layout/FAQSection";
import { SEO } from "@/app/shared/layout/SEO";
import { CardTitle } from "@/app/shared/ui/card";
import { Card, CardHeader, CardContent } from "@mui/material";

export const ContactPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Contact Us - Get Help & Support | Trendify"
        description="Need help? Contact Trendify support team."
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
              telephone: "1-800-TRENDIFY",
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
            {/* Hero */}
            <header className="text-center mb-12 md:mb-16">
              <Badge fontVariant="secondary" className="mb-4 px-4 py-2">
                <MessageCircle className="w-4 h-4 mr-2" aria-hidden="true" />
                Get In Touch
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Contact Us
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
                Have questions? Need help? We're here for you!
              </p>
            </header>

            {/* Contact Info + Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 md:mb-16">
              <ContactInfo className="lg:col-span-1" />
              <ContactForm className="lg:col-span-2" />
            </div>

            {/* FAQ */}
            <FAQSection className="mb-12 md:mb-16" />

            {/*
             * ✅ FIX: was rendering <BusinessHours /> component AND a hand-coded
             *    card below it — identical content shown twice on the page.
             *    The <BusinessHours /> component IS the source of truth; the
             *    duplicated inline card below has been removed.
             */}
            <BusinessHours />

            {/* Location card — this was the only unique part of the "duplicate" section */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Our Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Interactive Map</p>
                      <p className="text-sm text-muted-foreground">
                        San Francisco, CA
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Address:</strong> 123 Commerce Street, San
                      Francisco, CA 94105
                    </p>
                    <p>
                      <strong>Phone:</strong> 1-800-TRENDIFY
                    </p>
                    <p>
                      <strong>Email:</strong> support@trendify.com
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
