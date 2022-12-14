import { SnackbarProvider } from 'notistack';
import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import Head from 'next/head';
import App, { AppContext, AppProps } from 'next/app';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '../lib/emotionCache';
import { TranslationProvider } from '../lib/translations';
import { ThemeManagerProvider } from '../lib/themeManager';
import { LoginContextProvider } from '../lib/loginContext';
import '../styles/globals.css';
import styles from '../styles/pages/app.module.css';
import { setApiServer } from '../lib/api/api';
import AppBar from '../components/AppBar';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  apiUrl: string;
}

export default function MyApp(props: MyAppProps) {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
    apiUrl,
  } = props;

  useEffect(() => {
    if (apiUrl) {
      setApiServer(apiUrl);
    }
  }, [apiUrl]);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <TranslationProvider>
        <ThemeManagerProvider>
          <LoginContextProvider>
            <SnackbarProvider>
              <Box
                className={styles.container}
                sx={{
                  backgroundColor: 'background.default',
                  color: 'text.primary',
                }}
              >
                <AppBar />
                <Component {...pageProps} />
              </Box>
            </SnackbarProvider>
          </LoginContextProvider>
        </ThemeManagerProvider>
      </TranslationProvider>
    </CacheProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps, apiUrl: process.env.PUBLIC_API_URL };
};
