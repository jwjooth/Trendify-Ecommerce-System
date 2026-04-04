import type { NextPage } from "next";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/app/shared/ui/button";

const NotFoundPage: NextPage = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <AlertCircle className="w-24 h-24 mx-auto mb-6 text-yellow-500" />
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button size="lg">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
