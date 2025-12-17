import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Case Management System',
  description: 'Mini Case Management and Task Assignment System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
