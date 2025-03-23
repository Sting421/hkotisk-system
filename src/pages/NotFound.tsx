
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-hko-background">
      <div className="text-center px-4 animate-fade-in">
        <h1 className="text-8xl font-bold text-hko-primary">404</h1>
        <p className="text-2xl text-hko-text-primary mt-4 mb-6">
          Oops! This page doesn't exist.
        </p>
        <p className="text-hko-text-secondary max-w-md mx-auto mb-8">
          The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/">
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
