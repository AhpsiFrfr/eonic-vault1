import { ClientWalletProvider } from '../components/WalletProvider';
import './globals.css';
import '@solana/wallet-adapter-react-ui/styles.css';
import { ReactionAnimationsContainer } from '../components/ReactionAnimationsContainer';
import { DemoUploader } from '../components/DemoUploader';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientWalletProvider>
          {children}
          <ReactionAnimationsContainer />
          <DemoUploader />
        </ClientWalletProvider>
      </body>
    </html>
  );
}
