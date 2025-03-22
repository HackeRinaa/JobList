import React from "react";
import ChatInterface from "../chat/ChatInterface";
import { useChatContext } from "@/contexts/ChatContext";

export default function CustomerChat() {
  const { getConversationsByRole, sendMessage, isLoading } = useChatContext();

  // Mock current customer ID - in a real app, this would come from authentication
  const currentCustomerId = "customer1"; 

  // Get conversations for this customer
  const conversations = getConversationsByRole("customer", currentCustomerId);

  // Function to handle sending a message
  const handleSendMessage = (conversationId: string, messageText: string) => {
    sendMessage(conversationId, messageText, "customer");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FB7600]"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-600">Συνομιλίες</h1>
      {conversations.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600 mb-4">
            Δεν έχετε ενεργές συνομιλίες αυτή τη στιγμή.
          </p>
          <p className="text-gray-500">
            Όταν ένας επαγγελματίας επικοινωνήσει μαζί σας σχετικά με μια αγγελία, 
            η συνομιλία θα εμφανιστεί εδώ.
          </p>
        </div>
      ) : (
        <ChatInterface
          userRole="customer"
          conversations={conversations}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
} 