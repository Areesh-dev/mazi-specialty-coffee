
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    icon TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price NUMERIC(10,2) CHECK (price >= 0),
    image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS collaborations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    partner_name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    event_date DATE,
    external_url TEXT,
    is_published BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    event_date DATE NOT NULL,
    event_time TEXT,
    location TEXT,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS upcoming_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    poster_url TEXT,
    event_date DATE NOT NULL,
    event_time TEXT,
    location TEXT,
    booking_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    email TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'DECLINED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS hero_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eyebrow TEXT,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    cta_text TEXT,
    cta_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS website_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT UNIQUE NOT NULL,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_menu_items_updated_at ON menu_items;
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_collaborations_updated_at ON collaborations;
CREATE TRIGGER update_collaborations_updated_at BEFORE UPDATE ON collaborations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_upcoming_events_updated_at ON upcoming_events;
CREATE TRIGGER update_upcoming_events_updated_at BEFORE UPDATE ON upcoming_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hero_slides_updated_at ON hero_slides;
CREATE TRIGGER update_hero_slides_updated_at BEFORE UPDATE ON hero_slides FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_website_content_updated_at ON website_content;
CREATE TRIGGER update_website_content_updated_at BEFORE UPDATE ON website_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);

CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_slug ON menu_items(slug);
CREATE INDEX IF NOT EXISTS idx_menu_items_is_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_menu_items_is_featured ON menu_items(is_featured);

CREATE INDEX IF NOT EXISTS idx_collaborations_is_published ON collaborations(is_published);

CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_is_published ON events(is_published);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);

CREATE INDEX IF NOT EXISTS idx_upcoming_events_slug ON upcoming_events(slug);
CREATE INDEX IF NOT EXISTS idx_upcoming_events_is_published ON upcoming_events(is_published);
CREATE INDEX IF NOT EXISTS idx_upcoming_events_event_date ON upcoming_events(event_date);

CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_hero_slides_is_active ON hero_slides(is_active);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE upcoming_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
CREATE POLICY "Admins can manage all profiles" ON profiles FOR ALL USING (is_admin());


DROP POLICY IF EXISTS "Public can view active categories" ON categories;
CREATE POLICY "Public can view active categories" ON categories FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (is_admin());


DROP POLICY IF EXISTS "Public can view available menu items" ON menu_items;
CREATE POLICY "Public can view available menu items" ON menu_items FOR SELECT USING (is_available = true);

DROP POLICY IF EXISTS "Admins can manage menu items" ON menu_items;
CREATE POLICY "Admins can manage menu items" ON menu_items FOR ALL USING (is_admin());


DROP POLICY IF EXISTS "Public can view published collaborations" ON collaborations;
CREATE POLICY "Public can view published collaborations" ON collaborations FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admins can manage collaborations" ON collaborations;
CREATE POLICY "Admins can manage collaborations" ON collaborations FOR ALL USING (is_admin());


DROP POLICY IF EXISTS "Public can view published events" ON events;
CREATE POLICY "Public can view published events" ON events FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admins can manage events" ON events;
CREATE POLICY "Admins can manage events" ON events FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Public can view event galleries for published events" ON event_gallery;
CREATE POLICY "Public can view event galleries for published events" ON event_gallery FOR SELECT 
    USING (EXISTS (SELECT 1 FROM events WHERE events.id = event_gallery.event_id AND events.is_published = true));

DROP POLICY IF EXISTS "Admins can manage event gallery" ON event_gallery;
CREATE POLICY "Admins can manage event gallery" ON event_gallery FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Public can view published upcoming events" ON upcoming_events;
CREATE POLICY "Public can view published upcoming events" ON upcoming_events FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admins can manage upcoming events" ON upcoming_events;
CREATE POLICY "Admins can manage upcoming events" ON upcoming_events FOR ALL USING (is_admin());


DROP POLICY IF EXISTS "Public can view approved reviews" ON reviews;
CREATE POLICY "Public can view approved reviews" ON reviews FOR SELECT USING (status = 'APPROVED');

DROP POLICY IF EXISTS "Admins can manage reviews" ON reviews;
CREATE POLICY "Admins can manage reviews" ON reviews FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "Public can view active hero slides" ON hero_slides;
CREATE POLICY "Public can view active hero slides" ON hero_slides FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage hero slides" ON hero_slides;
CREATE POLICY "Admins can manage hero slides" ON hero_slides FOR ALL USING (is_admin());


DROP POLICY IF EXISTS "Public can view website content" ON website_content;
CREATE POLICY "Public can view website content" ON website_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage website content" ON website_content;
CREATE POLICY "Admins can manage website content" ON website_content FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Public can view public site settings" ON site_settings;
CREATE POLICY "Public can view public site settings" ON site_settings FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Admins can manage site settings" ON site_settings;
CREATE POLICY "Admins can manage site settings" ON site_settings FOR ALL USING (is_admin());

INSERT INTO storage.buckets (id, name, public) VALUES
('profile-images', 'profile-images', true),
('hero-images', 'hero-images', true),
('menu-images', 'menu-images', true),
('collaboration-images', 'collaboration-images', true),
('event-images', 'event-images', true),
('review-images', 'review-images', true),
('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT 
    USING (bucket_id IN ('profile-images', 'hero-images', 'menu-images', 'collaboration-images', 'event-images', 'review-images', 'site-assets'));

DROP POLICY IF EXISTS "Admin Insert Access" ON storage.objects;
CREATE POLICY "Admin Insert Access" ON storage.objects FOR INSERT 
    WITH CHECK (bucket_id IN ('profile-images', 'hero-images', 'menu-images', 'collaboration-images', 'event-images', 'review-images', 'site-assets') AND is_admin());

DROP POLICY IF EXISTS "Admin Update Access" ON storage.objects;
CREATE POLICY "Admin Update Access" ON storage.objects FOR UPDATE 
    USING (bucket_id IN ('profile-images', 'hero-images', 'menu-images', 'collaboration-images', 'event-images', 'review-images', 'site-assets') AND is_admin());

DROP POLICY IF EXISTS "Admin Delete Access" ON storage.objects;
CREATE POLICY "Admin Delete Access" ON storage.objects FOR DELETE 
    USING (bucket_id IN ('profile-images', 'hero-images', 'menu-images', 'collaboration-images', 'event-images', 'review-images', 'site-assets') AND is_admin());
