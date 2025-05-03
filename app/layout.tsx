import { ClientWalletProvider } from '../components/WalletProvider';
import './globals.css';
import '@solana/wallet-adapter-react-ui/styles.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientWalletProvider>{children}</ClientWalletProvider>
      </body>
    </html>
  );
}
