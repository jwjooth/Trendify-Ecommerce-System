import React from "react";
import { Clock, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { hours } from "../lib/constant";

interface BusinessHoursProps {
  className?: string;
}

export const BusinessHours: React.FC<BusinessHoursProps> = ({ className }) => {
  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" aria-hidden="true" />
              Business Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {hours.map((schedule, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b last:border-b-0"
                >
                  <span className="font-medium">{schedule.day}</span>
                  <Badge variant={schedule.variant}>{schedule.time}</Badge>
                </div>
              ))}
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
                <MapPin
                  className="w-12 h-12 text-muted-foreground mx-auto mb-2"
                  aria-hidden="true"
                />
                <p className="text-muted-foreground">Interactive Map</p>
                <p className="text-sm text-muted-foreground">
                  San Francisco, CA
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Address:</strong> 123 Commerce Street, San Francisco, CA
                94105
              </p>
              <p>
                <strong>Phone:</strong> 1-800-TREDIFY
              </p>
              <p>
                <strong>Email:</strong> support@trendify.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
