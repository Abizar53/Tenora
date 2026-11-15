import { verifyToken } from "../middleware/jwt.js";
import dotenv from "dotenv"


dotenv.config({path: "./src/Backend/.env"})
async function aiAssistant(request,response) {
    try{
        const apikey = process.env.GROQ_API_KEY

        // verify token
        const isTokenValid=verifyToken(request,response)
        if (!isTokenValid){ return; }

        // checking does the API Key exist in env
        if (!apikey){
             response.writeHead(500, { "Content-Type": "application/json"
            });
            response.end(JSON.stringify({ message: "Groq API key is missing."
            }));

            return;
        }
        // read request body
        let body=""
        request.on("data",(chunks)=>{ body+= chunks.toString()})
        request.on("end",async () => {
           
            try{
            
                const requestdata=JSON.parse(body)   //frontend sends a request, the backend receives the data from the request body

                if(!Array.isArray(requestdata.message)    //array because a chatbot conversation contains multiple messages, not just one message
                || requestdata.message.length==0 // checks empty
                || requestdata.message.length>20 ){  // Checks whether the array contains more than 20 messages, because of api token limits and billing
                    response.writeHead(400,{"Content-Type":"application/json"})
                    response.end(JSON.stringify({message:"Invalid chat message"}))
                    return ;
                }
        
                const conversation = requestdata.message.slice(-10)   // keeping only the recent 10 ocnversation (if there are 5 , all 5 will be kept
                
               
                // validate individual message length
                for (const msg of conversation){
                                        
                    if (!msg || typeof msg.content !== "string" || msg.content.trim()==="" || !["user", "assistant"].includes(msg.role) || msg.content.length > 3000){  // content will come from frontend... checks: message should exceed more than 3000 words 
                         response.writeHead(400,{"Content-Type":"application/json"})
                         response.end(JSON.stringify({message:"Invalid chat message"}))
                         return 
                }               
            }

        // now preparing the messsage for LLM
        const messages=[{
             role: "system",
                        content: ` You are Tenora's AI Product Assistant.

                            Help tenants create better product listings.

                            You can suggest:
                            - Product names
                            - Short descriptions
                            - Detailed descriptions
                            - Product categories
                            - Relevant product tags

                            Use only the product information provided
                            by the tenant.

                            Never invent product specifications,
                            ingredients, certifications, dimensions,
                            weight, or other factual details.

                            If important information is missing,
                            ask the tenant for clarification.

                            Keep your responses clear and useful  `
                    },

                    ...conversation.map(message => ({
                        role: message.role,     // takes the role from the existing object.
                        content: message.content.trim()   // takes it content and removes whitespaces from the beginning 
                        //map() method goes through every object in the array and creates a new object for each one
                        // example const conversation = [
                        // { role: "user", content: "Suggest a laptop" },
                        // { role: "assistant", content: "What is your budget?" }
                    }))
        ]

        // send request to groq api
        const groqResponse =await fetch("https://api.groq.com/openai/v1/chat/completions",{   //This URL is Groq's Chat Completions API endpoint
            method : "POST",
            headers: { "Content-Type": "application/json",
                            "Authorization": `Bearer ${apikey}`  },  // retrieves the API key from your .env file
            body:JSON.stringify({
                model:"openai/gpt-oss-120b",  //Specifies which AI model Groq should use to generate the response
                messages:messages,      //Sends the conversation array we created earlier
                max_completion_tokens: 500, //Sets the maximum number of tokens the model can generate in its response
            })
        })
        const groqData=await groqResponse.json()  // Without converting the response body into a JavaScript object, we cannot directly access choices, message, and content as JavaScript properties
        // now lets check groq response
         if (!groqResponse.ok) {
                    console.error("Groq API error:", groqData);
                    response.writeHead(502, { "Content-Type": "application/json"
                    });
                    response.end(JSON.stringify({ message: "AI service could not generate a response."
                    }));

                    return;
                }

        // if everything is alright then EXTRACT GENERATED RESPONSE
        const groqReply =  groqData.choices?.[0]?.message?.content; // choices : array of generated choices, contain multiple generated answer ......optional chaining if it exist then next, if null,undefined encountered then rthe expression stops and returns undefined instead of throwing an error

                if (!groqReply) { response.writeHead(502, { "Content-Type": "application/json"
                    });
                    response.end(JSON.stringify({  message: "AI returned an empty response."
                    }));
                    return    }

                

        // finally we are sending the response to frontend 
        response.writeHead(200,{ "Content-Type":"application/json"})
        response.end(JSON.stringify({ message: groqReply }))



        } catch (error) {
                console.error("AI assistant error:", error)
                response.writeHead(500, { "Content-Type": "application/json"
                })
                response.end(JSON.stringify({ message: "Unable to process your message."
                }))
            }
        })

        } catch (error) {
        console.error("AI assistant error:", error);
        response.writeHead(500, { "Content-Type": "application/json"
        })
        response.end(JSON.stringify({ message: "Internal server error."
        }))

    }

}

export default aiAssistant;