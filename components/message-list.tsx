"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Send } from "lucide-react"
import { getMessages, sendMessage } from "@/lib/actions/messages"
import { useSession } from "next-auth/react"

interface MessageListProps {
  projectId?: string
  receiverId?: string
}

interface Message {
  id: string
  content: string
  createdAt: Date
  sender: {
    id: string
    name: string
    image: string | null
    role: string
  }
  receiver?: {
    id: string
    name: string
    image: string | null
    role: string
  } | null
}

export function MessageList({ projectId, receiverId }: MessageListProps) {
  const { toast } = useToast()
  const { data: session } = useSession()
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const result = await getMessages(projectId)
        if (result?.messages) {
          setMessages(result.messages)
        }
      } catch (error) {
        console.error("Error fetching messages:", error)
      }
    }

    fetchMessages()

    // Set up polling for new messages
    const interval = setInterval(fetchMessages, 10000)
    return () => clearInterval(interval)
  }, [projectId])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !session?.user) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("content", newMessage)

      if (projectId) {
        formData.append("projectId", projectId)
      }

      if (receiverId) {
        formData.append("receiverId", receiverId)
      }

      const result = await sendMessage(formData)

      if (result?.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      if (result?.message) {
        // Add the new message to the list
        setMessages((prev) => [...prev, result.message])
      }

      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.sender.id === session?.user?.id
            return (
              <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                <div className={`flex max-w-[80%] ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
                  <Avatar className={`h-8 w-8 ${isOwn ? "ml-2" : "mr-2"}`}>
                    <AvatarImage src={message.sender.image || "/placeholder.svg"} alt={message.sender.name} />
                    <AvatarFallback>
                      {message.sender.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className={`rounded-lg p-3 ${isOwn ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">{message.sender.name}</span>
                        <span className="text-xs opacity-70">{formatMessageDate(message.createdAt.toString())}</span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <p className={`text-xs text-muted-foreground mt-1 ${isOwn ? "text-right" : "text-left"}`}>
                      {message.sender.role}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
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
        <Button
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || isLoading}
          size="icon"
          className="h-10 w-10"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
