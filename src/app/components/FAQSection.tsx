import React, { useState, useEffect } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { getFaqs } from "../service";
import { FAQ } from "../service/type";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";
import { Skeleton } from "../components/ui/skeleton";

interface FAQSectionProps {
  className?: string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ className }) => {
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getFaqs();
        if (Array.isArray(data) && data.length > 0) {
          setFaqs(data);
        } else {
          setError("No FAQs available at the moment.");
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load FAQs. Please try again later.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadFaqs();
  }, []);

  const toggleFAQ = (id: string) => {
    setOpenFAQ((prev) => (prev === id ? null : id));
  };

  if (isLoading) {
    return (
      <div className={className}>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find quick answers to common questions.
          </p>
        </div>
        <div className="max-w-4xl mx-auto space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find quick answers to common questions.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <Card className="text-center py-8">
            <CardContent>
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find quick answers to common questions. Can't find what you're looking
          for? Contact our support team.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq) => (
          <Card
            key={faq.id}
            className="hover:shadow-md transition-shadow duration-200"
          >
            <Collapsible
              open={openFAQ === faq.id}
              onOpenChange={() => toggleFAQ(faq.id)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between text-left">
                    <span className="flex items-center">
                      <HelpCircle className="w-5 h-5 mr-3 text-primary flex-shrink-0" />
                      <span className="text-base font-medium">
                        {faq.question}
                      </span>
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-200 flex-shrink-0 ${
                        openFAQ === faq.id ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground leading-relaxed pl-8">
                    {faq.answer}
                  </p>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
};
