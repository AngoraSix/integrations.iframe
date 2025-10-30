import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { headers } from 'next/headers';
import theme from '../../../theme';
import { lato } from './fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const nonce = headers().get('x-csp-nonce') ?? undefined;

  return (
    <html lang="en">
      <body className={lato.variable}>
        <AppRouterCacheProvider options={nonce ? { nonce } : undefined}>
          <ThemeProvider theme={theme}>
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html >
  );
}