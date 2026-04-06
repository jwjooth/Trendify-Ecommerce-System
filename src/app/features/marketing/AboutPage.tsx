import { handleError } from "@/app/lib/api";
import { getAllTestimonials } from "@/app/service/testimonial";
import { Star, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  createInitialTableState,
  credibility,
  hideLoading,
  showLoading,
  stats,
  team,
} from "../../lib/constant";
import { Avatar, AvatarFallback, AvatarImage } from "../../shared/ui/avatar";
import { Badge } from "../../shared/ui/badge";
import { Button } from "../../shared/ui/button";
import { Card, CardContent } from "../../shared/ui/card";
import { TestimonialProps } from "./props";

export const AboutPage = () => {
  const [dataTable, setDataTable] = useState(createInitialTableState);

  const testimonialForm = useForm<TestimonialProps.FormProps>({
    defaultValues: {
      ...TestimonialProps.defaultValuesFormProps,
    },
  });

  const handleTestimonialLoad = async (page: number, limit: number) => {
    showLoading();
    try {
      const data = await getAllTestimonials({ page, limit });
    } catch (error) {
      handleError(error);
    } finally {
      hideLoading();
    }

    const handleTeamLoad = async () => {
      showLoading();
      try {
        // waiting api from be
      } catch (error) {
        handleError(error);
      } finally {
        hideLoading();
      }
    };

    const handleStatsLoad = async () => {
      showLoading();
      try {
        // waiting api from be
      } catch (error) {
        handleError(error);
      } finally {
        hideLoading();
      }
    };

    useEffect(() => {
      handleTestimonialLoad(dataTable.page, dataTable.limit);
    }, [handleTestimonialLoad]);

    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-20">
              <Badge variant="secondary" className="mb-4 px-4 py-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                Growing Since 2020
              </Badge>
              <h1 className="text-5xl font-bold mb-6 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                About Trendify
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Your trusted destination for quality products and exceptional service.
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
                    <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                    <p className="text-muted-foreground font-medium">{stat.label}</p>
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
                    Founded in 2020 during unprecedented times, Trendify emerged from a simple
                    vision: to make quality products accessible to everyone, everywhere.
                  </p>
                  <p>Our journey has been driven by innovation and customer-centric values.</p>
                </div>
              </div>
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Our Mission</h2>
                <div className="prose prose-lg">
                  <p>
                    To democratize access to premium products while maintaining the highest
                    standards of quality, service, and sustainability.
                  </p>
                  <p>
                    Through continuous innovation and unwavering commitment to our customers, we're
                    building the future of e-commerce.
                  </p>
                </div>
              </div>
            </div>

            {/* Values */}
            <div className="mb-20">
              <h2 className="text-3xl font-bold text-center mb-12">Why Choose Trendify?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {credibility.map(({ icon: Icon, title, desc }) => (
                  <Card key={title} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">{title}</h3>
                      <p className="text-muted-foreground">{desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="mb-20">
              <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {team.map((member, index) => (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <Avatar className="w-24 h-24 mx-auto mb-4">
                        <AvatarImage src={`/team-${index + 1}.jpg`} />
                        <AvatarFallback className="text-lg font-semibold">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                      <p className="text-primary font-medium mb-3">{member.role}</p>
                      <p className="text-muted-foreground text-sm">{member.bio}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="mb-20">
              <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
              {testimonialForm === "success" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {testimonialsState.data.map((testimonial) => (
                    <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-center mb-4">
                          <Avatar className="mr-3">
                            <AvatarFallback>
                              {testimonial.avatar || testimonial.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{testimonial.name}</h4>
                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                          </div>
                        </div>
                        <div className="flex mb-3">
                          {[...Array(testimonial.rating || 0)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="text-center bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers and discover why Trendify is the preferred
                choice for online shopping.
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
};
