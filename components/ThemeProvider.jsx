// components/ThemeProvider.jsx
'use client';
import { useEffect } from 'react';

export function ThemeProvider({ children }) {
  useEffect(() => {
    async function fetchColors() {
      try {
        const response = await fetch( `${process.env.NEXT_PUBLIC_API_URL}/all-custom-color`);
        const data = await response.json();
        
        if (data.success) {
          const colors = data.data;
          
          // Set CSS variables dynamically
        //   document.documentElement.style.setProperty('--background', colors.base_color);
          document.documentElement.style.setProperty('--main', colors.base_color);
          document.documentElement.style.setProperty('--footer-color', colors.footer_color);
          document.documentElement.style.setProperty('--main-hov', colors.base_hov_color);
          document.documentElement.style.setProperty('--second-color', colors.secondary_base_color);
          document.documentElement.style.setProperty('--second-hov-color', colors.secondary_base_hov_color);
          document.documentElement.style.setProperty('--header-topbar-color', colors.header_topbar_color);
          document.documentElement.style.setProperty('--header-bottom-color', colors.header_bottom_color);
        
        }
      } catch (error) {
        console.error('Failed to fetch colors:', error);
      }
    }
    
    fetchColors();
  }, []);
  
  return children;
}