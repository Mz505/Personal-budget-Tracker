
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatBubbleOvalLeftEllipsisIcon, XMarkIcon, PaperAirplaneIcon } from './Icons';

type Message = {
    sender: 'user' | 'bot';
    text: string;
};

const systemInstruction = `You are a friendly and helpful AI assistant for the 'Zenith Budget Tracker' application. Your goal is to guide users on how to use the app and answer their questions about its features.

The application has three main sections accessible from the top navigation:
1.  **Dashboard:** Shows a visual overview of the user's finances for the current month. It includes cards for 'Remaining Budget', 'Monthly Income', and 'Monthly Expenses'. It also features a donut chart visualizing spending by category and a list of the 5 most recent transactions.
2.  **Transactions:** Provides a detailed list of all income and expense transactions. Users can filter this list by type (income/expense) and by category. They can also edit or delete any transaction from this screen using the pencil and trash icons.
3.  **Budget:** This section is where users set their overall financial plan. They can define their 'Total Monthly Budget' and manage their 'Spending Categories'. In the categories section, users can add new categories, rename existing ones, set a specific budget amount for each, and remove them.

To add a new transaction at any time, users can click the large purple plus (+) button located at the bottom-right corner of the screen.

When answering, be concise, clear, and encouraging. Use Markdown for formatting (like **bold** text or lists) to improve readability. If a user asks about a feature not present in the app (like bank syncing or investments), politely inform them that the feature is not available and refocus on the app's current capabilities. If you don't know the answer to something, it's best to say that you can only help with questions related to the Zenith Budget Tracker app.`;


const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        const initializeChat = () => {
            try {
                if (!process.env.API_KEY) {
                  console.error("API key not found.");
                  setMessages([{
                      sender: 'bot',
                      text: "I'm sorry, but I can't connect right now. The API key is missing."
                  }]);
                  return;
                }
                const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
                const chatSession = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                      systemInstruction,
                    },
                });
                setChat(chatSession);
                setMessages([{
                    sender: 'bot',
                    text: "Hello! I'm the Zenith Budget assistant. How can I help you today?"
                }]);
            } catch (error) {
                console.error("Failed to initialize chatbot:", error);
                setMessages([{
                    sender: 'bot',
                    text: "Sorry, I'm having trouble connecting right now. Please try again later."
                }]);
            }
        };

        if (isOpen && !chat) {
            initializeChat();
        }
    }, [isOpen, chat]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading || !chat) return;

        const userMessage: Message = { sender: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = userInput;
        setUserInput('');
        setIsLoading(true);

        try {
            const response = await chat.sendMessage({ message: currentInput });
            const botMessage: Message = { sender: 'bot', text: response.text };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Gemini API error:", error);
            const errorMessage: Message = { sender: 'bot', text: "Oops! Something went wrong on my end. Please try asking again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-6 bg-teal-500 hover:bg-teal-600 text-white rounded-full p-3 shadow-lg transition-transform duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 focus:ring-teal-500"
                aria-label="Open budget assistant"
            >
                <ChatBubbleOvalLeftEllipsisIcon className="h-7 w-7" />
            </button>

            {isOpen && (
                <div className="fixed bottom-6 right-6 w-[calc(100%-3rem)] sm:w-96 h-[70vh] sm:h-[32rem] flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-2xl z-50">
                    <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Budget Assistant</h3>
                        <button onClick={() => setIsOpen(false)} className="p-1 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
                           <XMarkIcon className="h-6 w-6" />
                        </button>
                    </header>
                    
                    <div className="flex-1 p-4 overflow-y-auto">
                        <div className="flex flex-col space-y-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-lg' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-lg'}`}>
                                        {msg.sender === 'user' ? (
                                            <p>{msg.text}</p>
                                        ) : (
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                                    strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                                                    ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1 my-2" {...props} />,
                                                    ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-1 my-2" {...props} />,
                                                    a: ({node, ...props}) => <a className="text-indigo-500 dark:text-indigo-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                                }}
                                            >
                                                {msg.text}
                                            </ReactMarkdown>
                                        )}
                                    </div>
                                </div>
                            ))}
                             {isLoading && (
                                <div className="flex items-end gap-2 justify-start">
                                    <div className="max-w-[80%] p-3 rounded-2xl bg-slate-200 dark:bg-slate-700 rounded-bl-lg">
                                        <div className="flex space-x-1">
                                            <span className="h-2 w-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                            <span className="h-2 w-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                            <span className="h-2 w-2 bg-slate-400 rounded-full animate-pulse"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="relative">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Ask a question..."
                                className="w-full pl-4 pr-12 py-2 rounded-full bg-slate-100 dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900 dark:text-slate-200"
                                disabled={isLoading}
                            />
                            <button type="submit" disabled={isLoading || !userInput.trim()} className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-slate-400 dark:disabled:bg-slate-500 disabled:cursor-not-allowed">
                                <PaperAirplaneIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbot;