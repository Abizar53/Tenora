import mongoose from "mongoose"
//Writing this schema does not delete or duplicate your existing product data.
const productSchema= new mongoose.Schema( {  // tells Node.js application what a product is expected to look like.
    id: String,
    tenantId: {
    type: String,
    required: true},
    name: String,
    shortDescription: String,
    description: String,
    price: Number,
    currency: String,
    imageUrl: String,
    category: String,
    tags: [String],
    stock: Number,  
    isAvailable: Boolean,
    weightGrams: Number,
    dimensions: {
      widthMm: Number,
      heightMm: Number,
      depthMm: Number,
    },
    createdAt: Date,
    updatedAt: Date,

  }, { timestamps : true ,collection: "Tenant_Product",  strict: true, })

  const ProductModel= mongoose.model("Tenant_Products",productSchema, "Tenant_Products")  //model gives your application methods to access the collection you already have

  export default ProductModel