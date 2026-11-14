import { useState } from "react";
import {useNavigate} from "react-router-dom"  //lets you navigate between pages programmatically.
import "../CSS_files/TenantDashboard.css"
import logout from "../utills/logout";

function TenantDashboard(){
    const navigate=useNavigate() 

   const [tenant, setTenant] = useState(() => {
    try {
        return JSON.parse(sessionStorage.getItem("tenant"));
    } catch {
        return null;
    }
});

     if (!tenant) {
    return (
      <div className="dashboard-page">
        <p>Please log in to access your dashboard.</p>  {/* If tenant is null, the dashboard displays a message and a login button.*/}
        <button onClick={() => navigate("/login")}>    {/* If tenant exists, the component continues to render the dashboard  */}
          Go to Login
        </button>
      </div>
    );
    } 

    function HandleLogout(){
       setTenant(null)
       logout(navigate)
    }

      return (  // UI Interface
  
    <div className="dashboard-page">

        <header className="dashboard-header">
            <h1>Tenora</h1>
            <button onClick={HandleLogout}>Logout</button>
        </header>

        <main className="dashboard-content">

            <p className="dashboard-label">TENANT DASHBOARD</p>

            <h2>Welcome, {tenant.storeName}</h2>

            <p className="dashboard-description">
                Manage your online store from one place.
            </p>

            <div className="dashboard-grid">

                {/* Products Card */}
                <div className="dashboard-card">
                    <div className="card-icon">📦</div>

                    <h3>Products</h3>
                    <p>Manage your store products.</p>

                    <div className="card-buttons">
                        <button onClick={() => navigate("/add-product")}>
                            Add Product
                        </button>

                        <button onClick={() => navigate("/view-products")}>
                            View Products
                        </button>
                    </div>
                </div>

                {/* Customer Enquiries Card */}
                <div className="dashboard-card">
                    <div className="card-icon">✉️</div>

                    <h3>Customer Enquiries</h3>
                    <p>
                        View messages and enquiries received from customers.
                    </p>

                    <div className="card-buttons">
                        <button onClick={() => navigate("/enquiries")}>
                            View Enquiries
                        </button>
                    </div>
                </div>

                {/* Store Settings Card */}
                <div className="dashboard-card">
                    <div className="card-icon">⚙️</div>

                    <h3>Store Settings</h3>
                    <p>Manage your store information.</p>

                    <div className="card-buttons">
                        <button disabled>Coming Soon</button>
                    </div>
                </div>

            </div>
        </main>
    </div>
);

    }
export default TenantDashboard;











