'use client';

import { FC, useState } from "react";

const Home: FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([
    { text: "Hi!", sender: 'user' },
    { text: "Hello! How can I help you today?", sender: 'bot' },
  ]);
  const [inputText, setInputText] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setIsConnected(true);
        setAccount(accounts[0]); // Store the first account address
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
      setInputText(""); // Clear the input field
    }

    // fetch('http://127.0.0.1:5000', )
    try {
      const response = await fetch('http://127.0.0.1:5000/chat_gen',
        {
          method: 'POST',
          headers:
          {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: "How long is midnight ?" }),
        });

      const data = await response.json();
      console.log(data, "==================");

      const botMessage = { text: data.response, sender: 'bot' };
      // setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message to backend:")
    };

    return (
      <div className="h-full bg-cover bg-center" style={{ backgroundImage: 'url(https://png.pngtree.com/thumb_back/fh260/background/20230523/pngtree-bible-gif-hd-wallpaper-image_2683159.jpg)' }}>
        {/* Transparent Navbar */}


        {/* Hero Section */}
        <div className="flex h-full pt-24">
          {/* Hero Text - 2/3rd */}
          <div className="w-2/3 flex items-center justify-center">
            <h1 className="text-5xl text-white font-bold">YO SSUP !!!</h1>
          </div>

          {/* Chatbot - 1/3rd */}
          <div className="w-1/3 rounded-lg shadow-lg p-6 mt-6 mb-6 mr-6 flex flex-col">
            <h2 className="text-xl font-bold mb-4">Chatbot</h2>
            <div className="flex-grow overflow-y-auto backdrop-blur-md bg-white/50 p-4 rounded mb-4">
              {/* Chat Messages */}
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
                  <div className={`p-2 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-grow p-2 border rounded"
                placeholder="Type your message..."
              />
              <button onClick={handleSendMessage} className="bg-blue-500 text-white px-4 py-2 rounded ml-2">Send</button>
            </div>
          </div>
        </div>
      </div>
    );
  };
}
export default Home;
