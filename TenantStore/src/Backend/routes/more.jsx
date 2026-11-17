

import productModel from "../Data/products";


export async function UpdateProductAvailability(request, response) {
    try {
        // verify token
        const isTokenValid = await verifyToken(request, response);
        if (!isTokenValid){return}
        const tenantId = request.tenant.id; // Get the logged-in tenant's ID
        const productId = request.url.split("/")[3];

        let body = ""
        request.on("data", (chunk) => {
            body += chunk;
        })
        request.on("end", async () => {
            try{
                const { isAvailable } = JSON.parse(body)
                // check is isAvailable is boolean
                if (typeof isAvailable !== "boolean"){
                     response.writeHead(400, { "Content-Type": "application/json" });
                    return response.end(JSON.stringify({
                        message: "Invalid availability value"
                    }))
                }

                // update only this tenant product 
                const updateProduct= productModel.findOneAndUpdate(
                    {
                        _id: productId,
                        tenantId:tenantId
                    },{
                        $set:{isAvailable:isAvailable}
                    })

                    if(!updateProduct){
                        response.writeHead(404,{"Content-Type": "application/json"})
                        return response.end(JSON.stringify({
                            message: "Product not found"
                        }))
                    }

                response.writeHead(200, { "Content-Type": "application/json" });
                return response.end(JSON.stringify({
                    message: "Product availability updated successfully",
                    product : updateProduct // product is property name and updateProduct is variable containing the updated product
                }))
            }
        }
    }
]