'use client';

import React from 'react';
import { ChatProvider } from '@/contexts/ChatContext';

interface ClientChatProviderProps {
  children: React.ReactNode;
}

// Client-side only wrapper for ChatProvider
const ClientChatProvider: React.FC<ClientChatProviderProps> = ({ children }) => {
  return <ChatProvider>{children}</ChatProvider>;
};

export default ClientChatProvider; 