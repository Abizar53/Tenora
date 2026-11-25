import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom"  //lets you navigate between pages programmatically.
import "../CSS_files/TenantDashboard.css"
import ChatLayout from "./ChatBot/ChatLayout";

function TenantDashboard(){
    const navigate=useNavigate() 
    const [products, setProducts] = useState([]);    //products received from the backend
    const [loading, setLoading] = useState(true);   // whether the API request is still running
    const [productError, setProductError] = useState("");  //any error while fetching products.

    // enquiry
    const [enquiries, setEnquiries] = useState([]);
    const [enquiryLoading, setEnquiryLoading] = useState(true);
    const [enquiryError, setEnquiryError] = useState("");
    useEffect(() => {

    async function fetchProducts() {
        try {
            const token = sessionStorage.getItem("token");

            const response = await fetch(
                "https://tenora-7c00.onrender.com/api/products",
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setProductError(data.message || "Unable to fetch products");
                return;
            }

            if (!Array.isArray(data)) {
                setProductError("Invalid product data received");
                return;
            }

            setProducts(data);

        } catch (error) {
            console.error("Error fetching products:", error);
            setProductError("Unable to connect to the server.");
        } finally {
            setLoading(false);
        }
    }

    fetchProducts();

}, []);


    useEffect(() => {
    async function fetchEnquiries() {
        try {
            const token = sessionStorage.getItem("token");

            const response = await fetch(
                "https://tenora-7c00.onrender.com/api/enquiries",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setEnquiryError(data.message || "Unable to fetch enquiries");
                return;
            }

            if (!Array.isArray(data)) {
                setEnquiryError("Invalid enquiry data received");
                return;
            }

            setEnquiries(data);

        } catch (error) {
            console.error("Error fetching enquiries:", error);
            setEnquiryError("Unable to connect to the server.");
        } finally {
            setEnquiryLoading(false);
        }
    }

    fetchEnquiries();
}, []);

    // enquiry calculation
    const totalEnquiries = enquiries.length;

    const newEnquiries = enquiries.filter(
        enquiry => enquiry.status === "New"
    ).length;

    const contactedEnquiries = enquiries.filter(
        enquiry => enquiry.status === "Contacted"
    ).length;

    const inProgressEnquiries = enquiries.filter(
        enquiry => enquiry.status === "In-Progress"
    ).length;

    const pendingEnquiries = enquiries.filter(
        enquiry => enquiry.status === "Pending"
    ).length;

    const resolvedEnquiries = enquiries.filter(
        enquiry => enquiry.status === "Resolved"
    ).length;

    const totalProducts = products.length;



    const activeProducts = products.filter(
        (product) => product.isAvailable === true
    ).length;


    
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

            {/* Store Overview */}
            <section className="dashboard-section">

                <div className="section-heading">
                    <h2>Store Overview</h2>
                    <p>A quick look at your store's performance.</p>
                </div>

                <div className="overview-grid">

                 {/* Total Products */}
                <div className="overview-card stat-products">
                    <div className="stat-card-heading">
                        <p>Total Products</p>
                        <span className="stat-icon">▦</span>
                    </div>

                    <h3>
                        {loading ? "..." : productError ? "—" : totalProducts}
                    </h3>

                    <span>Products in your store</span>
                </div>

                {/* Active Products */}
                <div className="overview-card stat-active">
                    <div className="stat-card-heading">
                        <p className="active-status-label">
                            <span className="live-dot"></span>
                            Active Products
                        </p>
                        <span className="stat-icon">✓</span>
                    </div>

                    <h3>
                        {loading ? "..." : productError ? "—" : activeProducts}
                    </h3>

                    <span>Currently available products</span>
                </div>
                </div>
                </section>

                {/* Enquiry Overview */}
                
                <section className="dashboard-section">
                                        
                    <div className="section-heading">
                        <h2>Enquiry Overview</h2>
                        <p>Track and manage your customer enquiries.</p>
                    </div>
                    

                    <div className="overview-grid">

                        <div className="overview-card stat-total">
                            <div className="stat-card-heading">
                                <p>Total Enquiries</p>
                                <span className="stat-icon">✉</span>
                            </div>
                            <h3>{enquiryLoading ? "..." : enquiryError ? "—" : totalEnquiries}</h3>
                        </div>

                        <div className="overview-card stat-new">
                            <div className="stat-card-heading">
                                <p>New</p>
                                <span className="stat-icon">+</span>
                            </div>
                            <h3>{enquiryLoading ? "..." : enquiryError ? "—" : newEnquiries}</h3>
                        </div>

                        <div className="overview-card stat-pending">
                            <div className="stat-card-heading">
                                <p>Pending</p>
                                <span className="stat-icon">◷</span>
                            </div>
                            <h3>{enquiryLoading ? "..." : enquiryError ? "—" : pendingEnquiries}</h3>
                        </div>

                        <div className="overview-card stat-progress">
                            <div className="stat-card-heading">
                                <p>In Progress</p>
                                <span className="stat-icon">↗</span>
                            </div>
                            <h3>{enquiryLoading ? "..." : enquiryError ? "—" : inProgressEnquiries}</h3>
                        </div>

                        <div className="overview-card stat-contacted">
                            <div className="stat-card-heading">
                                <p>Contacted</p>
                                <span className="stat-icon">↗</span>
                            </div>
                            <h3>{enquiryLoading ? "..." : enquiryError ? "—" : contactedEnquiries}</h3>
                        </div>

                        <div className="overview-card stat-resolved">
                            <div className="stat-card-heading">
                                <p>Resolved</p>
                                <span className="stat-icon">✓</span>
                            </div>
                            <h3>{enquiryLoading ? "..." : enquiryError ? "—" : resolvedEnquiries}</h3>
                        </div>
                    </div>

            </section>
            <div className="enquiry-navigation">
    <button onClick={() => navigate("/enquiries")}>
        View All Enquiries →
    </button>
</div>
           

        </div>

    </ChatLayout>
)
}
export default TenantDashboard;

