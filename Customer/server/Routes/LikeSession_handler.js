import CustomerModel from "../Data_models/data.js"
import ProductModel from "../Data_models/products.js"


//session verification endpoint : check whether a customer is logged in and, if they are, return their basic details from MongoDB.
export async function checkSession(request,response){
    try {
        if (!request.session.customerId) {   // checks whether that ID is missing/ 
          return response.status(401).json({
            loggedIn: false
          });
        }
        const customer = await CustomerModel.findById(request.session.customerId).select("_id name email"); // searches db whose id stored in session and retrieves only the customer's (specific fields):ID, name, and email instead of returning every field.
        response.json({ // if everthing is normal sends the value of likedProducts as JSON.
          loggedIn: true,
          customer: {
            id: customer._id.toString(),
            name: customer.name,
            email: customer.email
          }
        });
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
      }
}


export async function FetchLikedProduct(request,response){
 try {
     if (!request.session.customerId) {
       return response.status(401).json({
         message: "Please log in first"
       });
     }
 
     const customer = await CustomerModel.findById(request.session.customerId).select("likedProducts");
 
     if (!customer) {   // prevents from trying to read from a missing documents
       return response.status(401).json({   
         message: "Customer not found"
       });
     }
 
     response.json(customer.likedProducts);   //sends the value of likedProducts as JSON.
   } catch (error) {
     console.error(error);
     response.status(500).json({
       message: "Could not fetch liked products"
     });
   }
 }   


 export async function addLikeProduct (request,response){
    try{
        if(!request.session.customerId){return response.status(401).json({message:"please Login"})}

        const productId=request.params.productId  //req.params contains the values of dynamic URL parameters.
        const product=await ProductModel.findById(productId)// Verify the product exists in your product collection
   
        if (!product) {  // product was not found
              return res.status(404).json({
                message: "Product not found"
              });
        }
        
        await CustomerModel.findByIdAndUpdate(  //finds the customer by MongoDB's _id and updates their record.
            request.session.customerId,{  //identifies which customer's record should be updated.
                 $addToSet: { likedProducts: productId //Add the product to the liked-products  ($addToSet adds the product ID to the likedProducts array only if that value is not already present)
        } } )

        response.json({message:"Product liked", productId}) 
    }catch(error){
        console.error(error);
    response.status(500).json({
      message: "Could not like product"
    }) } }


export async function likeDelete(request, response){
    try {
    if (!request.session.customerId) {
      return response.status(401).json({
        message: "Please log in first"
      });
    }

    const productId = request.params.productId;

    await CustomerModel.findByIdAndUpdate(
      request.session.customerId,
      { $pull: { likedProducts: productId } }
    );

    response.json({
      message: "Product unliked",
      productId
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({
      message: "Could not unlike product"
    });
  }
}




