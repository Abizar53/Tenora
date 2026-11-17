import http from "node:http"
import { Login_backend }  from "./routes/authenticate.js"
import { addProduct } from "./routes/addProducts.js"
import {getProducts} from "./routes/getProducts.js"
import {fetchEnquiries, updateEnquiryStatus} from "./routes/enquiryhandler.js"
import Edit from "./routes/editProduct.js"
import aiAssistant from "./Controllers/aiAssistant.js"
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()   
mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{ console.log("Mongodb connected successfully")})
    .catch((error)=> console.log("MongoDB connection failed:", error.message))
    
const server=http.createServer((request,response)=>{
    console.log("Incoming request:", request.method, request.url)
    //allow request from react development server
    response.setHeader("Access-Control-Allow-Origin","http://localhost:5173")
    response.setHeader("Access-Control-Allow-Methods","GET,POST,PATCH,OPTIONS")
    response.setHeader("Access-Control-Allow-Headers","Content-Type, Authorization")

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






    response.writeHead(404,{"content-type":"application/json"})
    
    response.end(JSON.stringify({message:"Route not found"}))


})





server.listen(()=>{
    console.log("Node js server running on https://tenora-7c00.onrender.com/ ")
})