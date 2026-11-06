import CustomerModel from "../Data_models/data.js"
import ProductModel from "../Data_models/products.js"
import EnquiryModel from "../Data_models/enquiry.js"


export function Backend(request,response){
    response.send("hey, Backend is running ") // just to check backend is running
}

// Signup
export const Signup=(request,response)=>{
    CustomerModel.create(request.body) //  whatever the data is coming is inside the request.body
    .then((customer) => {
            response.json(customer)
        })
        .catch((error) => { response.json(error)
            });
        };


// Login with mongodb
export async function  Login (request,response){
     const {email,password}=request.body
        const user = await CustomerModel.findOne({email:email})  // if record exist?
        .then((user)=>{
            if(user){
                if (user.password===password){
                    
                    request.session.customerId = user._id.toString();    // When the customer logs in successfully, the server records their ID in the session. The browser receives a session cookie; subsequent requests send that cookie, allowing the server to identify the customer without trusting a customer ID supplied by React.
                    
                    response.json("Success") 
                }
                else{response.json("Incorrect Password")}
            }else {response.json("No Record was found")}
        })
        .catch((error) => { response.json(error)})
    }

// Logout + delete Cookies
export function Logout(request,response){
        request.session.destroy((error)=>{  //destroys the customer's server-side session.
        if (error){
            console.log(error);
            return response.status(500).json({message:"could not logout"})
        }else{
            response.clearCookie("customer.sid",{ //clears the session cookie from the browser.
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: "/"         
          })
                response.json({message:"logged out successfully "})
        }
        });
}

//Fetches all products from MongoDB and sends them to your React frontend.
export function FetchData(request,response){
    ProductModel.find()
    .then((products)=>{response.json(products)}) // if successful then whatever result come from ProductModel.find, give it to products and send it as response 
    .catch((err)=>{console.error("Error fetching products:", err)
            response.status(500).json({
                message: "Failed to fetch products"
            })
        })
}


export async function FetchDataProfile (request, response) {
    try {
        // Check whether the customer is logged in
        if (!request.session.customerId) {
            return response.status(401).json({
                message: "Please log in first"
            });
        }

        // Find the logged-in customer in MongoDB
        const customer = await CustomerModel.findById(
            request.session.customerId
        ).select("name username email");
        // if no data is present
        if (!customer) {
            return response.status(404).json({
                message: "Customer not found"
            });
        }
        // else the data is present so Send customer details to React
        response.json({
            name: customer.name,
            username: customer.username,
            email: customer.email
        });
    } catch (error) {
        console.log(error);
        response.status(500).json({
            message: "Could not fetch profile"
        });
    }
}






export async function handlenquiry(request, response) {
    try{
     // Check whether the customer is logged in
        if (!request.session.customerId) {
            return response.status(401).json({
                message: "Please log in first"
            }) }

    // get Product details from request body
    const {  productId, message } = request.body;

    if (!productId || !message) {
        return response.status(400).json({
            message: "Missing required fields"
        });
    }

    // getting all the other details to feed the enquiry model
    const product = await ProductModel.findById(productId);  // from it we extract all the details of product like :  product._id, product.name, product.tenantId
    const customer = await CustomerModel.findById(request.session.customerId); // t provides customer._id, customer.name, and customer.email.
    if (!product || !customer) {
        return response.status(404).json({
            message: "Product or customer not found"
        });
    }
console.log("Product found:", product);
console.log("Product tenantId:", product.tenantId);

    // saving the enquiry to the database
    const newEnquiry = new EnquiryModel({
        tenantId: product.tenantId,
        customerId: customer._id.toString(),
        productId: product._id.toString(),
        productName: product.name,
        customername: customer.name,
        customerEmail:  customer.email,
        message: message
    });
    await newEnquiry.save();
    response.status(201).json({
        message: "Enquiry submitted successfully",
        enquiry: newEnquiry   // puts that data inside the enquiry property for frontend to read
    });
    }catch(error){
        console.log("Error handling enquiry:", error);
        response.status(500).json({
            message: "Failed to submit enquiry"
        });
    }
}
