import React from "react";
import { Clock, MapPin, MessageCircle } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { SEO } from "../components/SEO";
import { ContactForm } from "../components/ContactForm";
import { ContactInfo } from "../components/ContactInfo";
import { FAQSection } from "../components/FAQSection";
import { BusinessHours } from "../components/BusinessHours";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

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

          {/* Business Hours & Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Monday - Friday</span>
                    <Badge variant="secondary">9:00 AM - 6:00 PM PST</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Saturday</span>
                    <Badge variant="secondary">10:00 AM - 4:00 PM PST</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium">Sunday</span>
                    <Badge variant="outline">Closed</Badge>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>24/7 Support:</strong> Our online support and order
                    tracking are available around the clock.
                  </p>
                </div>
              </CardContent>
            </Card>

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
    </>
  );
};
