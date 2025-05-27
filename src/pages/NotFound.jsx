
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="book-page p-12">
          <h1 className="text-6xl font-cormorant font-bold text-gold mb-6">404</h1>
          <h2 className="text-3xl font-cormorant font-semibold text-ivory mb-4">Page Not Found</h2>
          <p className="text-xl text-antique/80 mb-8">
            The page you're looking for seems to have vanished into the depths of the ancient library.
          </p>
          <Link 
            to="/" 
            className="gold-btn inline-block"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
