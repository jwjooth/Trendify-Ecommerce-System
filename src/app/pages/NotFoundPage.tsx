import React from 'react';
import { Link } from 'react-router';
import { Home, Search } from 'lucide-react';
import { Button } from '../components/ui/button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-md mx-auto">
        <div className="text-9xl font-bold text-muted-foreground mb-4">404</div>
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link to="/">
            <Button>
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
