'use client';

import { useEffect } from 'react';

export default function TrelloLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Load Trello Power-Up script
    const script = document.createElement('script');
    script.src = 'https://p.trellocdn.com/power-up.min.js';
    script.async = true;

    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      document.body.removeChild(script);
    };
  }, []);

  return <>{children}</>;
}