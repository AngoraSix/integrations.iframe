import Script from 'next/script';

export default function TrelloLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Load Trello Power-Up script */}
        <Script
          src="https://p.trellocdn.com/power-up.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}