import mongoose from "mongoose";

const CustomerSchema= new mongoose.Schema({
    name:String, email:String, password:String,
    likedProducts: {
    type: [String],
    default: []
  }
})

const CustomerModel=mongoose.model("Customer", CustomerSchema,"Customer");

export default CustomerModel;