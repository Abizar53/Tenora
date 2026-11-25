import { NavLink, useNavigate } from "react-router-dom";
import "../CSS/sidebar.css"
import logout from "../../utils/logout";
import { useState } from "react";
function Sidebar(){
    const navigate= useNavigate()
    const [collapsed, setCollapsed ]= useState(false)

    // main nav items list
    const mainMenu=[
     { name: "Dashboard", path: "/dashboard", icon: "⌂" },
        { name: "Orders",  icon: "▤" },
        { name: "View Products", path: "/view-products", icon: "✎" },
        { name: "Statistics",  icon: "▥" },
        { name: "Enquiries", path: "/enquiries", icon: "✎" },
    ]

    // general Nav items
    const generalMenu = [
        { name: "Notifications", icon: "♧" },
        { name: "Help & Support",  icon: "?" },
        { name: "Settings",  icon: "⚙" }
    ]

    // Reusable navigation menu
function renderMenu(menu) {
        return menu.map((item) => (
            <div key={item.name}>
                {item.path ? (
                    <NavLink
                        to={item.path}
                        title={collapsed ? item.name : ""}
                        className={({ isActive }) =>
                            isActive
                                ? "sidebar-link active"
                                : "sidebar-link"
                        }
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span>{item.name}</span>
                    </NavLink>
                ) : (
                    <button
                        type="button"
                        className="sidebar-link sidebar-disabled"
                        disabled
                        title={`${item.name} page is not available yet`}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span>{item.name}</span>
                    </button>
                )}
            </div>
        ));
    }



 return (
        <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

            {/* Logo and collapse button */}
            <div className="sidebar-logo">
                <h2>
                    <span className="logo-full">
                        Tenora<span>.</span>
                    </span>
                    <span className="logo-short">T</span>
                </h2>

                <button
                    className="sidebar-toggle"
                    onClick={() => setCollapsed(!collapsed)}
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? "→" : "←"}
                </button>
            </div>

            {/* Main Menu */}
            <div className="sidebar-section">
                
                <nav className="sidebar-nav">
                    {renderMenu(mainMenu)}
                </nav>
            </div>

            <div className="sidebar-divider"></div>

            {/* General Menu */}
            <div className="sidebar-section">
               
                <nav className="sidebar-nav">
                    {renderMenu(generalMenu)}
                </nav>
            </div>

            {/* Logout */}
            <div className="sidebar-logout">
                <button
                    type="button"
                    className="sidebar-link logout-link"
                    onClick={() => logout(navigate)}
                    title={collapsed ? "Logout" : ""}
                >
                    <span className="sidebar-icon">↪</span>
                    <span>Logout</span>
                </button>
            </div>

        </aside>
    );
}

export default Sidebar