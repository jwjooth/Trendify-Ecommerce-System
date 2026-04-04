import type { NextPage } from "next";
import { Heart, Users, Zap } from "lucide-react";
import { Card, CardContent } from "@/app/shared/ui/card";

const AboutPage: NextPage = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About Trendify</h1>
          <p className="text-xl text-muted-foreground">
            Your destination for premium products and exceptional shopping
            experience
          </p>
        </div>

        {/* Mission */}
        <Card className="mb-12">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              At Trendify, we believe that shopping should be simple, enjoyable,
              and rewarding. Our mission is to bring together the best products
              from around the world and deliver them to you with exceptional
              service.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We're committed to providing a curated selection of premium items
              across multiple categories, all while maintaining the highest
              standards of quality and customer satisfaction.
            </p>
          </CardContent>
        </Card>

        {/* Values */}
        <h2 className="text-2xl font-bold mb-8 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <Heart className="w-12 h-12 mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-semibold mb-2">Customer First</h3>
              <p className="text-muted-foreground">
                Your satisfaction is our top priority, always
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Zap className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
              <h3 className="text-lg font-semibold mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                Constantly improving our platform and services
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <h3 className="text-lg font-semibold mb-2">Community</h3>
              <p className="text-muted-foreground">
                Building a trusted community of shoppers
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-12 py-8 bg-muted/50 rounded-lg">
          <div>
            <p className="text-3xl font-bold text-primary">1M+</p>
            <p className="text-muted-foreground">Happy Customers</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">50K+</p>
            <p className="text-muted-foreground">Products</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">180+</p>
            <p className="text-muted-foreground">Countries</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">24/7</p>
            <p className="text-muted-foreground">Support</p>
          </div>
        </div>

        {/* Story */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Founded in 2020, Trendify started with a simple vision: to make
              online shopping more personal, trustworthy, and enjoyable. What
              began as a small team of passionate entrepreneurs has grown into a
              platform trusted by millions.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Today, we continue to innovate and expand our product offerings
              while maintaining the same commitment to quality and customer care
              that defined us from the beginning.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Whether you're looking for electronics, fashion, home goods, or
              anything in between, Trendify is here to help you find exactly
              what you need.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;
