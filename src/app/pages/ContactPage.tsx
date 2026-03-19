import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground">
            Have questions? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Email</h3>
              <p className="text-sm text-muted-foreground">support@shophub.com</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Phone className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Phone</h3>
              <p className="text-sm text-muted-foreground">1-800-SHOP-HUB</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Office</h3>
              <p className="text-sm text-muted-foreground">San Francisco, CA</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  rows={6}
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  required
                />
              </div>

              <Button type="submit" size="lg" className="w-full md:w-auto">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-12 p-8 bg-muted rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Business Hours</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monday - Friday</span>
              <span className="font-medium">9:00 AM - 6:00 PM PST</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Saturday</span>
              <span className="font-medium">10:00 AM - 4:00 PM PST</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sunday</span>
              <span className="font-medium">Closed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
