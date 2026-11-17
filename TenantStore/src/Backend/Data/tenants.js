import mongoose from "mongoose"

const tenantSchema= new mongoose.Schema( {  // tells Node.js application what a tenant is expected to look like.
    name: {
        type :String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: Date,
    updatedAt: Date,
  }, { collection: "Tenant",  strict: true, })

  const tenantModel= mongoose.model("Tenants", tenantSchema, "Tenants")  
  export default tenantModel