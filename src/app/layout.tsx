import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Door 2 Door',
  description: 'Door 2 Door - 2025',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={inter.className}>        
        <main className="flex flex-col items-center bg-gray-100">
        {children}
        </main>
      </body>
    </html>
  )
}



