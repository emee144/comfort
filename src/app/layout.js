import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import Script from "next/script"; // ✅ add this

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
})

export const metadata = {
  title: 'Comfort Service Apartment | Ibadan',
  description: 'Premium shortlet apartment in Ibadan, Nigeria',
  icons: {
    icon: '/favicon.ico', 
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${playfair.variable} ${dmSans.variable}`}>
        {children}

        {/* ✅ Tawk.to Chat Script */}
        <Script
          id="tawk-to"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),
                s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/69cb787b36cad41c38488d0c/1jl1ct8rc';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />

      </body>
    </html>
  )
}