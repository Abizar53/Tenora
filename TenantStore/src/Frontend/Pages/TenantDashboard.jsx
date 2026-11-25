import { useState } from "react";
import {useNavigate} from "react-router-dom"  //lets you navigate between pages programmatically.
import "../CSS_files/TenantDashboard.css"
import ChatLayout from "./ChatBot/ChatLayout";

function TenantDashboard(){
    const navigate=useNavigate() 

   const [tenant] = useState(() => {
    try {
        return JSON.parse(sessionStorage.getItem("tenant"));
    } catch {
        return null;
    }
});
    // check whether the tenant is logged in
     if (!tenant) {
    return (
      <div className="dashboard-login-message">
        <h2>Please log in to access your dashboard.</h2>  {/* If tenant is null, the dashboard displays a message and a login button.*/}
        <button onClick={() => navigate("/login")}>    {/* If tenant exists, the component continues to render the dashboard  */}
          Go to Login
        </button>
      </div>
    );
    } 

       return (
    // UI Interface
         <ChatLayout context={{ page: "Dashboard" }}>

            <div className="dashboard-page">

                {/* Welcome Section */}
                <section className="dashboard-welcome">

                    <div>
                        <p className="dashboard-label">
                            STORE OVERVIEW
                        </p>

                        <h1>
                            Welcome back, {tenant.storeName}!
                        </h1>

                        <p>
                            Here's what's happening with your store today.
                        </p>
                    </div>

                    <button
                        className="add-product-button"
                        onClick={() => navigate("/add-product")}
                    >
                        + Add Product
                    </button>

                </section>

                {/* Quick Actions */}
                <section className="dashboard-section">

                    <div className="section-heading">
                        <h2>Quick Actions</h2>
                        <p>Manage your store from one place.</p>
                    </div>

                    <div className="quick-actions-grid">

                        {/* Products */}
                        <div className="quick-action-card">

                            <div className="action-icon">
                                📦
                            </div>

                            <h3>Products</h3>

                            <p>
                                Add new products or manage your existing
                                store inventory.
                            </p>

                            <button
                                onClick={() => navigate("/view-products")}
                            >
                                View Products →
                            </button>

                        </div>

                        {/* Enquiries */}
                        <div className="quick-action-card">

                            <div className="action-icon">
                                ✉️
                            </div>

                            <h3>Customer Enquiries</h3>

                            <p>
                                View and respond to messages received
                                from your customers.
                            </p>

                            <button
                                onClick={() => navigate("/enquiries")}
                            >
                                View Enquiries →
                            </button>

                        </div>

                        {/* Store Settings */}
                        <div className="quick-action-card">

                            <div className="action-icon">
                                ⚙️
                            </div>

                            <h3>Store Settings</h3>

                            <p>
                                Manage your store information and
                                preferences.
                            </p>

                            <button disabled>
                                Coming Soon
                            </button>

                        </div>

                    </div>

                </section>

            </div>

        </ChatLayout>
    );

    }
export default TenantDashboard;











