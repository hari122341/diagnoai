
import React, { useEffect, useState } from 'react';
import Ai from './Ai';
// interface Message {
//     id: number;
//     text: string;
//     isUser: boolean;
//     timestamp: Date;
// }

// interface ChatMessageProps {
//     message: Message;
// }

const ChatMessage = ({ hi, message }) => {
    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };


    return (
        <div className={`flex gap-4 p-6 ${message.isUser ? 'bg-gray-50' : 'bg-white'}`}>
            {/* Avatar */}
            <div className="flex-shrink-0">
                {message.isUser ? (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-white">U</span>
                    </div>
                ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-white">AI</span>
                    </div>
                )}
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">
                        {message.isUser ? 'You' : 'DIAGNOAI'}
                    </span>
                    <span className="text-xs text-gray-500">
                        {formatTime(message.timestamp)}
                    </span>
                </div>
                <div className="prose prose-gray max-w-none">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {/* {console.log(key, message)} */}
                        {message.isUser ? message.text : hi == 1 ? message.text : <Ai message={message} first={true} />}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
