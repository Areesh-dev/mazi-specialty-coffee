import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import Reveal from '../../components/common/Reveal';
import { 
  LayoutGrid, Coffee, Users, Calendar, Star, 
  ArrowRight, TrendingUp, CheckCircle, Clock, AlertCircle 
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, reviewsRes, eventsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/reviews?admin=true&status=PENDING'),
          api.get('/upcoming-events')
        ]);
        
        setStats(statsRes.data);
        setPendingReviews(reviewsRes.data.slice(0, 3));
        setUpcomingEvents(eventsRes.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  const primaryStats = [
    { title: 'Pending Reviews', value: stats?.pendingReviews, icon: AlertCircle, color: 'text-accent', bg: 'bg-accent/10', link: '/admin/reviews' },
    { title: 'Active Menu Items', value: stats?.activeMenuItems, icon: Coffee, color: 'text-primary', bg: 'bg-primary/10', link: '/admin/menu' },
    { title: 'Published Events', value: stats?.publishedEvents, icon: Calendar, color: 'text-secondary', bg: 'bg-secondary/10', link: '/admin/events' },
    { title: 'Total Categories', value: stats?.totalCategories, icon: LayoutGrid, color: 'text-accent', bg: 'bg-accent/10', link: '/admin/categories' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <Reveal>
        <div className="bg-primary text-white rounded-2xl p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md">
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-heading text-white mb-2">Welcome back to Mazi Admin</h1>
            <p className="text-white/70 max-w-xl">Here is what's happening at your cafe today. You have {stats?.pendingReviews || 0} reviews awaiting moderation.</p>
          </div>
          <div className="relative z-10 flex gap-3">
            <Link to="/admin/content" className="px-6 py-3 bg-accent text-primary font-semibold rounded hover:bg-white transition-colors text-sm">Manage Content</Link>
            <Link to="/admin/menu" className="px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded hover:bg-white/20 transition-colors text-sm">Edit Menu</Link>
          </div>
          {/* Decorative element */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-accent/20 rounded-full blur-2xl"></div>
        </div>
      </Reveal>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {primaryStats.map((stat, index) => (
          <Reveal key={index} delay={index * 0.1}>
            <Link to={stat.link} className="block bg-surface p-6 rounded-xl border border-border hover:shadow-lg transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <ArrowRight size={18} className="text-muted group-hover:text-accent transition-colors transform group-hover:translate-x-1" />
              </div>
              <p className="text-sm text-muted font-medium mb-1">{stat.title}</p>
              <p className="text-4xl font-heading text-primary">{stat.value || 0}</p>
            </Link>
          </Reveal>
        ))}
      </div>

      {/* Secondary Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Reviews */}
        <Reveal delay={0.2} className="lg:col-span-2 space-y-6">
          <div className="bg-surface rounded-xl border border-border p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-heading text-primary">Reviews Awaiting Approval</h2>
              <Link to="/admin/reviews" className="text-sm font-semibold text-accent hover:underline flex items-center gap-1">View All <ArrowRight size={14} /></Link>
            </div>
            
            {pendingReviews.length === 0 ? (
              <div className="text-center py-8 bg-background rounded-lg border border-dashed border-border">
                <CheckCircle className="mx-auto text-green-500 mb-2" size={32} />
                <p className="text-muted">All caught up! No pending reviews.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingReviews.map((review) => (
                  <div key={review.id} className="bg-background p-5 rounded-lg border border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-primary">{review.customer_name}</span>
                        <div className="flex text-accent">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-accent" : "text-gray-300"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted line-clamp-2">"{review.review_text}"</p>
                    </div>
                    <Link to="/admin/reviews" className="shrink-0 px-4 py-2 bg-primary text-white text-xs font-semibold rounded hover:bg-opacity-90 transition">Moderate</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Reveal>

        {/* Right Column: Quick Actions & Upcoming Events */}
        <Reveal delay={0.3} className="space-y-6">
          
          {/* Quick Actions */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <h2 className="text-xl font-heading text-primary mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/admin/categories" className="flex items-center gap-3 p-3 bg-background rounded border border-border hover:border-accent transition-colors text-sm font-medium text-primary">
                <LayoutGrid size={18} className="text-accent" /> Add New Category
              </Link>
              <Link to="/admin/menu" className="flex items-center gap-3 p-3 bg-background rounded border border-border hover:border-accent transition-colors text-sm font-medium text-primary">
                <Coffee size={18} className="text-accent" /> Add Menu Item
              </Link>
              <Link to="/admin/upcoming-events" className="flex items-center gap-3 p-3 bg-background rounded border border-border hover:border-accent transition-colors text-sm font-medium text-primary">
                <Calendar size={18} className="text-accent" /> Create Upcoming Event
              </Link>
            </div>
          </div>

          {/* Upcoming Events Widget */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-heading text-primary">Next Events</h2>
              <Link to="/admin/upcoming-events" className="text-xs font-semibold text-accent hover:underline">Manage</Link>
            </div>
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-muted text-center py-4">No upcoming events scheduled.</p>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex gap-3 items-start">
                    <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center text-primary shrink-0">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary line-clamp-1">{event.title}</p>
                      <p className="text-xs text-muted">{new Date(event.event_date).toDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </Reveal>
      </div>
    </div>
  );
};

export default Dashboard;