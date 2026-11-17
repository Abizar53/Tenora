import { useState } from "react";
import AIChat from "./AIChat";
import "./ChatLayout.css";

function ChatLayout ({children,context,onApplySuggestion}) { {/*children is a special prop provided by React*/}
    const [isOpen,setIsOpen]= useState(false)  // control visibility of the chatbot buton
   // setting Both the page content and chatbot inside the same parent 
    return(

        
          <div className="chat-layout">

            {/* Main page content */}
            <div className="chat-page-content">
                {/*children contains the entire div from EditProduct, children represent entire product.jsx*/}
                {children}    {/* {children} tells React to display that content at this position */}
            </div>

             {/* AI Chat sidebar , Passing three props*/}
             {/* product: current product info */}
              {/* isOpen: current Chabot visibility state */}
                {/* setIsOpen: change chatbot visbility */}
                {/* onApplySuggestion:  create a button with click on it , the form gets the suggested values*/}
            <AIChat    
                context={context}   
                isOpen={isOpen}       
                setIsOpen={setIsOpen} 
                onApplySuggestion={onApplySuggestion}
            />

            </div>
    )
}

export default ChatLayout