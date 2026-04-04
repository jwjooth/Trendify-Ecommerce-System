import React, { memo } from "react";
import { MapPin } from "lucide-react";
import { Address } from "../../service/type";
import { CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const COUNTRY_OPTIONS = [
  { value: "United States", label: "🇺🇸 United States" },
  { value: "Canada", label: "🇨🇦 Canada" },
  { value: "United Kingdom", label: "🇬🇧 United Kingdom" },
  { value: "Australia", label: "🇦🇺 Australia" },
  { value: "Germany", label: "🇩🇪 Germany" },
] as const;

interface AddressFormProps {
  id: string;
  title: string;
  address: Address;
  showPhone?: boolean;
  onChange: (field: keyof Address, value: string) => void;
  headerSlot?: React.ReactNode;
}

export const AddressForm: React.FC<AddressFormProps> = memo(
  ({ id, title, address, showPhone = true, onChange, headerSlot }) => {
    return (
      <>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              {title}
            </span>
            {headerSlot}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`${id}-fullName`}>Full Name *</Label>
              <Input
                id={`${id}-fullName`}
                value={address.fullName}
                onChange={(e) => onChange("fullName", e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            {showPhone && (
              <div>
                <Label htmlFor={`${id}-phone`}>Phone Number *</Label>
                <Input
                  id={`${id}-phone`}
                  type="tel"
                  value={address.phone}
                  onChange={(e) => onChange("phone", e.target.value)}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor={`${id}-addressLine1`}>Address Line 1 *</Label>
            <Input
              id={`${id}-addressLine1`}
              value={address.addressLine1}
              onChange={(e) => onChange("addressLine1", e.target.value)}
              placeholder="123 Main Street"
              required
            />
          </div>

          <div>
            <Label htmlFor={`${id}-addressLine2`}>Address Line 2</Label>
            <Input
              id={`${id}-addressLine2`}
              value={address.addressLine2}
              onChange={(e) => onChange("addressLine2", e.target.value)}
              placeholder="Apartment, suite, etc."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`${id}-city`}>City *</Label>
              <Input
                id={`${id}-city`}
                value={address.city}
                onChange={(e) => onChange("city", e.target.value)}
                placeholder="San Francisco"
                required
              />
            </div>

            <div>
              <Label htmlFor={`${id}-state`}>State *</Label>
              <Input
                id={`${id}-state`}
                value={address.state}
                onChange={(e) => onChange("state", e.target.value)}
                placeholder="CA"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`${id}-postalCode`}>Postal Code *</Label>
              <Input
                id={`${id}-postalCode`}
                value={address.postalCode}
                onChange={(e) => onChange("postalCode", e.target.value)}
                placeholder="94105"
                required
              />
            </div>

            <div>
              <Label htmlFor={`${id}-country`}>Country *</Label>
              <Select
                value={address.country}
                onValueChange={(value) => onChange("country", value)}
              >
                <SelectTrigger id={`${id}-country`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_OPTIONS.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </>
    );
  }
);

AddressForm.displayName = "AddressForm";
