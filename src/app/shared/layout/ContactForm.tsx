import React, { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner";
import {
  validateAndSanitizeEmail,
  sanitizeText,
  sanitizeHtml,
} from "../../utils/sanitization";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  className?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ className }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    // Validate name
    const sanitizedName = sanitizeText(formData.name);
    if (sanitizedName.length < 2) {
      newErrors.name = "Name must be at least 2 characters long.";
    } else if (sanitizedName.length > 100) {
      newErrors.name = "Name must be less than 100 characters.";
    }

    // Validate email
    const emailValidation = validateAndSanitizeEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Validate subject
    const sanitizedSubject = sanitizeText(formData.subject);
    if (sanitizedSubject.length < 5) {
      newErrors.subject = "Subject must be at least 5 characters long.";
    } else if (sanitizedSubject.length > 200) {
      newErrors.subject = "Subject must be less than 200 characters.";
    }

    // Validate message
    const sanitizedMessage = sanitizeHtml(formData.message, {
      ALLOWED_TAGS: ["p", "br", "strong", "em"],
    });
    if (sanitizedMessage.length < 10) {
      newErrors.message = "Message must be at least 10 characters long.";
    } else if (sanitizedMessage.length > 2000) {
      newErrors.message = "Message must be less than 2000 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Sanitize all inputs before sending
      // const sanitizedData = {
      //   name: sanitizeText(formData.name),
      //   email: validateAndSanitizeEmail(formData.email).sanitized,
      //   subject: sanitizeText(formData.subject),
      //   message: sanitizeHtml(formData.message, {
      //     ALLOWED_TAGS: ["p", "br", "strong", "em"],
      //   }),
      // };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Message sent! We'll get back to you within 24 hours.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Send className="w-5 h-5 mr-2" />
          Send us a message
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                placeholder="Your full name"
                aria-describedby={errors.name ? "name-error" : undefined}
                aria-invalid={!!errors.name}
                className={`mt-1 ${errors.name ? "border-destructive" : ""}`}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p
                  id="name-error"
                  className="mt-1 text-sm text-destructive"
                  role="alert"
                >
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                placeholder="your.email@example.com"
                aria-describedby={errors.email ? "email-error" : undefined}
                aria-invalid={!!errors.email}
                className={`mt-1 ${errors.email ? "border-destructive" : ""}`}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="mt-1 text-sm text-destructive"
                  role="alert"
                >
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="subject" className="text-sm font-medium">
              Subject *
            </Label>
            <Input
              id="subject"
              type="text"
              value={formData.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
              required
              placeholder="How can we help you?"
              aria-describedby={errors.subject ? "subject-error" : undefined}
              aria-invalid={!!errors.subject}
              className={`mt-1 ${errors.subject ? "border-destructive" : ""}`}
              disabled={isSubmitting}
            />
            {errors.subject && (
              <p
                id="subject-error"
                className="mt-1 text-sm text-destructive"
                role="alert"
              >
                {errors.subject}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="message" className="text-sm font-medium">
              Message *
            </Label>
            <Textarea
              id="message"
              rows={6}
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              required
              placeholder="Please describe your question or issue in detail..."
              aria-describedby={errors.message ? "message-error" : undefined}
              aria-invalid={!!errors.message}
              className={`mt-1 resize-none ${errors.message ? "border-destructive" : ""}`}
              disabled={isSubmitting}
            />
            {errors.message && (
              <p
                id="message-error"
                className="mt-1 text-sm text-destructive"
                role="alert"
              >
                {errors.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto"
            disabled={isSubmitting}
          >
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
