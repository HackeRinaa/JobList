import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { FiSend, FiPaperclip } from "react-icons/fi";

// Message interface
interface Message {
  id: string;
  text: string;
  sender: "customer" | "worker";
  timestamp: Date;
  isRead: boolean;
}

// Conversation interface
interface Conversation {
  id: string;
  participantName: string;
  participantRole: "customer" | "worker";
  participantAvatar?: string;
  lastMessage?: Message;
  messages: Message[];
}

interface ChatInterfaceProps {
  userRole: "customer" | "worker";
  conversations: Conversation[];
  onSendMessage: (conversationId: string, message: string) => void;
}

export default function ChatInterface({ 
  userRole, 
  conversations, 
  onSendMessage 
}: ChatInterfaceProps) {
  const [activeConversation, setActiveConversation] = useState<string | null>(
    conversations.length > 0 ? conversations[0].id : null
  );
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get the current active conversation object
  const currentConversation = conversations.find(
    (convo) => convo.id === activeConversation
  );

  // Auto-scroll to the bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentConversation?.messages]);

  // Handle sending a new message
  const handleSendMessage = () => {
    if (messageText.trim() && activeConversation) {
      onSendMessage(activeConversation, messageText);
      setMessageText("");
    }
  };

  // Handle pressing Enter to send a message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-200px)] bg-white rounded-lg overflow-hidden">
      {/* Conversation list */}
      <div className="w-1/3 border-r border-gray-200 bg-gray-50">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-600">Συνομιλίες</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100%-60px)]">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Δεν υπάρχουν ενεργές συνομιλίες
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100 ${
                  activeConversation === conversation.id ? "bg-gray-100" : ""
                }`}
                onClick={() => setActiveConversation(conversation.id)}
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                    {conversation.participantAvatar ? (
                      <Image
                        src={conversation.participantAvatar}
                        alt={conversation.participantName}
                        className="w-full h-full object-cover"
                        width={48}
                        height={48}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white bg-gray-500">
                        {conversation.participantName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-900 truncate">
                        {conversation.participantName}
                      </h3>
                      {conversation.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {new Date(conversation.lastMessage.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                    {conversation.lastMessage && (
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.lastMessage.text}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {activeConversation && currentConversation ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b border-gray-200 flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                {currentConversation.participantAvatar ? (
                  <Image  
                    src={currentConversation.participantAvatar}
                    alt={currentConversation.participantName}
                    className="w-full h-full object-cover"
                    width={48}
                    height={48}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white bg-gray-500">
                    {currentConversation.participantName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-900">
                  {currentConversation.participantName}
                </h3>
                <p className="text-xs text-gray-500">
                  {currentConversation.participantRole === "customer"
                    ? "Πελάτης"
                    : "Επαγγελματίας"}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {currentConversation.messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Ξεκινήστε μια συνομιλία με τον{" "}
                  {currentConversation.participantRole === "customer"
                    ? "πελάτη"
                    : "επαγγελματία"}
                </div>
              ) : (
                <div className="space-y-3">
                  {currentConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === userRole
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender === userRole
                            ? "bg-[#FB7600] text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p>{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === userRole
                              ? "text-orange-100"
                              : "text-gray-500"
                          }`}
                        >
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message input */}
            <div className="p-3 border-t border-gray-200">
              <div className="flex items-center">
                <button className="text-gray-500 hover:text-gray-700 mr-2">
                  <FiPaperclip size={20} />
                </button>
                <textarea
                  className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 text-gray-600 focus:border-transparent outline-none resize-none"
                  placeholder="Γράψτε ένα μήνυμα..."
                  rows={1}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <button
                  className="ml-2 bg-[#FB7600] text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                >
                  <FiSend size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Επιλέξτε μια συνομιλία για να ξεκινήσετε
          </div>
        )}
      </div>
    </div>
  );
} 