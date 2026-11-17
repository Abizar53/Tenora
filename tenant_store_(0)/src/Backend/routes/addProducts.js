import productModel from "../Data/products.js"
import { randomUUID } from "node:crypto"    
import {verifyToken} from "../middleware/jwt.js"


export async function addProduct(request,response) {

    const isTokenValid = verifyToken(request, response)
    if (!isTokenValid) {
        return; // If the token is invalid, the response has already been sent in verifyToken function
    }

    let body=""
    request.on("data",(chunk)=> {body+=chunk})

    request.on("end", async()=>{  
        try{
            const product=JSON.parse(body)  // JSON text into a JavaScript object

            // Validating Required product details
            // Convert tags into an array
        const tags = Array.isArray(product.tags)
            ? product.tags
            : (product.tags || "").split(",");

        // Convert numeric fields
        const price = Number(product.price);
        const stock = Number(product.stock);

        const weightGrams = Number(product.weightGrams ?? 0);

        const widthMm = Number(product.dimensions?.widthMm ?? 0);
        const heightMm = Number(product.dimensions?.heightMm ?? 0);
        const depthMm = Number(product.dimensions?.depthMm ?? 0);

            if (
        typeof product.name !== "string" ||
        !product.name.trim() ||

        typeof product.category !== "string" ||
        !product.category.trim() ||

        typeof product.description !== "string" ||
        !product.description.trim() ||

         !Number.isFinite(price) || price <= 0 ||

          !Number.isInteger(stock) || stock < 0 ||

          !Number.isFinite(weightGrams) || weightGrams < 0 ||

          !Number.isFinite(widthMm) || widthMm < 0 ||

          !Number.isFinite(heightMm) || heightMm < 0 ||

          !Number.isFinite(depthMm) || depthMm < 0
) { // if any of these is true then

        response.writeHead(400,{"Content-Type":"application/json"}) // set response status code and content type
        response.end(JSON.stringify({message:"please provide valid product details"}))  // convert the response object into json text and finish the request
        return 
      }
      // Get tenant ID from verified JWT authentication

      //CREATE A NEW PRODUCT RECORD
      const newProduct = new productModel({
        id: randomUUID(),
        name: product.name.trim(),
        category: product.category.trim(),
        description: product.description.trim(),
        price: Number(product.price),
        currency: product.currency?.trim() || "INR",
        stock: Number(product.stock),
        imageUrl: product.imageUrl?.trim() || "",
        // get tenant id from verifiedn jwt authentication
        tenantId: request.tenant.id,  
      })
      // save product to mongodb
      const savedProduct = await newProduct.save()  // save the new product to the database
     response.writeHead(201, {
        "Content-Type": "application/json",
      });
      response.end(JSON.stringify({
        message: "Product added successfully.",
        savedProduct: newProduct,
      })
    )

    }catch(error) {
      console.error("Error saving product:", error);

      response.writeHead(500, {
        "Content-Type": "application/json",
      });

      response.end(JSON.stringify({
        message: "Could not save the product.",
      }))
    }
})


    
}