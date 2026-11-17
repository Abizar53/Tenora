import tenantModel from "../Data/tenants.js";
import { generateToken}  from "../middleware/jwt.js"


export function Login_backend(request,response){   //Makes the function available to other files, alsoAccepts the incoming request and the outgoing response.
    let body=""       // node js receives in chunks (https request)

    request.on("data",(chunks)=>{  // its a event listner (just like click button in js )
        body+=chunks
    })

    request.on("end",()=>{     // "end" event fires when all the request data has been received.
    
    console.log("Tenant data:", tenantModel) // Log the tenant model to verify its structure and contents. This helps in debugging and understanding the data being handled.;
        try{
            
            console.log("Received body:", body);
            const {email,password }=JSON.parse(body)   // convert text into json files and save it on the variable
            console.log("Received email:", email);
            console.log("Received password:", password);

            // find tenant in moongo db using their email and password
           tenantModel.findOne({email:email})
           .then((ten)=>{  // if we find the data in database, then enter then method
 console.log("Tenant found:", Boolean(ten));
    console.log("Received email:", email);
    if (ten) {
        console.log("Stored password matches:", ten.password === password);
    }

             if (!ten || ten.password !== password) {
                        response.writeHead(401, {
                            "Content-Type": "application/json"
                })
            response.end(JSON.stringify({
                            message: "Invalid email or password"
                        }));
                        return             }

            // generate a JWT token for the successful login
            const token = generateToken(ten._id.toString())

             response.writeHead(200, {
                        "Content-Type": "application/json"
                    });

             response.end(JSON.stringify({
                        message: "Login successful",
                        token: token,
                        ten: {
                            id: ten._id.toString(),
                            storeName: ten.name,
                            email: ten.email
                        }
                    }));

                })
        .catch((error) => {     // if parsing the body fails, enter catch method to handle the array
            console.error("Error during login:", error);
            response.writeHead(500,{"content-type":"application/json"})
            response.end(JSON.stringify({message:"Internal server error"}))
        })
    }
        catch (error) { response.writeHead(400, { "Content-Type": "application/json" });
            response.end(JSON.stringify({
                message: "Invalid JSON request body "
            }));
        }
    });
}