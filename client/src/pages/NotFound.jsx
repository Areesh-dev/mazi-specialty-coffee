import { Link } from 'react-router-dom';
import { Coffee } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <Coffee className="text-accent mb-6" size={64} />
      <h1 className="text-6xl font-heading text-primary mb-4">404</h1>
      <h2 className="text-2xl font-heading text-primary mb-4">Page Not Found</h2>
      <p className="text-muted max-w-md mb-8">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      <Link to="/" className="px-8 py-3 bg-primary text-white font-semibold rounded hover:bg-opacity-90 transition">
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;