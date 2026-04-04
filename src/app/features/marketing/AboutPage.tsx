import React, { useState, useEffect, useCallback } from "react";
import { Store, Users, Award, Star, TrendingUp, Shield } from "lucide-react";
import { getTestimonials } from "../../service";
import { Testimonial as TestimonialType } from "../../service/type";
import { Card, CardContent } from "../../shared/ui/card";
import { Badge } from "../../shared/ui/badge";
import { Button } from "../../shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../shared/ui/avatar";
import { stats, team } from "../../lib/constant";

type TestimonialsState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "empty" }
  | { status: "success"; data: TestimonialType[] };

export const AboutPage: React.FC = () => {
  const [testimonialsState, setTestimonialsState] = useState<TestimonialsState>(
    { status: "idle" },
  );

  const loadTestimonials = useCallback(async () => {
    setTestimonialsState({ status: "loading" });
    try {
      const data = await getTestimonials();
      if (!data?.length) {
        setTestimonialsState({ status: "empty" });
      } else {
        setTestimonialsState({ status: "success", data });
      }
    } catch (err) {
      setTestimonialsState({
        status: "error",
        message:
          err instanceof Error ? err.message : "Failed to load testimonials",
      });
    }
  }, []);

  useEffect(() => {
    loadTestimonials();
  }, [loadTestimonials]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-20">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              Growing Since 2020
            </Badge>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              About Trendify
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Your trusted destination for quality products and exceptional
              service.
            </p>
          </div>

          {/* Stats */}
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

          {/* Story & Mission */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Our Story</h2>
              <div className="prose prose-lg">
                <p>
                  Founded in 2020 during unprecedented times, Trendify emerged
                  from a simple vision: to make quality products accessible to
                  everyone, everywhere.
                </p>
                <p>
                  Our journey has been driven by innovation and customer-centric
                  values.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Our Mission</h2>
              <div className="prose prose-lg">
                <p>
                  To democratize access to premium products while maintaining
                  the highest standards of quality, service, and sustainability.
                </p>
                <p>
                  Through continuous innovation and unwavering commitment to our
                  customers, we're building the future of e-commerce.
                </p>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose Trendify?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Store,
                  title: "Quality Products",
                  desc: "Every product is carefully selected and tested.",
                },
                {
                  icon: Users,
                  title: "Customer First",
                  desc: "Our dedicated support team is always ready to help.",
                },
                {
                  icon: Award,
                  title: "Best Value",
                  desc: "Competitive pricing without compromising quality.",
                },
                {
                  icon: Shield,
                  title: "Secure Shopping",
                  desc: "Bank-level security keeps your data safe.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <Card
                  key={title}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <CardContent className="pt-6">
                    <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{title}</h3>
                    <p className="text-muted-foreground">{desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Team */}
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

          {/* Testimonials — discriminated union renders the correct UI for each state */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              What Our Customers Say
            </h2>

            {testimonialsState.status === "loading" && (
              <div className="text-center py-8 text-muted-foreground">
                Loading testimonials...
              </div>
            )}

            {/* ✅ Error is red — actual failures only */}
            {testimonialsState.status === "error" && (
              <div className="text-center py-8">
                <p className="text-destructive mb-4">
                  {testimonialsState.message}
                </p>
                <Button variant="outline" onClick={loadTestimonials}>
                  Try again
                </Button>
              </div>
            )}

            {/* ✅ Empty is neutral — not styled as an error */}
            {testimonialsState.status === "empty" && (
              <div className="text-center py-8 text-muted-foreground">
                No testimonials available right now.
              </div>
            )}

            {testimonialsState.status === "success" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonialsState.data.map((testimonial) => (
                  <Card
                    key={testimonial.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <Avatar className="mr-3">
                          <AvatarFallback>
                            {testimonial.avatar || testimonial.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{testimonial.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex mb-3">
                        {[...Array(testimonial.rating || 0)].map((_, i) => (
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
            )}
          </div>

          {/* CTA */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Shopping?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers and discover why Trendify is
              the preferred choice for online shopping.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="px-8">
                Start Shopping
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 border-white text-black hover:bg-white hover:text-blue-600"
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
