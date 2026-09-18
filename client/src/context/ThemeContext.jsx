import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

const ThemeContext = createContext();

const defaultTheme = {
  primary: '#4A3B32',
  secondary: '#7A8B6E',
  background: '#FDFBF7',
  surface: '#F4EFE6',
  text: '#2C2C2C',
  muted: '#8E8A86',
  accent: '#C27A5E',
  border: '#E5E0D8',
  headingFont: "'Playfair Display', serif",
  bodyFont: "'Inter', sans-serif",
};

export const ThemeProvider = ({ children }) => {
 
  const [theme, setTheme] = useState(defaultTheme);
  
 
  const [logoUrl, setLogoUrl] = useState(null);
  const [siteName, setSiteName] = useState('MAZI');

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await api.get('/settings');
        const settings = response.data.reduce((acc, curr) => {
          acc[curr.setting_key] = curr.setting_value;
          return acc;
        }, {});

      
        if (settings.theme) {
          setTheme((prev) => ({ ...prev, ...settings.theme }));
        }
        
      
        if (settings.typography) {
          setTheme((prev) => ({ 
            ...prev, 
            headingFont: settings.typography.headingFont || prev.headingFont,
            bodyFont: settings.typography.bodyFont || prev.bodyFont,
          }));
        }

      
        if (settings.general) {
          if (settings.general.logoUrl) setLogoUrl(settings.general.logoUrl);
          if (settings.general.siteName) setSiteName(settings.general.siteName);
        }
      } catch (err) {
        console.warn('Could not fetch theme settings, using defaults.');
      }
    };
    fetchTheme();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--color-background', theme.background);
    root.style.setProperty('--color-surface', theme.surface);
    root.style.setProperty('--color-text', theme.text);
    root.style.setProperty('--color-muted', theme.muted);
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-border', theme.border);
    root.style.setProperty('--font-heading', theme.headingFont);
    root.style.setProperty('--font-body', theme.bodyFont);
  }, [theme]);

  return (
   
    <ThemeContext.Provider value={{ theme, setTheme, logoUrl, siteName }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);