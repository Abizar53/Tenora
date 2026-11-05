import moongose from "mongoose";

const EnquirySchema= new moongose.Schema({
    tenantId: {
        type: String,
        required: true
    },
    customerId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    customername: {
        type: String,
        required: true
    },
    customerEmail: {
        type: String,
        required: true
    },
     message: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: "New"
    }

}, { timestamps: true });


const EnquiryModel= moongose.model("Enquiry",EnquirySchema, "Enquiry") 

export default EnquiryModel