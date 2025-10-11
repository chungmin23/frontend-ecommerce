import { useState, useRef, useEffect } from "react"
import { X, Send, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getRecommendation } from "@/api/productApi"
import { getProductImage } from "@/api/productApi"
import { useNavigate } from "react-router"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  products?: Product[]
  explanation?: string
  timestamp: Date
}

interface RecommendationChatProps {
  isOpen: boolean
  onClose: () => void
}

export function RecommendationChat({ isOpen, onClose }: RecommendationChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content: "안녕하세요! 원하시는 상품을 설명해주시면 AI가 최적의 상품을 추천해드립니다.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await getRecommendation(input)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: response.explanation,
        products: response.recommendedProducts,
        explanation: response.explanation,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Failed to get recommendation:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: "죄송합니다. 추천을 가져오는 중 오류가 발생했습니다. 다시 시도해주세요.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleProductClick = (pno: number) => {
    navigate(`/products/${pno}`)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl h-[600px] bg-background rounded-lg shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">AI 상품 추천</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                } rounded-lg p-3`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                {/* Product Cards */}
                {message.products && message.products.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.products.map((product) => (
                      <Card
                        key={product.pno}
                        className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleProductClick(product.pno)}
                      >
                        <div className="flex gap-3">
                          {product.uploadFileNames && product.uploadFileNames[0] && (
                            <img
                              src={getProductImage(product.uploadFileNames[0])}
                              alt={product.pname}
                              className="w-20 h-20 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate text-foreground">
                              {product.pname}
                            </h4>
                            {product.pdesc && (
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                {product.pdesc}
                              </p>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {product.price.toLocaleString()}원
                              </Badge>
                              {product.category && (
                                <span className="text-xs text-muted-foreground">
                                  {product.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="원하는 상품을 설명해주세요..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            예: "가볍고 편한 운동화 추천해줘", "30만원대 노트북 찾고 있어"
          </p>
        </div>
      </div>
    </div>
  )
}
