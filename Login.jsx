import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [email, setEmail]=useState("")
    const [password, setPassord]=useState("")
    const navigate=useNavigate()

    const handleSubmit =(e)=>{
      e.preventDefault()
      axios.post("http://localhost:5053/login",{email,password}, { withCredentials: true }) // first arguement is url and second is data, third :allows the browser to send and receive the session cookie for your cross-origin frontend and backend.
      .then(result=>{
        console.log(result)
        console.log(result.data)
        if (result.data === "Success") {
            navigate("/home");
            }}) 
      .catch(err => console.log(err))
    }

  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center">
      <div className="card shadow border-0 rounded-4 p-4" style={{ maxWidth: "420px", width: "100%" }}>

        <div className="card-body">
          <h2 className="text-center fw-bold mb-2">
            Welcome Back! To Tenora
          </h2>

          <p className="text-center text-secondary mb-4">
            Login to your account
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>

              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your email"
                autoComplete="email"
                required
                onChange={(e)=> setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>

              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                onChange={(e)=> setPassord(e.target.value)}
              />
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  id="remember"
                  className="form-check-input"
                />

                <label htmlFor="remember" className="form-check-label">
                  Remember me
                </label>
              </div>

              <a href="/forgot-password" className="text-decoration-none">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button type="submit" className="btn btn-primary w-100 py-2">
              Login
            </button>
          </form>

          <p className="text-center mt-4 mb-0">
            Don't have an account?{" "}
            <Link to="/signup" className="btn btn-primary">
                Sign Up
                </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;

