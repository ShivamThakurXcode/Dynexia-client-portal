"use client"

import { useState } from "react"
import { Card, CardHeader } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { useToast } from "@/components/ui/use-toast"

export default function MessagesPage() {
  const { toast } = useToast();
  const [activeContact, setActiveContact] = useState<string | null>("1");
  const [newMessage, setNewMessage] = useState("");
  
  // Sample data
  const contacts = [
    {
      id: "1",
      name: "John Doe",
      role: "Project Manager",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Hi there! I've uploaded the latest wireframes for the homepage.",
      lastMessageTime: "10:30 AM",
      unread: 2,
      online: true,
    },
    {
      id: "2",
      name: "Jane Smith",
      role: "Designer",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "I've also added some notes about the color scheme we discussed.",
      lastMessageTime: "Yesterday",
      unread: 0,
      online: false,
    },
    {
      id: "3",
      name: "Robert Johnson",
      role: "Developer",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "The development is on track. We should be able to deliver on time.",
      lastMessageTime: "Yesterday",
      unread: 0,
      online: true,
    },
  ];
  
  const conversations: Record<string, Array<{
    id: string;
    sender: string;
    content: string;
    timestamp: string;
    isOwn: boolean;
  }>> = {
    "1": [
      {
        id: "1-1",
        sender: "John Doe",
        content: "Hi there! I've uploaded the latest wireframes for the homepage. Could you please review them and provide feedback?",
        timestamp: "2023-11-15T10:30:00",
        isOwn: false,
      },
      {
        id: "1-2",
        sender: "You",
        content: "Thanks for the update! I'll take a look at them today and get back to you with my thoughts.",
        timestamp: "2023-11-15T11:45:00",
        isOwn: true,
      },
      {
        id: "1-3",
        sender: "John Doe",
        content: "Great! Let me know if you have any questions or if anything needs clarification.",
        timestamp: "2023-11-15T12:15:00",
        isOwn: false,
      },
      {
        id: "1-4",
        sender: "John Doe",
        content: "Also, I wanted to discuss the timeline for the next phase. Do you have time for a quick call tomorrow?",
        timestamp: "2023-11-15T12:18:00",
        isOwn: false,
      },
    ],
    "2": [
      {
        id: "2-1",
        sender: "Jane Smith",
        content: "I've added some notes about the color scheme we discussed. I think the blue shades work really well with the overall design.",
        timestamp: "2023-11-14T14:20:00",
        isOwn: false,
      },
      {
        id: "2-2",
        sender: "You",
        content: "The colors look great! I especially like the gradient effect on the buttons.",
        timestamp: "2023-11-14T15:30:00",
        isOwn: true,
      },
    ],
    "3": [
      {
        id: "3-1",
        sender: "Robert Johnson",
        content: "The development is on track. We should be able to deliver on time.",
        timestamp: "2023-11-14T09:45:00",
        isOwn: false,
      },
      {
        id: "3-2",
        sender: "You",
        content: "That's great news! Any challenges or blockers I should be aware of?",
        timestamp: "2023-11-14T10:15:00",
        isOwn: true,
      },
      {
        id: "3-3",
        sender: "Robert Johnson",
        content: "Nothing major at the moment. We're handling a few minor bugs, but nothing that would impact the timeline.",
        timestamp: "2023-11-14T10:30:00",
        isOwn: false,
      },
    ],
  };
  
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeContact) return;
    
    const message = {
      id: Date.now().toString(),
      sender: "You",
      content: newMessage,
      timestamp: new Date().toISOString(),
      isOwn: true,
    };
    
    conversations[activeContact] = [...(conversations[activeContact] || []), message];
    setNewMessage("");
    
    // Simulate response
    setTimeout(() => {
      const contact = contacts.find(c => c.id === activeContact);
      if (contact) {
        const response = {
          id: (Date.now() + 1).toString(),
          sender: contact.name,
          content: "Thanks for your message! I'll get back to you soon.",
          timestamp: new Date().toISOString(),
          isOwn: false,
        };
        
        conversations[activeContact] = [...(conversations[activeContact] || []), response];
        
        toast({
          title: "New message",
          description: `You have received a new message from ${contact.name}`,
        });
      }
    }, 3000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader heading="Messages" text="Communicate with your team and clients." />
      <main className="flex-1 p-4 md:p-6">
        <Card className="h-[calc(100vh-12rem)]">
          <div className="grid h-full md:grid-cols-[300px_1fr]">
            {/* Contacts sidebar */}
            <div className="border-r">
              <CardHeader\
