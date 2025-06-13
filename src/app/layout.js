// src/app/layout.js
import './globals.css'

export const metadata = {
  title: 'Factos',
  description: 'AI 채팅 인터페이스',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning={true}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}