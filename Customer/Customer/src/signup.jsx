
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


function Signup() {
    const [name, setName]=useState("")
    const [email, setEmail]=useState("")
    const [password, setPassord]=useState("")
    const navigate =useNavigate()
    const handleSubmit = (e)=>{
        e.preventDefault()
        axios.post('http://localhost:5001/Signup',{name,email,password})   // axios.post send the http post request , it takes url an data to send as arguments ,and return a promise 
            .then(result => { console.log("successful " ,result) // result contains the server's response, including result.data.
              navigate('/login') 
            })
              .catch(err=> console.log("Failed", err))
        
    }




  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow border-0 p-4">
            <h2 className="text-center mb-4">
              Create Account
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                  required
                  onChange={(e)=> setName(e.target.value)}
                
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  required
                  onChange={(e)=> setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Create a password"
                  required
                  onChange={(e)=> setPassord(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
              >
                Sign Up
              </button>
            </form>

            <p className="text-center mt-3 mb-0">
              Already registered?{' '}
              <Link to="/login" className="text-decoration-none">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
