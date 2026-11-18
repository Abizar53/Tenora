
import { useState } from "react";
import "./AIChat.css";

function AIChat({ context ,isOpen,setIsOpen, onApplySuggestion}) {  // this function receives a prop named product from its parent component.

    // Stores the message currently being typed
    const [input, setInput] = useState("")

    // Stores the conversation
    const [message, setMessages] = useState([
        {
            role: "assistant",
            content: "Hello! I'm your AI Product Assistant. How can I help you improve your product?"
        }
    ])

    // Send a message
    async function handleSend(event) {
        event.preventDefault()
        const userMessage = input.trim() // stores the user typed message and trim it remove extra spaces
        if (userMessage === "") {
            return;
        }

        // Add user's message to conversation
    const updatedMessages = [
        ...message,
        {
            role: "user",
            content: userMessage
        }
    ];

    setMessages(updatedMessages);
    
        setInput("")  // Clear the input

        try{
            const token =sessionStorage.getItem("token")
            console.log("Context being sent:", context);
            const response =await fetch("https://tenora-7c00.onrender.com/api/ai-assistant",{
                method:"POST",
                headers:{  "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                messages:updatedMessages.filter((message)=>message.role !="system"),
                context:context
            })
            })
            const data= await response.json()
            if (!response.ok) {
            throw new Error(data.message || "Unable to get AI response")  }
        

        // add AI response to conversation
        setMessages((previousMessages) => [
            ...previousMessages,   // copies all existing messages into the new array
            {
                role: "assistant",
                content: data.message,
                suggestion: data.suggestion
            },
           ])
    }catch (error) {
        console.error("AI Chat Error:", error);
    }
}

function handleReset() {  // this clears the conversation history
    // Clear existing conversation and restore the welcome message
    setMessages([
        {
            role: "assistant",
            content: "Hello! I'm your AI Product Assistant. How can I help you improve your product?"
        }
    ]);

    // Clear anything typed in the input
    setInput("");
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

    <div className="ai-chat-header-buttons">

        {/* Reset conversation */}
        <button
            type="button"
            onClick={handleReset}
            title="Reset chat"
        >
            ↻
        </button>

        {/* Close chat */}
        <button
            type="button"
            onClick={() => setIsOpen(false)}
            title="Close chat"
        >
            ×
        </button>

    </div>
</div>

                    {/* Current product context */}
                    <div className="ai-product-context">
                        <span>Working on</span>
                        <strong>{context?.product?.name || "Your product"}</strong>
                    </div>

                    {/* Conversation messages */}    {/*  displaying conversation mssages */}
                    <div className="ai-chat-messages">
                 {/* map() generates one for every object in your array soo don't have to write each div manually */}      
                  {message.map((message, index) => (    
                            <div
                                key={index}
                                className={`ai-message ${message.role}`}
                            >
                                {/* AI's normal response */}
                                {message.content}
                        
                                   {/* Product field suggestion */}
                                {message.suggestion && (
                                    <div className="suggestion-container">

                                        {/* Display suggested value */}
                                        <p className="suggestion-value">
                                            {message.suggestion.value}
                                        </p>

                                        {/* Apply suggestion button */}
                                        <button
                                            type="button"
                                            className="apply-suggestion-btn"
                                            onClick={() => onApplySuggestion(
                                                message.suggestion.field,
                                                message.suggestion.value
                                            )}
                                        >
                                            <span>✦</span> Apply Suggestion
                                        </button>

                                    </div>
                                )}

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
