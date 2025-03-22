"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";

// Types
export interface Message {
  id: string;
  text: string;
  sender: "customer" | "worker";
  timestamp: Date;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participantName: string;
  participantRole: "customer" | "worker";
  participantAvatar?: string;
  lastMessage?: Message;
  messages: Message[];
  workerId: string;
  customerId: string;
  jobId: string;
}

// Type for parsed conversations from storage
interface ParsedConversation {
  id: string;
  participantName: string;
  participantRole: string;
  participantAvatar?: string;
  lastMessage?: {
    id: string;
    text: string;
    sender: string;
    timestamp: string;
    isRead: boolean;
  };
  messages: {
    id: string;
    text: string;
    sender: string;
    timestamp: string;
    isRead: boolean;
  }[];
  workerId: string;
  customerId: string;
  jobId: string;
}

interface ChatContextType {
  conversations: Conversation[];
  startConversation: (params: {
    workerId: string;
    customerId: string;
    workerName: string;
    customerName: string;
    jobId: string;
  }) => string;
  sendMessage: (conversationId: string, text: string, sender: "customer" | "worker") => void;
  getConversationsByRole: (role: "customer" | "worker", userId: string) => Conversation[];
  getConversation: (conversationId: string) => Conversation | undefined;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial conversations from localStorage or API
  useEffect(() => {
    const loadConversations = async () => {
      try {
        // In a real app, this would fetch from an API
        // For now, we'll check localStorage for any saved conversations
        const savedConversations = localStorage.getItem("chat_conversations");
        
        if (savedConversations) {
          // Parse stored conversations and convert date strings back to Date objects
          const parsedConversations = JSON.parse(savedConversations) as ParsedConversation[];
          const convertedConversations = parsedConversations.map((convo) => ({
            ...convo,
            participantRole: convo.participantRole as "customer" | "worker",
            lastMessage: convo.lastMessage ? {
              ...convo.lastMessage,
              sender: convo.lastMessage.sender as "customer" | "worker",
              timestamp: new Date(convo.lastMessage.timestamp)
            } : undefined,
            messages: convo.messages.map((msg) => ({
              ...msg,
              sender: msg.sender as "customer" | "worker",
              timestamp: new Date(msg.timestamp)
            }))
          }));
          
          setConversations(convertedConversations);
        } else {
          // If no saved conversations, set some mock data for demonstration
          const mockConversations: Conversation[] = [
            {
              id: "convo1",
              participantName: "Γιώργος Παπαδόπουλος",
              participantRole: "worker",
              workerId: "worker1",
              customerId: "customer1",
              jobId: "job1",
              messages: [
                {
                  id: "msg1",
                  text: "Καλησπέρα! Θα ήθελα να μάθω περισσότερες πληροφορίες για την εργασία μεταφοράς επίπλων.",
                  sender: "worker",
                  timestamp: new Date(Date.now() - 3600000),
                  isRead: true,
                },
                {
                  id: "msg2",
                  text: "Γεια σας! Βεβαίως, πρόκειται για μεταφορά ενός καναπέ και μιας βιβλιοθήκης από το ισόγειο στον 3ο όροφο.",
                  sender: "customer",
                  timestamp: new Date(Date.now() - 3500000),
                  isRead: true,
                },
              ],
              lastMessage: {
                id: "msg2",
                text: "Γεια σας! Βεβαίως, πρόκειται για μεταφορά ενός καναπέ και μιας βιβλιοθήκης από το ισόγειο στον 3ο όροφο.",
                sender: "customer",
                timestamp: new Date(Date.now() - 3500000),
                isRead: true,
              },
            },
            {
              id: "convo2",
              participantName: "Μαρία Κωνσταντίνου",
              participantRole: "worker",
              workerId: "worker2",
              customerId: "customer1",
              jobId: "job2",
              messages: [
                {
                  id: "msg1",
                  text: "Καλησπέρα! Είμαι διαθέσιμη για την εργασία καθαρισμού του σπιτιού σας.",
                  sender: "worker",
                  timestamp: new Date(Date.now() - 86400000),
                  isRead: true,
                },
              ],
              lastMessage: {
                id: "msg1",
                text: "Καλησπέρα! Είμαι διαθέσιμη για την εργασία καθαρισμού του σπιτιού σας.",
                sender: "worker",
                timestamp: new Date(Date.now() - 86400000),
                isRead: true,
              },
            },
            {
              id: "convo3",
              participantName: "Ελένη Παπαδοπούλου",
              participantRole: "customer",
              workerId: "worker1",
              customerId: "customer2",
              jobId: "job3",
              messages: [
                {
                  id: "msg1",
                  text: "Καλησπέρα! Ενδιαφέρομαι για την εργασία μεταφοράς επίπλων που δημοσιεύσατε.",
                  sender: "worker",
                  timestamp: new Date(Date.now() - 3600000),
                  isRead: true,
                },
                {
                  id: "msg2",
                  text: "Καλησπέρα! Ευχαριστώ για το ενδιαφέρον. Μπορείτε να μου πείτε περισσότερα για την εμπειρία σας;",
                  sender: "customer",
                  timestamp: new Date(Date.now() - 3500000),
                  isRead: true,
                },
              ],
              lastMessage: {
                id: "msg2",
                text: "Καλησπέρα! Ευχαριστώ για το ενδιαφέρον. Μπορείτε να μου πείτε περισσότερα για την εμπειρία σας;",
                sender: "customer",
                timestamp: new Date(Date.now() - 3500000),
                isRead: true,
              },
            },
          ];
          
          setConversations(mockConversations);
        }
      } catch (error) {
        console.error("Error loading conversations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem("chat_conversations", JSON.stringify(conversations));
    }
  }, [conversations]);

  // Start a new conversation
  const startConversation = ({
    workerId,
    customerId,
    workerName,
    customerName,
    jobId,
  }: {
    workerId: string;
    customerId: string;
    workerName: string;
    customerName: string;
    jobId: string;
  }) => {
    // Check if conversation already exists
    const existingConvo = conversations.find(
      (c) => c.workerId === workerId && c.customerId === customerId && c.jobId === jobId
    );

    if (existingConvo) {
      return existingConvo.id;
    }

    // Create new conversation with worker name for customer view
    const newConvoId = uuidv4();
    const newConversation: Conversation = {
      id: newConvoId,
      workerId,
      customerId,
      jobId,
      participantName: workerName, // Default to worker name (for customer view)
      participantRole: "worker", // Default to worker (for customer view)
      messages: [],
    };

    // Also create a worker-view version that can be used when the worker views it
    // This actually happens in getConversationsByRole, but keeping this comment for clarity
    // The worker would see the customer name as the participant

    setConversations((prev) => [...prev, newConversation]);
    return newConvoId;
  };

  // Send a message in a conversation
  const sendMessage = (conversationId: string, text: string, sender: "customer" | "worker") => {
    const newMessage: Message = {
      id: uuidv4(),
      text,
      sender,
      timestamp: new Date(),
      isRead: false,
    };

    setConversations((prevConversations) =>
      prevConversations.map((convo) => {
        if (convo.id === conversationId) {
          return {
            ...convo,
            messages: [...convo.messages, newMessage],
            lastMessage: newMessage,
          };
        }
        return convo;
      })
    );
  };

  // Get conversations filtered by role
  const getConversationsByRole = (role: "customer" | "worker", userId: string): Conversation[] => {
    const filteredConversations = conversations.filter((convo) => {
      if (role === "customer") {
        return convo.customerId === userId;
      } else {
        return convo.workerId === userId;
      }
    });

    // Format conversations for the viewer's perspective
    return filteredConversations.map((convo) => {
      // For customer view, keep worker details as participant
      if (role === "customer") {
        return {
          ...convo,
          participantRole: "worker" as const,
        };
      } 
      // For worker view, show customer details as participant
      else {
        return {
          ...convo,
          participantName: convo.customerId, // In real app, fetch customer name
          participantRole: "customer" as const,
        };
      }
    });
  };

  // Get a specific conversation
  const getConversation = (conversationId: string) => {
    return conversations.find((convo) => convo.id === conversationId);
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        startConversation,
        sendMessage,
        getConversationsByRole,
        getConversation,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}; 