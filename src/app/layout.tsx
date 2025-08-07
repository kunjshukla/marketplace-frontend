import './globals.css'
import { Providers } from '../components/Providers'
import { Navbar } from '../components/Navbar-dark'

export const metadata = {
  title: 'NFT Marketplace - Unique Digital Art',
  description: 'Discover and purchase unique digital art NFTs. Each NFT is sold only once, ensuring exclusivity and authenticity.',
  keywords: 'NFT, digital art, marketplace, blockchain, crypto, unique, exclusive',
  author: 'NFT Marketplace Team',
  openGraph: {
    title: 'NFT Marketplace - Unique Digital Art',
    description: 'Discover and purchase unique digital art NFTs. Each NFT is sold only once.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NFT Marketplace - Unique Digital Art',
    description: 'Discover and purchase unique digital art NFTs. Each NFT is sold only once.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
            <Navbar />
            <main>
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
