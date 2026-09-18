import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './routes/ProtectedRoute';

import Layout from './components/layout/Layout';
import AdminLayout from './pages/admin/AdminLayout';

import Home from './pages/Home';
import Menu from './pages/Menu';
import MenuItemPage from './pages/MenuItemPage';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Collaborations from './pages/Collaborations';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import About from './pages/About';

import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Categories from './pages/admin/Categories';
import MenuAdmin from './pages/admin/Menu';
import CollaborationsAdmin from './pages/admin/Collaborations';
import EventsAdmin from './pages/admin/Events';
import UpcomingEventsAdmin from './pages/admin/UpcomingEvents';
import ReviewsAdmin from './pages/admin/Reviews';
import ContentAdmin from './pages/admin/Content';
import SettingsAdmin from './pages/admin/Settings';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="menu" element={<Menu />} />
                <Route path="menu/:slug" element={<MenuItemPage />} />
                <Route path="events" element={<Events />} />
                <Route path="events/:slug" element={<EventDetail />} />
                <Route path="collaborations" element={<Collaborations />} />
                <Route path="reviews" element={<Reviews />} />
                <Route path="contact" element={<Contact />} />
              </Route>

              <Route path="/admin/login" element={<AdminLogin />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="categories" element={<Categories />} />
                  <Route path="menu" element={<MenuAdmin />} />
                  <Route path="collaborations" element={<CollaborationsAdmin />} />
                  <Route path="events" element={<EventsAdmin />} />
                  <Route path="upcoming-events" element={<UpcomingEventsAdmin />} />
                  <Route path="reviews" element={<ReviewsAdmin />} />
                  <Route path="content" element={<ContentAdmin />} />
                  <Route path="settings" element={<SettingsAdmin />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;