import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Clock,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  const faqs = [
    {
      id: "shipping",
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days at an additional cost. International shipping may take 7-14 business days depending on the destination.",
    },
    {
      id: "returns",
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for most items. Products must be in their original condition with tags attached. Some items like electronics and personal care products may have different return policies.",
    },
    {
      id: "tracking",
      question: "How can I track my order?",
      answer:
        "Once your order ships, you'll receive a tracking number via email. You can also check your order status by logging into your account and viewing your order history.",
    },
    {
      id: "payment",
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers. All payments are processed securely.",
    },
    {
      id: "support",
      question: "How can I contact customer support?",
      answer:
        "You can reach our customer support team via email at support@shophub.com, phone at 1-800-SHOP-HUB, or through our live chat feature available 24/7 on our website.",
    },
    {
      id: "warranty",
      question: "Do your products come with warranty?",
      answer:
        "Most of our products come with manufacturer warranties. Electronics typically have 1-2 year warranties, while other products may have different warranty periods. Check the product page for specific warranty information.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <MessageCircle className="w-4 h-4 mr-2" />
              Get In Touch
            </Badge>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Contact Us
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Have questions? Need help? We're here for you! Our friendly
              support team is ready to assist you with anything from order
              inquiries to product recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Email Support</h3>
                  <p className="text-muted-foreground mb-3">
                    Get help via email
                  </p>
                  <p className="font-medium text-primary">
                    support@shophub.com
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Response within 24 hours
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Phone Support</h3>
                  <p className="text-muted-foreground mb-3">Call us directly</p>
                  <p className="font-medium text-primary">1-800-SHOP-HUB</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Mon-Fri: 9AM-6PM PST
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
                  <p className="text-muted-foreground mb-3">Our headquarters</p>
                  <p className="font-medium text-primary">San Francisco, CA</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    123 Commerce St
                  </p>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Follow Us</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center space-x-4">
                  <Button variant="outline" size="sm" className="rounded-full">
                    <span className="sr-only">Facebook</span>
                    📘
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <span className="sr-only">Twitter</span>
                    🐦
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <span className="sr-only">Instagram</span>
                    📷
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <span className="sr-only">LinkedIn</span>
                    💼
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Send className="w-5 h-5 mr-2" />
                    Send us a message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          required
                          placeholder="Your full name"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleChange("email", e.target.value)
                          }
                          required
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) =>
                          handleChange("subject", e.target.value)
                        }
                        required
                        placeholder="How can we help you?"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        rows={6}
                        value={formData.message}
                        onChange={(e) =>
                          handleChange("message", e.target.value)
                        }
                        required
                        placeholder="Please describe your question or issue in detail..."
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full md:w-auto"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Find quick answers to common questions. Can't find what you're
                looking for? Contact our support team.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {faqs.map((faq) => (
                <Card
                  key={faq.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <Collapsible
                    open={openFAQ === faq.id}
                    onOpenChange={() => toggleFAQ(faq.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <CardTitle className="flex items-center justify-between text-left">
                          <span className="flex items-center">
                            <HelpCircle className="w-5 h-5 mr-3 text-primary" />
                            {faq.question}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 transition-transform ${openFAQ === faq.id ? "rotate-180" : ""}`}
                          />
                        </CardTitle>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>
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
                    <strong>Phone:</strong> 1-800-SHOP-HUB
                  </p>
                  <p>
                    <strong>Email:</strong> support@shophub.com
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
