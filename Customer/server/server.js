import express, { request, response } from "express"
import mongoose from 'mongoose'
import cors from 'cors'
import session from "express-session"
import "dotenv/config"
import MongoStore from "connect-mongo"
import {Backend,Signup,Login,Logout, handlenquiry} from "./Routes/HTTP_Handlers.js"
import {FetchData,FetchDataProfile} from "./Routes/HTTP_Handlers.js"
import { checkSession, FetchLikedProduct, addLikeProduct , likeDelete} from "./Routes/LikeSession_handler.js"


const PORT = 5053
mongoose.connect("mongodb://localhost:27017/Project")
    .then(()=>{ console.log("Mongodb connected successfully")})
    .catch((error)=> console.log("MongoDB connection failed:", error.message))
    
const app=express()   //creates your Express application and stores it in the variable app
app.use(express.json()) // creates middleware that parses incoming JSON request bodies.
app.use(cors({// /allows requests from different origins
    origin: "http://localhost:5052",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))  

app.use(session({  // middleware
    name: "customer.sid",
  secret: process.env.SESSION,  // Signs the session cookie
  resave: false,       //Avoids saving the session again when it hasn't changed
  saveUninitialized: false,    //Avoids saving new sessions before they have been modified.
    store: MongoStore.create({ // store: Where the server saves session data.
    client: mongoose.connection.getClient()
  }),

  cookie: {  // cookie: How the browser stores and sends the session identifier.
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24
  }
}))


// dummy
app.get('/',Backend)  // aconsole the back that backend is running


// SIGNIN request
app.post('/signup',Signup)

// LOGIN request
app.post('/login',Login)
   
// logout Request
app.post("/api/auth/logout",Logout)

//Fetches all products from MongoDB and sends them to your React frontend.
app.get('/api/products', FetchData)

// show user info in profile 
app.get("/api/auth/profile", FetchDataProfile);

// session verification endpoint
app.get("/api/auth/me", checkSession);

// get all liked products
app.get("/api/likes", FetchLikedProduct );

// like product 
app.post("/api/likes/:productId", addLikeProduct)

// unlike product
app.delete("/api/likes/:productId", likeDelete)

app.post("/api/enquiry", handlenquiry)  // handles the enquiry form submission  

app.listen(PORT,()=>{
    console.log(`server is listening on PORT ${PORT}`);
    
})
