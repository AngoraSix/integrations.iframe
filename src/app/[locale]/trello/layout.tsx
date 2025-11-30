import { headers } from 'next/headers';
import Script from 'next/script';
import './trello-power-up.css';

export default async function TrelloLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce = (await headers()).get('x-csp-nonce') ?? undefined;

  return (
    <>
      <section>{children}</section>
      <Script
        src="https://p.trellocdn.com/power-up.min.js"
        strategy="beforeInteractive"
        nonce={nonce}
      />
    </>
  );
}
