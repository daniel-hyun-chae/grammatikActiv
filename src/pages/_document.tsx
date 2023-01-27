import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="m-0 h-full">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&family=Oxanium&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="m-0 h-full">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
