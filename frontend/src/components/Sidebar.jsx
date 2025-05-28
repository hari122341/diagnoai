import React, { useEffect, useState } from 'react';
import { MessageCircle, Search, Send } from 'lucide-react';
import { Button } from './ui/button';
import authService from '@/appwrite/Auth';
import { useNavigate } from 'react-router-dom';
// interface SidebarProps {
//     isOpen: boolean;
//     onToggle: () => void;
// }

const Sidebar = ({ isOpen, onToggle }) => {
    const chatHistory = [
        { id: 1, title: "How to learn React?", time: "2 hours ago" },
        { id: 2, title: "JavaScript best practices", time: "1 day ago" },
        { id: 3, title: "CSS Grid vs Flexbox", time: "2 days ago" },
        { id: 4, title: "Node.js deployment", time: "3 days ago" },
        { id: 5, title: "Database design patterns", time: "1 week ago" },
    ];
    const deletesession = async () => {
        try {
            await authService.logout();
            navigate('/');
        } catch (e) {
            navigate('/');

        }
    }
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    // const user = authService.getCurrentUser();
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const User = await authService.getCurrentUser();

                if (User) {
                    // console.log("Userdetails: ", User);
                    setUser(User.name);
                }
                console.log("After User: ", User);


            } catch (e) {
                console.error("Error fetching user:", error);
                navigate('/signin');
            }
        }
        fetchUser();
    }, [navigate]);

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <div className={`
        fixed top-0 left-0 h-full w-80 bg-gray-900 text-white z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:w-64 lg:w-80
      `}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-700">
                        <button className="w-full bg-gray-800 hover:bg-gray-700 rounded-lg p-3 text-left transition-colors duration-200 flex items-center gap-3">
                            <MessageCircle size={20} />
                            <span className="font-medium">New Chat</span>
                        </button>
                    </div>

                    {/* Search */}
                    <div className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* Chat History */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="px-4 pb-4">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Recent Chats</h3>
                            <div className="space-y-2">
                                {chatHistory.map((chat) => (
                                    <button
                                        key={chat.id}
                                        className="w-full text-left p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 group"
                                    >
                                        <div className="flex items-start gap-3">
                                            <MessageCircle size={16} className="mt-1 text-gray-400 group-hover:text-white transition-colors duration-200" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate group-hover:text-white transition-colors duration-200">
                                                    {chat.title}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">{chat.time}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-700">
                        <div className="flex items-center gap-3 p-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-sm font-semibold"> {user ? user[0].toUpperCase() : 'U'}</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium ml-2 mb-2">{user || 'User'}</p>
                                <Button className="text-xs text-gray-400 cursor-pointer" onClick={deletesession}>Logout</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;