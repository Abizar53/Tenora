import EnquiryModel from "../Data/enquiry.js"
import {verifyToken} from "../middleware/jwt.js"
import mongoose from "mongoose";

export async function fetchEnquiries(request, response) {
    try{
        // veriy the logged tenat using JWT token
        const isTokenValid= verifyToken(request, response)
        if (!isTokenValid) {
            return false; 
         }
         //get tenant id from verified JWT token
         const tenantId= request.tenant.id

        console.log("Tenant MongoDB connection:", mongoose.connection.readyState);
        console.log("Enquiry Model connection:", EnquiryModel.db.readyState);
         // find enqueries belonging to this specific tenant 
         const enquiries = await EnquiryModel.find({tenantId: tenantId})
         response.writeHead(200,{"Content-Type":"application/json"})
         response.end(JSON.stringify(enquiries))

         
    }catch(error){
        console.error("Error reading enquiries:",error)
        response.writeHead(500,{"Content-Type":"application/json"})
        response.end(JSON.stringify({message:"unable to fetch enquiries"}))
        
    }

}


export async function updateEnquiryStatus(request, response) {
    try{
        const isTokenValid= verifyToken(request, response)
        if (!isTokenValid) {
            return false; 
         }
         //get tenant id from verified JWT token
         const tenantId= request.tenant.id
        const enquiryId = request.url.split("/")[3] // Extract the enquiry ID from the URL on third position after splitting by "/"
         // Get new status from frontend
        // Read request body manually
        let body = "";

        request.on("data", (chunk) => {
            body += chunk;
        });

        request.on("end", async () => {
            try {
                const { status } = JSON.parse(body);

        const allowedStatus = ["Pending", "In-Progress","Contacted", "Resolved"]

        if(!allowedStatus.includes(status)){
            response.writeHead(400,{"Content-Type":"application/json"})
            return response.end(JSON.stringify({message: "Invalid enquiry status value"}))
        }
        // find and update only this tenant enquiry status
        const updatedEnquiry = await EnquiryModel.findOneAndUpdate(
            { _id: enquiryId, tenantId: request.tenant.id },   // does this enquiry belong to this tenant? if yes, update the status
            {$set: {status: status}},       //update the status field with the new value
            {new: true, runValidators: true}  //true tells Mongoose to return the updated document instead of the old one,  check the updated data against the validation rules defined in your Mongoose schema before saving it.
        );

        if (!updatedEnquiry) {
            response.writeHead(404,{"Content-Type":"application/json"})
            return response.end(JSON.stringify({message: "Enquiry not found or you do not have permission to update it"}))
        }
        response.writeHead(200,{"Content-Type":"application/json"})
     return response.end(JSON.stringify({ message: "Enquiry status updated successfully", enquiry: updatedEnquiry }));  //ending the updated enquiry data back to the frontend.

    } catch (error) {
                console.log("Error processing enquiry:", error);

                response.writeHead(500, {
                    "Content-Type": "application/json"
                });

                response.end(JSON.stringify({
                    message: "Unable to update enquiry status"
                }));
            }
        });

    } catch (error) {
        console.log("Error updating enquiry:", error);

        response.writeHead(500, {
            "Content-Type": "application/json"
        });

        response.end(JSON.stringify({
            message: "Unable to update enquiry status"
        }));
    }
}