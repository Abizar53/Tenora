import { useState } from "react";
import "../CSS_files/TenantLogin.css";
import { useNavigate } from "react-router-dom";


function TenantLogin(){
    const [email, setEmail]=useState("");    // Handles state component 
    const [password, setPassword]=useState(""); // update UI whenever changes occur
    const [message ,setMessage]=useState("") //Displays success or error messages
    const [loading , setLoading]=useState(false)  //Displays success or error messages
    
    const navigate = useNavigate();

    async function handleSubmit (event){     //Handles form submission logic
        event.preventDefault();
        console.log(`Email:${email}`)
        console.log(`Password:${password}`)
        setMessage("")
        setLoading(true)    // indicate request has started 
        try{
            const response =await fetch(     // fetch: http request to server , api.auth/login is login end point defined in both react and node
                "http://localhost:4052/api/auth/login",
                {
                    method:"POST",    
                    headers:{"content-Type":"application/json"},    // tells backend that request body contain JSON Data
                    body:JSON.stringify({email,password})           // data being send to backend 
                }
            )
            const data=await response.json()  // backend send a succesfull response aobject which contain  message,tenant:{id,storename,email}
        
            if (!response.ok){
                setMessage(data.message || "login failed ")
                return
            }else{  // login succedd
                setMessage(`welcome to ${data.ten.storeName}`)
                console.log("logged in tenant:",data.ten)
                // Store the tenant data in session storage for later use
                sessionStorage.setItem("tenant", JSON.stringify(data.ten));
                // Store the token in session storage for later use
                sessionStorage.setItem("token", data.token);
                
                navigate("/dashboard", { replace: true});  // // Redirect to the tenant's dashboard
                
            }

        }catch(error){
            setMessage("cannot connect to the server. Make sure Nodejs is Running")
            console.error("login Error",error)
        }finally{
            setLoading(false)
        }
    }

    // Defining UI : User Interface
    return(
        <div className="Login-page">
            <form className="login-card" onSubmit={handleSubmit} >
                <h1>Tenora</h1>
                <h2>Tenant Login</h2>
                <p>Sign in to manage ur store</p>
                {message && <p>{message}</p>}
                <label htmlFor="email">Email Address </label>
                <input id = "email" type="email" value={email}
                placeholder="Email"
                onChange={(event)=> setEmail(event.target.value)}  />    
                

                <label htmlFor="password">Password</label>
                <input id="password" type="password" value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required/>

                
                <button type ="submit"disabled={loading}>
                    {loading?"signing in..":"sign in"} </button>
            </form>
        
        </div>
    )




}

export default TenantLogin