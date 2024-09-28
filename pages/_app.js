import GlobalStyle from "../styles";
import Layout from "@/Components/Layout";

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function App({ Component, pageProps, session }) {
  return (
    <>
      <Layout>
        <GlobalStyle />
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
