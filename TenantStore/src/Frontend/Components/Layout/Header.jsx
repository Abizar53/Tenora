
import { useState } from "react";
import "../CSS/Header.css";
import { useLocation } from "react-router-dom";

function Header() {
    // get current url
    const location = useLocation()
    // Get tenant information from sessionStorage
    const [tenant] = useState(() => {
        try {
            return JSON.parse(sessionStorage.getItem("tenant"));
        } catch {
            return null;
        }
    })

     const pageTitles = {
        "/dashboard": {
            title: "Dashboard",
            description: "Manage and monitor your store."
        },

        "/orders": {
            title: "Orders",
            description: "Manage your customer orders."
        },

        "/reports": {
            title: "Reports",
            description: "View your store reports."
        },

        "/statistics": {
            title: "Statistics",
            description: "Monitor your store performance."
        },

        "/add-product": {
            title: "Add Product",
            description: "Add a new product to your store."
        },

        "/products": {
            title: "Products",
            description: "Manage your store products."
        },

        "/view-products": {
            title: "View Products",
            description: "Browse your store products."
        },

        "/enquiries": {
            title: "Customer Enquiries",
            description: "Manage messages received from customers."
        },

        "/settings": {
            title: "Settings",
            description: "Manage your store preferences."
        }
    };

    // Find current page information
    const currentPage = pageTitles[location.pathname] || {
        title: "Tenora",
        description: "Manage your online store."
    }



    return (
        <header className="tenant-header">

            {/* Left section */}
            <div className="header-left">
                <h2>{currentPage.title}</h2>
                <p>{currentPage.title}</p>
            </div>

            {/* Right section */}
            <div className="header-right">

                {/* Search bar */}
                <div className="header-search">
                    <span>⌕</span>
                    <input
                        type="text"
                        placeholder="Search anything..."
                    />
                </div>

                {/* Notification */}
                <button className="notification-button" aria-label="Notifications">
                    ♧
                    <span className="notification-dot"></span>
                </button>

                {/* Tenant profile */}
                <div className="header-profile">

                    <div className="profile-avatar">
                        {tenant?.storeName?.charAt(0).toUpperCase() || "T"}
                    </div>

                    <div className="profile-info">
                        <h4>{tenant?.storeName || "My Store"}</h4>
                        <p>Store Owner</p>
                    </div>

                </div>

            </div>

        </header>
    );
}

export default Header;
