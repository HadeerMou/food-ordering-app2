import './globals.css';

export const metadata = {
  title: 'Nour Restaurant',
  description: 'Bilingual online food ordering prototype'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
