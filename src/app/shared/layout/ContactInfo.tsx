import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { contactMethods, socialLinks } from "../../lib/constant";

interface ContactInfoProps {
  className?: string;
}

export const ContactInfo: React.FC<ContactInfoProps> = ({ className }) => {
  return (
    <div className={className}>
      <div className="space-y-6">
        {contactMethods.map((method, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <CardContent className="pt-6 text-center">
              <method.icon
                className="w-12 h-12 text-primary mx-auto mb-4"
                aria-hidden="true"
              />
              <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
              <p className="text-muted-foreground mb-3">{method.description}</p>
              <p className="font-medium text-primary">{method.contact}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {method.additional}
              </p>
            </CardContent>
          </Card>
        ))}

        {/* Social Links */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold text-center mb-4">
              Follow Us
            </h3>
            <div className="flex justify-center space-x-4">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="outline"
                  size="sm"
                  className="rounded-full w-10 h-10 p-0"
                  asChild
                >
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <span className="text-lg" role="img" aria-hidden="true">
                      {social.emoji}
                    </span>
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
