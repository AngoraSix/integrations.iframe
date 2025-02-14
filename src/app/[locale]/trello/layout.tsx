import Script from 'next/script';
import './trello-power-up.css';

export default function TrelloLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section>{children}</section>
      {/* Load Trello Power-Up script */}
      <Script
        src="https://p.trellocdn.com/power-up.min.js"
        strategy="beforeInteractive"
      />
    </>
  );
}