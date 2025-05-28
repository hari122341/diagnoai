import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ApiContextProvier from '@/context/ApiContextProvier';
import Apicontext from '@/context/Apicontext';


// interface Message {
//     id: number;
//     text: string;
//     isUser: boolean;
//     timestamp: Date;
// }

const ChatInterface = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! Hello! I'm DiagnoAI 👋,  Upload a medical report image and I'll help analyze it for you.",
            isUser: false,
            timestamp: new Date()
        }
    ]);
    const { file } = useContext(Apicontext)
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const { url } = useContext(Apicontext);
    const formData = new FormData();
    formData.append('file', file);
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();

    }, [messages, scrollToBottom]);

    const handleSendMessage = async (messageText) => {
        if (!messageText.trim()) return;
        const userMessage = {
            id: Date.now(),
            text: messageText,
            isUser: true,
            timestamp: new Date()
        };


        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        // Simulate AI response
        try {
            // setTimeout(() => {
            //     const aiResponse = {
            //         id: Date.now() + 1,
            //         text: generateAIResponse(messageText),
            //         isUser: false,
            //         timestamp: new Date()
            //     };
            //     setMessages(prev => [...prev, aiResponse]);
            //     setIsLoading(false);
            // }, 1000 + Math.random() * 20000);
            // if (!fileData?.id) {
            //     throw new Error('No file uploaded');
            // }
            // if (!url[0]) {
            //     throw new Error('Please upload an image first');
            // }
            // const response = await fetch('http://localhost:5000/analyze_image', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            //     body: JSON.stringify({ file_id: url[0] })
            // });
            const res = await fetch('http://localhost:5000/analyze_image', {
                method: 'POST',
                body: formData,
                // credentials: 'include' // if you need cookies/auth
            });
            const data = await res.json();
            const airesponse = {
                id: Date.now + 1,
                // text: JSON.stringify(data.data, null, 2),
                text: data,
                isUser: false,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, airesponse]);


        } catch (error) {
            console.error("Error sending message:", error);

            // Add error message to chat
            const errorMessage = {
                id: Date.now() + 1,
                text: "Sorry, there was an error processing your request.",
                isUser: false,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
            // setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    const generateAIResponse = (userMessage) => {
        const responses = [
            "That's an interesting question! Let me help you with that. Based on what you're asking, I can provide some insights that might be useful for your situation.",
            "I understand what you're looking for. Here's what I think would be most helpful: this is a simulated response to demonstrate the chat interface functionality.",
            "Great question! This is a demo response showing how the ChatGPT clone interface works. In a real implementation, this would connect to an actual AI service.",
            "Thank you for your message! This interface demonstrates the core features of a chat application, including message history, real-time responses, and a clean user experience.",
            "I see what you're asking about. This ChatGPT clone showcases modern React patterns, responsive design, and smooth user interactions that you'd expect from a professional chat interface."
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    };

    return (
        // <div className="flex flex-col h-full bg-white">
        <div className="flex flex-col h-screen bg-white">
            {/* Header */}
            <div className="border-b border-gray-200 bg-white p-4 shadow-sm">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-lg font-semibold text-gray-900">DiagnoAI</h1>
                    <p className="text-sm text-gray-500">How can I help you today?</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                {messages.length === 0 ? (
                    // <div className="flex items-center justify-center h-full">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center p-6 bg-white rounded-xl shadow-sm max-w-md mx-auto">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-white">AI</span>
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to DiagnoAI</h2>
                            <p className="text-gray-500"> Upload a medical report and I'll provide you with detailed analysis and insights.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div>
                        {messages.map((message) => {
                            // console.log(message);
                            return < ChatMessage key={message.id} hi={message.id} message={message} />
                        })}
                        {isLoading && (
                            <div className="flex gap-4 p-6 bg-white rounded-lg shadow-sm">
                                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-semibold text-white">AI</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-semibold text-gray-900">DiagnoAI</span>
                                        <span className="font-semibold text-gray-500">Analyzing</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 bg-white">
                <div className="max-w-4xl mx-auto p-4"></div>
                <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>
            {/* </div> */}
        </div >
    );
};

export default ChatInterface;