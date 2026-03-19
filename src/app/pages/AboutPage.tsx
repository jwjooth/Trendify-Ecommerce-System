import React from 'react';
import { Store, Users, Award, Heart } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';

export const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">About ShopHub</h1>
          <p className="text-xl text-muted-foreground">
            Your trusted destination for quality products and exceptional service
          </p>
        </div>

        <div className="prose prose-lg mx-auto mb-16">
          <p>
            Founded in 2020, ShopHub has grown from a small startup to a leading e-commerce platform
            serving thousands of customers worldwide. Our mission is to provide high-quality products
            at competitive prices while delivering an exceptional shopping experience.
          </p>
          <p>
            We carefully curate our product selection to ensure that every item meets our strict
            quality standards. From electronics to fashion, home goods to sports equipment, we offer
            a diverse range of products to meet all your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardContent className="pt-6">
              <Store className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
              <p className="text-muted-foreground">
                Every product is carefully selected and tested to ensure it meets our high standards.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Customer First</h3>
              <p className="text-muted-foreground">
                Our dedicated support team is always ready to help you with any questions or concerns.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Award className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Best Value</h3>
              <p className="text-muted-foreground">
                Competitive pricing without compromising on quality or service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Heart className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Sustainable</h3>
              <p className="text-muted-foreground">
                We're committed to sustainable practices and reducing our environmental impact.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center bg-muted rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Be part of our growing community of satisfied customers. Sign up for our newsletter to
            get exclusive deals, new product announcements, and special offers.
          </p>
        </div>
      </div>
    </div>
  );
};
