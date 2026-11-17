import jwt from "jsonwebtoken"

import dotenv  from "dotenv"
dotenv.config({path: "./src/Backend/.env"}) // Load environment variables from .env file

console.log("JWT secret loaded:", Boolean(process.env.JWT_SECRET));

export function verifyToken(request, response, next){
    const authHeader= request.headers.authorization // get token from request header, include additional information in its headers. One such header is Authorization.
    if (!authHeader) { response.writeHead(401,{"Content-Type":"application/json"}) ; response.end(JSON.stringify({message:"Access denied. No token provided."})) ; return false}

    // extract the token from the header
    const token =authHeader.split(" ")[1] // The token is usually sent in the format "Bearer <token>", so we split the header value and take the second part (the actual token).

    try{
        const decoded =jwt.verify(token, process.env.JWT_SECRET) // Verify the token using the secret key. If the token is valid, it will return the decoded payload.
        request.tenant = { id :decoded.tenantId } // Attach the tenantId to the request 
        return true // Call the next middleware or route handler
    } catch (error) {
        response.writeHead(400,{"Content-Type":"application/json"})
        response.end(JSON.stringify({message:"Invalid token"}))
        return false
    }

}

export function generateToken(tenantId){
    const token= jwt.sign({ tenantId }, process.env.JWT_SECRET, { expiresIn: "1h" }) // arguement 1: paload- what info goes inside token, arguement2 : secret key - used to validate the signature, arguement3: options - token expiration time
    return token
}