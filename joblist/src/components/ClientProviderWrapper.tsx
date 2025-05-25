'use client';

import dynamic from 'next/dynamic';

const ChatProvider = dynamic(() => import('./ChatProvider'), {
  ssr: false
});

export default function ClientProviderWrapper({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ChatProvider>
      {children}
    </ChatProvider>
  );
} 