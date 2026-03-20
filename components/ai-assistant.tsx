'use client';

import React from "react"

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MessageSquare, X, Send, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, setInput, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    maxSteps: 5,
  });

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage();
    }
  };

  const suggestedQuestions = [
    'Doanh thu tháng này bao nhiêu?',
    'Danh sách hồ sơ trễ hạn',
    'Tỷ lệ hài lòng hiện tại',
    'Quy trình cấp giấy chứng thực',
    'Ngân sách còn bao nhiêu',
    'Hồ sơ đang xử lý',
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:bg-primary/90 transition-all hover:scale-110"
        title="Trợ lý AI"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute top-2 right-2 w-3 h-3 bg-status-success rounded-full animate-pulse" />
      </button>
    );
  }

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-50 transition-all duration-300 transform',
        isMinimized ? 'h-14' : 'h-96 w-96'
      )}
    >
      <Card className="bg-card border-border h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between rounded-t-lg">
          <div>
            <h3 className="font-semibold text-sm">Trợ lý AI</h3>
            <p className="text-xs opacity-80">Hỏi bất cứ điều gì về UBND xã/phường</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="hover:bg-primary/80 p-1 rounded transition"
            >
              {isMinimized ? '⬆' : '⬇'}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-primary/80 p-1 rounded transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <MessageSquare className="w-8 h-8 text-muted-foreground mb-2 opacity-50" />
                  <p className="text-xs text-muted-foreground">
                    Bắt đầu cuộc trò chuyện với trợ lý AI của chúng tôi
                  </p>

                  {/* Suggested Questions */}
                  <div className="mt-4 w-full space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                      Gợi ý:
                    </p>
                    {suggestedQuestions.slice(0, 3).map((q, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setInput(q);
                          // Optionally auto-send
                        }}
                        className="w-full text-left p-2 text-xs bg-secondary/30 hover:bg-secondary/50 border border-border rounded transition text-foreground"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => {
                    // Extract text content from message parts
                    const textContent =
                      message.parts
                        ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
                        .map((p) => p.text)
                        .join('') || '';

                    return (
                      <div
                        key={message.id}
                        className={cn(
                          'flex gap-2',
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <div
                          className={cn(
                            'max-w-xs px-3 py-2 rounded-lg text-sm',
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary/50 text-foreground border border-border'
                          )}
                        >
                          {textContent}
                        </div>
                      </div>
                    );
                  })}

                  {status === 'streaming' && (
                    <div className="flex gap-2 justify-start">
                      <div className="bg-secondary/50 text-foreground border border-border px-3 py-2 rounded-lg text-sm">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                          <span
                            className="w-2 h-2 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: '0.2s' }}
                          />
                          <span
                            className="w-2 h-2 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: '0.4s' }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-border p-3 space-y-2">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Nhập câu hỏi..."
                  disabled={status === 'streaming'}
                  className="text-sm bg-input border-border text-foreground placeholder-muted-foreground"
                />
                <Button
                  type="submit"
                  disabled={status === 'streaming' || !input.trim()}
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {status === 'streaming' ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>

              {/* Quick Buttons */}
              {messages.length > 0 && (
                <div className="flex gap-1 flex-wrap text-xs">
                  {suggestedQuestions.slice(3, 5).map((q, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInput(q);
                      }}
                      className="px-2 py-1 bg-secondary/30 hover:bg-secondary/50 border border-border rounded text-foreground/70 hover:text-foreground transition"
                    >
                      {q.length > 15 ? q.substring(0, 15) + '...' : q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
