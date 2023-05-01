import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Risk Visualization Demo',
  description: 'A demonstration of data aggregation, filtering, and visualization using Next.js, React, d3js, and Tailwind CSS.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className='fixed z-10 flex items-center w-full gap-4 px-24 bg-black h-11'>
          <a className='hover:text-purple-500' href="#map">Map</a>
          <a className='hover:text-purple-500' href="#table">Table</a>
          <a className='hover:text-purple-500' href="#chart">Chart</a>
        </div>
        {children}
      </body>
    </html>
  )
}
