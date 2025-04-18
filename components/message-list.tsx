"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Send } from "lucide-react"

interface MessageListProps {
  projectId: string
}

interface Message {
  id: string
  sender: {
    name: string
    avatar: string
    role: string
  }
  content: string
  timestamp: string
  isOwn: boolean
}

export function MessageList({ projectId }: MessageListProps) {
  const { toast } = useToast()
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Project Manager",
      },
      content:
        "Hi there! I've uploaded the latest wireframes for the homepage. Could you please review them and provide feedback?",
      timestamp: "2023-11-15T10:30:00",
      isOwn: false,
    },
    {
      id: "2",
      sender: {
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Client",
      },
      content: "Thanks for the update! I'll take a look at them today and get back to you with my thoughts.",
      timestamp: "2023-11-15T11:45:00",
      isOwn: true,
    },
    {
      id: "3",
      sender: {
        name: "Jane Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Designer",
      },
      content: "I've also added some notes about the color scheme we discussed. Let me know if you have any questions!",
      timestamp: "2023-11-15T14:20:00",
      isOwn: false,
    },
  ])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      sender: {
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Client",
      },
      content: newMessage,
      timestamp: new Date().toISOString(),
      isOwn: true,
    }

    setMessages([...messages, message])
    setNewMessage("")

    // Simulate response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        sender: {
          name: "John Doe",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "Project Manager",
        },
        content: "Thanks for your message! I'll get back to you soon.",
        timestamp: new Date().toISOString(),
        isOwn: false,
      }

      setMessages((prev) => [...prev, response])

      toast({
        title: "New message",
        description: "You have received a new message",
      })
    }, 3000)
  }

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
            <div className={`flex max-w-[80%] ${message.isOwn ? "flex-row-reverse" : "flex-row"}`}>
              <Avatar className={`h-8 w-8 ${message.isOwn ? "ml-2" : "mr-2"}`}>
                <AvatarImage src={message.sender.avatar || "/placeholder.svg"} alt={message.sender.name} />
                <AvatarFallback>
                  {message.sender.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div
                  className={`rounded-lg p-3 ${message.isOwn ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-sm">{message.sender.name}</span>
                    <span className="text-xs opacity-70">{formatMessageDate(message.timestamp)}</span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>
                <p className={`text-xs text-muted-foreground mt-1 ${message.isOwn ? "text-right" : "text-left"}`}>
                  {message.sender.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-4" />

      <div className="flex items-end gap-2">
        <Textarea
          placeholder="Type your message here..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 min-h-[80px]"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
        />
        <Button onClick={handleSendMessage} disabled={!newMessage.trim()} size="icon" className="h-10 w-10">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
