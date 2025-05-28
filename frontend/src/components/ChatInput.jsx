
import React, { useState, useRef, useEffect, useContext } from 'react';
import { Send } from 'lucide-react';
import service from '@/appwrite/Db'
import Apicontext from '@/context/Apicontext';
import ApiContextProvier from '@/context/ApiContextProvier';
// interface ChatInputProps {
//     onSendMessage: (message: string) => void;
//     isLoading?: boolean;
// }

const ChatInput = ({ onSendMessage, isLoading = false }) => {
    const [message, setMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);
    const [uploadError, setUploadError] = useState('');
    const { seturl } = useContext(Apicontext)
    const { setfile } = useContext(Apicontext)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploadError('');

        if ((message.trim() || selectedFile) && !isLoading) {
            try {
                let fileData = null;
                if (selectedFile) {
                    const uploadFile = await service.uploadFile(selectedFile);
                    if (uploadFile) {
                        fileData = {
                            id: uploadFile.$id,
                            name: selectedFile.name,
                            size: selectedFile.size,
                            type: selectedFile.type
                        };
                        seturl([String(fileData.id)]);
                    }
                    // console.log(uploadFile);

                }

                await onSendMessage(message.trim(), fileData);
                setMessage('');
                setSelectedFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } catch (error) {
                console.error("Error sending message:", error);
                setUploadError('Failed to send message or upload file');
            }
        }
    };

    const handleFileSelect = (e) => {
        console.log(e);
        const file = e.target.files[0];
        setfile(file);
        console.log(file);
        if (file) {
            setSelectedFile(file);
            setMessage(`Attached file: ${file.name}`);
        }
    };


    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [message]);

    return (
        <div className="border-t border-gray-200 bg-white p-4">
            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="relative">
                    <div className="flex items-end gap-3 bg-gray-50 rounded-xl p-3 border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-20 transition-all duration-200">
                        <input
                            type="file"
                            className="hidden"
                            id="file1"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept=".pdf,.jpg,.png,.jpeg,image/*"
                            disabled={isLoading}
                        />

                        <input
                            ref={textareaRef}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onClick={() => !message && fileInputRef.current?.click()}
                            placeholder={selectedFile ? selectedFile.name : "Type a message or click to upload a file..."}
                            // placeholder="Message ChatGPT..."
                            className="flex-1 bg-transparent resize-none outline-none placeholder-gray-500 text-gray-900 max-h-32 min-h-[24px]"
                            // rows={1}
                            disabled={isLoading}
                        />

                        <button
                            type="submit"
                            disabled={(!message.trim() && !selectedFile) || isLoading}
                            className={`
                                flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
                                ${(message.trim() || selectedFile) && !isLoading
                                    ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }
                            `}
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Send size={16} />
                            )}
                        </button>
                        {uploadError && (
                            <p className="text-red-500 text-sm mt-2 text-center">
                                {uploadError}
                            </p>
                        )}
                    </div>
                </form>

                <p className="text-xs text-gray-500 text-center mt-3">
                    ChatGPT can make mistakes. Consider checking important information.
                </p>
            </div>
        </div>
    );
};

export default ChatInput;