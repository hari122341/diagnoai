
import React, { useState } from 'react';
// import Sidebar from '../components/Sidebar';
import Sidebar from '@/components/Sidebar'
import ChatInterface from '@/components/ChatInterface';
import ApiContextProvier from '@/context/ApiContextProvier';

const Main = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <ApiContextProvier>
            <div className="h-screen flex bg-gray-100">
                {/* Sidebar */}
                <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Mobile Header */}
                    <div className="md:hidden bg-white border-b border-gray-200 p-4">
                        <button
                            onClick={toggleSidebar}
                            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
                        >
                            <div className="w-6 h-6 flex flex-col justify-center gap-1">
                                <div className="w-full h-0.5 bg-current"></div>
                                <div className="w-full h-0.5 bg-current"></div>
                                <div className="w-full h-0.5 bg-current"></div>
                            </div>
                            <span className="font-medium">Menu</span>
                        </button>
                    </div>

                    {/* Chat Interface */}
                    <div className="flex-1 flex flex-col">
                        <ChatInterface />
                    </div>
                </div>
            </div>
        </ApiContextProvier>
    );
};

export default Main;