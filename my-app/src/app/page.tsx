'use client';

import { FC, useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { HiPaperAirplane } from "react-icons/hi";
import Image from "next/image"; // Send icon

const Home: FC = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [account, setAccount] = useState<string | null>(null);
    const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([
        { text: "Hi!", sender: 'user' },
        { text: "Hello! How can I help you today?", sender: 'bot' },
    ]);
    const [inputText, setInputText] = useState("");
    const heroRef = useRef<HTMLDivElement>(null); // Ref for hero text animation
    const chatRef = useRef<HTMLDivElement>(null); // Ref for chat message animation
    const descriptionRef = useRef<HTMLDivElement>(null); // Ref for description

    useEffect(() => {
        // GSAP Hero Text Animation
        if (heroRef.current) {
            gsap.fromTo(heroRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }
            );
        }
    }, []);

    useEffect(() => {
        // GSAP Chat Message Animation
        if (chatRef.current) {
            gsap.fromTo(chatRef.current,
                { opacity: 0, x: 100 },
                { opacity: 1, x: 0, duration: 1.2, ease: "power3.out" }
            );
        }
    }, [messages]); // Re-run the animation when a new message is added

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setIsConnected(true);
                setAccount(accounts[0]);
                console.log('Connected account:', accounts[0]);
            } catch (error) {
                console.error("User denied wallet connection");
            }
        } else {
            alert("MetaMask is not installed. Please install MetaMask and try again.");
        }
    };

    const handleSendMessage = async () => {
        if (inputText.trim()) {
            setMessages((prev) => [...prev, { text: inputText, sender: 'user' }]);
            setInputText("");

            try {
                const response = await fetch('http://127.0.0.1:5000/chat_gen', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ prompt: inputText }), // Use the inputText as prompt
                });

                const data = await response.json();
                setMessages((prev) => [...prev, { text: data.ans, sender: 'bot' }]);
            } catch (error) {
                console.error("Error sending message to backend:", error);
            }
        }
    };

    return (
        <div className="h-[220vh] bg-black relative">
            <div className="flex h-[100vh] pt-24">
                {/* Hero Text - 2/3rd */}
                <div ref={heroRef} className="w-2/3 flex flex-col items-center justify-center text-center px-6">
                    <h1 className="text-7xl font-extrabold text-green-400 animate-bounce">
                        Ask <span className="text-yellow-300">Jesus</span> Anything
                    </h1>
                    <p className="mt-4 text-3xl font-semibold hidden lg:block">
                        Get divine answers instantly through our AI-powered Bible chat!
                    </p>
                </div>

                {/* Chatbot - Fixed Position with Reduced Height */}
                <div className="fixed right-8 bottom-8 w-[480px] h-[calc(100%-6rem-30px)] rounded-lg shadow-lg p-6 flex flex-col"
                    style={{
                        backgroundColor: 'black',
                        border: '1px solid rgba(0, 128, 0, 0.6)',
                        boxShadow: '0 0 20px rgba(0, 128, 0, 0.8), 0 0 30px rgba(0, 128, 0, 0.7), 0 0 40px rgba(0, 128, 0, 0.6)',
                    }}
                >
                    <h2 className="text-xl font-bold text-white mb-4">Confess:</h2>
                    <div ref={chatRef} className="flex-grow overflow-y-auto backdrop-blur-md bg-white/10 p-4 rounded mb-4">
                        {/* Chat Messages */}
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex mb-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-3 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-green-500 text-white rounded-br-none' : 'bg-gray-800 text-white rounded-bl-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="flex-grow p-3 border rounded bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 glow-input"
                            placeholder="Type your message..."
                            style={{
                                boxShadow: '0 0 5px rgba(0, 255, 0, 0.8)', // Glowing effect
                            }}
                        />
                        <div className="ml-2">
                            <button
                                onClick={handleSendMessage}
                                className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-3 rounded-lg transition-transform duration-200 transform hover:scale-105 flex items-center justify-center"
                            >
                                <HiPaperAirplane className="text-xl" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description Section with Matching Background Color */}
            <div ref={descriptionRef} className="absolute w-1/2 mx-auto top-[80vh] left-16 p-6">
                <div className="bg-black rounded-lg p-6 shadow-lg transition-transform duration-300 hover:scale-105"
                    style={{
                        border: '1px solid rgba(0, 128, 0, 0.6)',
                        boxShadow: '0 0 20px rgba(0, 128, 0, 0.8), 0 0 30px rgba(0, 128, 0, 0.7), 0 0 40px rgba(0, 128, 0, 0.6)',
                    }}
                >
                    <h2 className="text-4xl font-bold text-white mb-2">Description</h2>
                    <p className="mt-4 text-xl leading-relaxed text-gray-300">
                        In our daily lives, it’s common to experience feelings of demotivation and uncertainty. This app provides a unique sanctuary where you can reach out to Jesus for guidance and encouragement. By asking any question or expressing your concerns, you can receive comforting words and motivational insights that uplift your spirit.
                        <br />
                        <br />
                        Example prompts include:<br />
                        👉 “What can I do to overcome my fears?”<br />
                        👉 “How can I find purpose in my struggles?”<br />
                        👉 “What does the Bible say about hope?”<br />
                        👉 “How can I strengthen my faith during tough times?”<br />
                        👉 “What are some hymns that can inspire me today?”<br />
                        👉 “Can you share a Psalm that speaks to comfort and strength?”<br />
                        <br />
                        <br />
                        Additionally, you can explore the hymns of the Bible and Psalms, deepening your spiritual connection and moving closer to God. Whether you're facing challenges in your personal or professional life, this app serves as a source of hope and inspiration, reminding you of the strength within and the divine support available to you. Embrace the power of faith to reignite your motivation!

                    </p>
                </div>
            </div>

            {/* Footer with Blinking Text */}
            <footer className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
  <div className="text-center">
    <p className="text-white text-xl flex items-center justify-center">
      <span className=" px-2">Powered by</span>
      
      <Image
        src="https://www.gaianet.ai/images/logo.png" // Replace with your image URL
        alt="Description of image"
        width={50} // Specify the width
        height={30} 
        // Specify the height
        // layout="intrinsic" // Optional: you can use 'fixed', 'intrinsic', 'responsive', etc.
      />
      {/* <span>Bible AI Agent</span> */}
    </p>
  </div>
</footer>


            <style jsx>{`
                .blinking {
                    animation: blinkingText 1.5s infinite;
                }

                @keyframes blinkingText {
                    0% { opacity: 1; }
                    50% { opacity: 0; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default Home;
