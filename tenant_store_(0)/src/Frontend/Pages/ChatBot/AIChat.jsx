
import { useState } from "react";
import "./AIChat.css";

function AIChat({ product ,isOpen,setIsOpen}) {  // this function receives a prop named product from its parent component.

    // Stores the message currently being typed
    const [input, setInput] = useState("")

    // Stores the conversation
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            text: "Hello! I'm your AI Product Assistant. How can I help you improve your product?"
        }
    ])

    // Send a message
    function handleSend(event) {
        event.preventDefault()
        const userMessage = input.trim() // stores the user typed message and trim it remove extra spaces
        if (userMessage === "") {
            return;
        }
    
        setInput("")  // Clear the input

        // updaing  the conversation
        setMessages((previousMessages) => [
            ...previousMessages,   // copies all existing messages into the new array
            {
                role: "user",
                text: userMessage
            },
            {
                role: "assistant",
                text: "The AI service is not connected yet. We'll connect the LLM API in the next stage."
            }
        ])
    }

    return (
       <div className={`ai-chat-container ${isOpen ? "open" : ""}`}>
            {/* Floating AI button */}
            <button
                className="ai-floating-button"
                onClick={() => setIsOpen(!isOpen)}
                type="button"
            >
                 ✦ AI
            </button>

            {/* Chat sidebar */}   {/* Conditional rendering of the sidebar: if isOPen is true display the sidebar  */}
            {isOpen && (
                <div className="ai-chat-sidebar">

                    {/* Header */}
                    <div className="ai-chat-header">
                        <div>
                            <h3>AI Assistant</h3>
                            <p>Product assistance</p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                        >
                            ×
                        </button>
                    </div>

                    {/* Current product context */}
                    <div className="ai-product-context">
                        <span>Working on</span>
                        <strong>{product?.name || "Your product"}</strong>
                    </div>

                    {/* Conversation messages */}    {/*  displaying conversation mssages */}
                    <div className="ai-chat-messages">
                 {/* map() generates one for every object in your array soo don't have to write each div manually */}      
                  {messages.map((message, index) => (    
                            <div
                                key={index}
                                className={`ai-message ${message.role}`}
                            >
                                {message.text}
                            </div>
                        ))}
                    </div>

                    {/* Message input */}
                    <form
                        className="ai-chat-input"
                        onSubmit={handleSend}
                    >
                        <input
                            type="text"
                            placeholder="Ask something about your product..."
                            value={input}   
                            onChange={(event) => setInput(event.target.value)}
                        />

                        <button type="submit">
                            Send
                        </button>
                    </form>

                </div>
            )}
       </div>
    )
}

export default AIChat;
