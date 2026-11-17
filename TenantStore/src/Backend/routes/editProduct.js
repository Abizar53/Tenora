import mongoose from "mongoose";
import {verifyToken} from "../middleware/jwt.js"
import validateProduct from "../middleware/ValidateProduct.js";
import productModel from "../Data/products.js";

async function Edit(request,response) {
    try{
        // verify JWT token
    const isTokenValid = verifyToken(request, response)
    if (!isTokenValid) {
          return; // If the token is invalid, the response has already been sent in verifyToken function
    }

    // get product id from the request url
    const productId =  request.url.split("/")[3]

    // validate MongoDB product Id
    if (!mongoose.Types.ObjectId.isValid(productId)) {
         response.writeHead(400, { "Content-Type": "application/json"})
              response.end(JSON.stringify({
                message: "Invalid product ID."
            }));

            return;
        }
    
    // read the the body of the request
    let body = "";
    request.on("data", (chunks) => {
        body += chunks.toString();
    })

    request.on("end", async () => {
        try {
            const productData = JSON.parse(body);
           

console.log("Received body:", body);
console.log("Parsed product data:", productData);
            const resultAfterValidation=validateProduct(productData)

             if (!resultAfterValidation.valid) {
                    response.writeHead(400, {
                        "Content-Type": "application/json"
                    });
                    response.end(JSON.stringify({
                        message: resultAfterValidation.message
                    } ) )
                    return;
                }

     // Get validated fields
        const updatedFields = resultAfterValidation.updatedFields;

        // Update product in MongoDB
        const updatedProduct = await productModel.findOneAndUpdate(
        {
          _id: productId,
           tenantId: request.tenant.id
        },
        {
          $set: updatedFields
        },
        {
         new: true,
          runValidators: true
        } )

         // Check whether product exists
         if (!updatedProduct) {

              response.writeHead(404, { "Content-Type": "application/json"  });
                    response.end(JSON.stringify({ message: "Product not found."}));
                    return;        }

                response.writeHead(200, { "Content-Type": "application/json" });
                
                response.end(JSON.stringify({message: "Product updated successfully.",product: updatedProduct

                
                }))

            }catch (error) {

                console.error("Error updating product:", error);
                response.writeHead(400, {"Content-Type": "application/json"});
                response.end(JSON.stringify({  message: "Invalid request data." }));

            }

        })
    }catch (error){
        console.error("error in UpdatedProduct:",error)
        response.writeHead(500,{"Content-Type":"application/json"})
        response.end(JSON.stringify({message:"Internal server error"}))
    }


}

export default Edit