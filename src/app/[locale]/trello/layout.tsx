import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { headers } from 'next/headers';
import Script from 'next/script';
import theme from '../../../theme';
import './trello-power-up.css';

export default function TrelloLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce = headers().get('x-csp-nonce') ?? undefined;

  return (
    <>
      <AppRouterCacheProvider options={nonce ? { nonce } : undefined}>
        <ThemeProvider theme={theme}>
          <section>{children}</section>
        </ThemeProvider>
      </AppRouterCacheProvider>
      <Script
        src="https://p.trellocdn.com/power-up.min.js"
        strategy="beforeInteractive"
        nonce={nonce}
      />
    </>
  );
}
