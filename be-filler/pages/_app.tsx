import '../styles/globals.css';
import { appWithTranslation } from 'next-i18next';

function MyApp({ Component, pageProps }: any) {
  return <Component {...pageProps} />;
}

export default appWithTranslation(MyApp); 