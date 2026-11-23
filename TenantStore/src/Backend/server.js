import http from "node:http"
import { Login_backend }  from "./routes/authenticate.js"
import { addProduct } from "./routes/addProducts.js"
import {getProducts} from "./routes/getProducts.js"
import {fetchEnquiries, updateEnquiryStatus} from "./routes/enquiryhandler.js"
import Edit from "./routes/editProduct.js"
import aiAssistant from "./Controllers/aiAssistant.js"
import mongoose from "mongoose"
import dotenv from "dotenv"
import { v2 as cloudinary } from "cloudinary";
import uploadProductImage from "./Controllers/uploadProductImages.js"

dotenv.config()   
const PORT = process.env.PORT || 4052;
mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{ console.log("Mongodb connected successfully")})
    .catch((error)=> console.log("MongoDB connection failed:", error.message))

cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
    
const server=http.createServer((request,response)=>{
    console.log("Incoming request:", request.method, request.url)
    //allow request from local, deployed frontend 
    const allowedOrigin=["http://localhost:5173","https://tenora-beta.vercel.app"]     //reate an array containing the frontend URLs that are allowed to communicate with our backend
    const origin= request.headers.origin     // when frontend sends a request to backend, the browser includes an HTTP header called Origin, and this line exracts the value and stores it in the origin variable
    if(allowedOrigin.includes(origin)){      // check is the value exists
    response.setHeader("Access-Control-Allow-Origin",origin)   //This tells the browser which origin is allowed to access the response, : sending actual origin value
    }
    response.setHeader("Vary", "Origin")       //tells caching systems that the response can change depending on the request's Origin
    response.setHeader("Access-Control-Allow-Methods","GET,POST,PATCH,OPTIONS")
    response.setHeader("Access-Control-Allow-Headers","Content-Type, Authorization")
    response.setHeader("Access-Control-Allow-Credentials", "true");

    //Handle browser CORS preflight Request
    if (request.method === "OPTIONS"){
        response.writeHead(204)
        response.end()
        return
    }
    // Home route
if (request.method === "GET" && request.url === "/") {
    response.writeHead(200, {
        "Content-Type": "text/plain"
    });

    response.end("Tenora backend is running!");
    return;
}


// Login route  

    if (request.method==="POST" && request.url==="/api/auth/login"){
         console.log("Login route reached");
        Login_backend(request,response)
        return
    }


    // Save a product
    if (
  request.method === "POST" &&
  request.url === "/api/products"
) {
  addProduct(request, response);
  return;
}

//Retrieve saved products
if (
  request.method === "GET" &&
    request.url === "/api/products"
    ) {
        getProducts(request, response);
        return;
    }

 // get enquiries for the logged-in tenant
if ( request.method === "GET" && request.url === "/api/enquiries"){
    fetchEnquiries(request,response);
    return 
}
// update enquiry status for the logged-in tenant
if (request.method === "PATCH" && request.url.startsWith("/api/enquiries/")){
    updateEnquiryStatus(request,response)
    return
}
//edit the tnenat product
if (request.method === "PATCH" && request.url.startsWith("/api/products/")){
    Edit(request,response)  
    return
}
// AI assistant
if( request.method=="POST" && request.url === "/api/ai-assistant"){
    aiAssistant(request,response)
    return
}
// multiple product image upload
if (request.method ==="POST" && request.url ==="/api/products/images"){
    uploadProductImage(request,response,cloudinary)
    return
}






    response.writeHead(404,{"content-type":"application/json"})
    
    response.end(JSON.stringify({message:"Route not found"}))


})





server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
})