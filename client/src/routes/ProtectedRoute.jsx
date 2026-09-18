import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { session, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
        <h2 className="text-3xl font-heading text-primary mb-4">Access Denied</h2>
        <p className="text-muted mb-8 max-w-md">You do not have administrator privileges to view this page.</p>
        <a href="/" className="px-6 py-3 bg-primary text-white rounded hover:bg-opacity-90 transition">Return to Home</a>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;