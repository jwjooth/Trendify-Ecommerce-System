import React from "react";
import {
  Store,
  Users,
  Award,
  Heart,
  Star,
  TrendingUp,
  Shield,
  Globe,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

export const AboutPage: React.FC = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Verified Customer",
      content:
        "ShopHub has transformed my shopping experience. The quality and service are unmatched!",
      rating: 5,
      avatar: "SJ",
    },
    {
      name: "Mike Chen",
      role: "Loyal Customer",
      content:
        "Fast shipping and excellent customer support. I've been shopping here for 2 years!",
      rating: 5,
      avatar: "MC",
    },
    {
      name: "Emily Davis",
      role: "Fashion Enthusiast",
      content:
        "The product selection is amazing and the prices are competitive. Highly recommend!",
      rating: 5,
      avatar: "ED",
    },
  ];

  const stats = [
    { label: "Happy Customers", value: "50K+", icon: Users },
    { label: "Products Sold", value: "1M+", icon: Store },
    { label: "Countries Served", value: "25+", icon: Globe },
    { label: "Customer Rating", value: "4.9/5", icon: Star },
  ];

  const team = [
    {
      name: "Alex Thompson",
      role: "CEO & Founder",
      bio: "Passionate about creating exceptional shopping experiences since 2020.",
      avatar: "AT",
    },
    {
      name: "Maria Rodriguez",
      role: "Head of Customer Experience",
      bio: "Dedicated to ensuring every customer has a delightful shopping journey.",
      avatar: "MR",
    },
    {
      name: "David Kim",
      role: "Chief Technology Officer",
      bio: "Leading innovation in e-commerce technology and user experience.",
      avatar: "DK",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              Growing Since 2020
            </Badge>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              About ShopHub
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Your trusted destination for quality products and exceptional
              service. We're revolutionizing online shopping with innovation,
              integrity, and incredible customer experiences.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent className="pt-6">
                  <stat.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <p className="text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Story Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Our Story</h2>
              <div className="prose prose-lg">
                <p>
                  Founded in 2020 during unprecedented times, ShopHub emerged
                  from a simple vision: to make quality products accessible to
                  everyone, everywhere. What started as a small online store has
                  grown into a comprehensive e-commerce platform serving
                  customers across 25+ countries.
                </p>
                <p>
                  Our journey has been driven by innovation and customer-centric
                  values. We've invested heavily in technology, logistics, and
                  customer service to create an unparalleled shopping experience
                  that combines convenience, quality, and trust.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Our Mission</h2>
              <div className="prose prose-lg">
                <p>
                  To democratize access to premium products while maintaining
                  the highest standards of quality, service, and sustainability.
                  We believe that everyone deserves access to products that
                  enhance their lives, regardless of location or budget.
                </p>
                <p>
                  Through continuous innovation and unwavering commitment to our
                  customers, we're building the future of e-commerce – one
                  satisfied customer at a time.
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose ShopHub?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Store className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Quality Products
                  </h3>
                  <p className="text-muted-foreground">
                    Every product is carefully selected and tested to ensure it
                    meets our high standards.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Customer First</h3>
                  <p className="text-muted-foreground">
                    Our dedicated support team is always ready to help you with
                    any questions or concerns.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Best Value</h3>
                  <p className="text-muted-foreground">
                    Competitive pricing without compromising on quality or
                    service.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Secure Shopping
                  </h3>
                  <p className="text-muted-foreground">
                    Bank-level security ensures your personal and payment
                    information is always protected.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <CardContent className="pt-6">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarImage src={`/team-${index + 1}.jpg`} />
                      <AvatarFallback className="text-lg font-semibold">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold mb-1">
                      {member.name}
                    </h3>
                    <p className="text-primary font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              What Our Customers Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      <Avatar className="mr-3">
                        <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground italic">
                      "{testimonial.content}"
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Shopping?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers and discover why ShopHub is
              the preferred choice for online shopping. Quality products,
              exceptional service, and unbeatable value await you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="px-8">
                Start Shopping
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 border-white text-white hover:bg-white hover:text-blue-600"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
