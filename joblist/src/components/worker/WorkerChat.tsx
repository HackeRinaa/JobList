import React, { useState, useEffect } from "react";
import ChatInterface from "../chat/ChatInterface";

export default function WorkerChat() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Authentication required');
          return;
        }

        const response = await fetch('/api/worker/chat', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch conversations');
        }

        const data = await response.json();
        setConversations(data.conversations || []);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Function to handle sending a message
  const handleSendMessage = async (conversationId: string, messageText: string) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch('/api/worker/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          applicationId: conversationId,
          content: messageText
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Refresh conversations to show new message
      window.location.reload();
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FB7600]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-[#FB7600] text-white px-4 py-2 rounded-lg hover:bg-[#e66a00] transition-colors"
        >
          Δοκιμάστε ξανά
        </button>
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
            Όταν ξεκινήσετε επικοινωνία με έναν πελάτη σχετικά με μια αγγελία, 
            η συνομιλία θα εμφανιστεί εδώ.
          </p>
        </div>
      ) : (
        <ChatInterface
          userRole="worker"
          conversations={conversations}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
} 