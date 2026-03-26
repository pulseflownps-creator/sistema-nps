export const metadata = {
  title: 'Sistema NPS',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className="bg-gray-100 text-gray-800">
        <div className="max-w-5xl mx-auto p-6">
          {children}
        </div>
      </body>
    </html>
  )
}