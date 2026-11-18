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
                const context = requestdata.context || {};
                console.log("Context received by backend:", context);
                if(!Array.isArray(requestdata.messages)    //array because a chatbot conversation contains multiple messages, not just one message
                || requestdata.messages.length==0 // checks empty
                || requestdata.messages.length>20 ){  // Checks whether the array contains more than 20 messages, because of api token limits and billing
                    response.writeHead(400,{"Content-Type":"application/json"})
                    response.end(JSON.stringify({message:"Invalid chat message"}))
                    return ;
                }
        
                const conversation = requestdata.messages.slice(-10)   // keeping only the recent 10 ocnversation (if there are 5 , all 5 will be kept
                
               
                // validate individual message length
                for (const msg of conversation){
                                        
                    if (!msg || typeof msg.content !== "string" || msg.content.trim()==="" || !["user", "assistant"].includes(msg.role) || msg.content.length > 3000){  // content will come from frontend... checks: message should exceed more than 3000 words 
                         response.writeHead(400,{"Content-Type":"application/json"})
                         response.end(JSON.stringify({message:"Invalid chat message"}))
                         return 
                }               
            }

        // now preparing the messsage for LLM
         //${JSON.stringify(context, null, 2)} it have java script objet so convert itno string and add some spaces ,this  feed the model the product info we are working on
        // Your current page is: ${context.page || "unknown"}---> to identify which product we are in
         const messages=[{
             role: "system",
             content: ` You are Tenora's AI Product  for a multi-tenant e-commerce platform.
            Your job is to help tenants understand e-commerce concepts, manage their stores, and create or improve product listings.

            You will receive context about the current page and, when available, the current product.

            CURRENT CONTEXT:
            ${JSON.stringify(context, null, 2)}

            PAGE-SPECIFIC BEHAVIOUR:
                     1. DASHBOARD:
                    - Answer general questions about e-commerce, store management, marketing, SEO, and business improvement.
                    - Provide practical suggestions to help tenants manage and grow their stores.
                    - Do not generate product-field suggestions unless the tenant explicitly requests one.

                    2. ADD PRODUCT:
                    - Help tenants understand product listing concepts such as SKU, category, tags, pricing, descriptions, and product specifications.
                    - Answer general questions clearly.
                    - When the tenant explicitly asks you to create a particular product field, provide a structured suggestion for that field.

                    3. EDIT PRODUCT:
                    - Help tenants understand product-related concepts and improve existing product listings.
                    - Use the provided product information when answering questions about the current product.
                    - When the tenant explicitly asks you to improve or rewrite a particular product field, provide a structured suggestion for that field.

                    RESPONSE RULES:

                    1. GENERAL QUESTIONS:
                    If the tenant asks a question such as:
                    - What is SEO?
                    - What does SKU mean?
                    - How do product tags work?

                    Answer normally in the reply property and set suggestion to null.

                        
                    2. GENERAL ADVICE:
                    If the tenant asks for advice, such as:
                    - How can I improve my store?
                    - How can I make my product more attractive?

                    Provide useful guidance in the reply property.
                    Set suggestion to null unless the tenant explicitly requests a concrete product-field suggestion.

                    3. PRODUCT-FIELD SUGGESTIONS:
                    If the tenant explicitly asks you to create, rewrite, or improve a particular product field:
                    - Generate the suggested content.
                    - Identify the exact field being suggested.
                    - Return the suggestion in the required structure.
                    - Include a short explanation in the reply property.

                    ALLOWED PRODUCT FIELDS:
                    - name
                    - shortDescription
                    - description
                    - category
                    - tags

                    FIELD VALUE RULES:
                    - tags must be an array of strings.
                    - All other allowed fields must be strings.
                    - Suggest only one field at a time.
                    - Never suggest changing product IDs, tenant IDs, or ownership information.
                    - Do not invent product specifications, certifications, ingredients, or other factual details.
                    - Use existing product information as context.
                    - If important information is missing, ask the tenant for clarification instead of inventing details.

                    IMPORTANT:
                   
                    - Never claim that a suggestion has already been applied or saved.
                    - The tenant must review and manually apply every suggestion.
                    - If the tenant asks a general question, do not generate an unnecessary product-field suggestion.

                    OUTPUT FORMAT:

                    Always return a valid JSON object with exactly these two properties:

                    {
                        "reply": "Your response to the tenant",
                        "suggestion": null
                    }

                    When providing a product-field suggestion, return:

                    {
                        "reply": "Here is my suggested product description.",
                        "suggestion": {
                            "field": "description",
                            "value": "Your suggested description here"
                        }
                    }

                    For tags, return an array:

                    {
                        "reply": "Here are some suggested tags.",
                        "suggestion": {
                            "field": "tags",
                            "value": ["tag1", "tag2", "tag3"]
                        }
                    }

                    Return JSON only.
                    Do not use Markdown code fences around the JSON.
                    `},

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
                max_completion_tokens: 1000, //Sets the maximum number of tokens the model can generate in its response
                // Ask Groq to return valid JSON
                response_format: { type: "json_object"},
                // Hide the model's reasoning tokens
                reasoning_format: "hidden",
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
        const choice = groqData.choices?.[0];

        console.log("Groq finish reason:", choice?.finish_reason);

        // if everything is alright then EXTRACT GENERATED RESPONSE
        const groqReply =  groqData.choices?.[0]?.message?.content; // choices : array of generated choices, contain multiple generated answer ......optional chaining if it exist then next, if null,undefined encountered then rthe expression stops and returns undefined instead of throwing an error

               // Check whether Groq returned a response
                if (!groqReply) {
                    response.writeHead(502, {
                        "Content-Type": "application/json"
                    });

                    response.end(JSON.stringify({
                        message: "AI returned an empty response."
                    }));

                    return;
                }

        // Convert the AI's JSON string into a JavaScript object
       let aiResponse;

try {
    aiResponse = JSON.parse(groqReply);
} catch (error) {
    console.error("Invalid JSON from Groq:", groqReply);

    response.writeHead(502, {
        "Content-Type": "application/json"
    });

    response.end(JSON.stringify({
        message: "AI returned an invalid response. Please try again."
    }));

    return;
}

        // Allow only supported product fields
        const allowedFields = [
            "name",
            "shortDescription",
            "description",
            "category",
            "tags"
        ];

        let suggestion = null;

        if (
            aiResponse.suggestion &&
            allowedFields.includes(aiResponse.suggestion.field)
        ) {
            const { field, value } = aiResponse.suggestion;

            const validValue =
                field === "tags"
                    ? Array.isArray(value) &&
                    value.every(tag => typeof tag === "string")
                    : typeof value === "string";

            if (validValue) {
                suggestion = { field, value };
            }
        }             

        // finally we are sending the response to frontend 
        response.writeHead(200,{ "Content-Type":"application/json"})
        response.end(JSON.stringify({ message: aiResponse.reply || "Here is my response.",
                suggestion: suggestion}))



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