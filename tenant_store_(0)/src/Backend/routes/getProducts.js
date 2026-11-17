import productModel from "../Data/products.js"
import {verifyToken} from "../middleware/jwt.js"

export async function getProducts(request, response ) {
    try{

        // veriy the logged tenat using JWT token
    const isTokenValid = verifyToken(request, response)
    if (!isTokenValid) {
        return; // If the token is invalid, the response has already been sent in verifyToken function
    }

    const tenantId = request.tenant.id; // Get the logged-in tenant's ID
    // fetch only tenant specific products from the database using the tenantId
    const Product = await productModel.find({ tenantId: tenantId }) // Fetch products for the specific tenant
        response.writeHead(200,{ "Content-Type": "application/json"})
        response.end(JSON.stringify(Product))
    }catch(error){
        console.error("Error reading Products:",error)
        response.writeHead(500,{"Content-Type": "application/json"})
        response.end(JSON.stringify({message:"Failed to load product"}))
    }

}