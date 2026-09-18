import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Coffee, Eye, EyeOff, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { session, isAdmin } = useAuth();


  if (session && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-surface p-8 rounded shadow-lg max-w-md w-full border border-border">
        <div className="text-center mb-8">
          <Coffee className="text-accent mx-auto mb-4" size={48} />
          <h1 className="text-3xl font-heading text-primary mb-2">Admin Portal</h1>
          <p className="text-muted text-sm">Sign in to manage Mazi Specialty Coffee</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-6 text-sm border border-red-200">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-background border border-border rounded focus:border-accent outline-none" placeholder="admin@mazicoffee.pk" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-background border border-border rounded focus:border-accent outline-none pr-10" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-white font-semibold rounded hover:bg-opacity-90 transition disabled:opacity-50 flex justify-center items-center gap-2">
            {loading ? <><Loader2 className="animate-spin" size={18} /> Signing in...</> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;