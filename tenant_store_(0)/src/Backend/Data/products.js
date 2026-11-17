import mongoose from "mongoose"

const productSchema= new mongoose.Schema( {  // tells Node.js application what a product is expected to look like.
     id: String,
    name: String,
    shortDescription: { type: String, default: "No description provided" },
    description: String,
    price: Number,
    currency: {type : String,default: "INR"},
    imageUrl: String,
    category: String,
    tags: {type: [String], default: []},
    stock: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    weightGrams:{ type: Number, default: 0 },
    dimensions: {
      widthMm: { type: Number, default: 0 },
      heightMm: { type: Number, default: 0 },
      depthMm: { type: Number, default: 0 },
    },
    // Store the ID of the tenant who owns this product
    tenantId: {
        type: String,
        required: true
    },
  }, { collection: "Tenant_Product",  strict: true, timestamps: true })  // collection name is Tenant_Product, strict mode is enabled, timestamps are enabled


  const productModel= mongoose.model("Tenant_Products",productSchema, "Tenant_Products")  //model gives your application methods to access the collection you already have

  export default productModel
  