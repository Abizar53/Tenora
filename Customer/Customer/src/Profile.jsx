import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";

function Profile() {
    const navigate = useNavigate();

    const [customer, setCustomer] = useState({});
    const [loading, setLoading] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);
    const [error, setError] = useState("");

    // Fetch customer details from MongoDB through the backend
    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await axios.get(
                    "http://localhost:5053/api/auth/profile",
                    {
                        withCredentials: true
                    }
                );

                setCustomer(response.data);  // saving the retrieved customer data to the state variable 'customer'
            } catch (error) {
                console.error("Profile error:", error);

                if (error.response?.status === 401) {
                    navigate("/login", { replace: true });
                } else {
                    setError("Unable to load your profile. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        }

        fetchProfile(); //Calls function to retrieve the user's profile,
    }, [navigate]); //dependency array: React checks whether navigate has changed between renders and reruns the effect if it has.

    // Logout the customer
    async function handleLogout() {
        if (loggingOut) return;

        setLoggingOut(true);

        try {
            await axios.post(
                "http://localhost:5053/api/auth/logout",
                {},
                {
                    withCredentials: true
                }
            );
            // delete info from browser storage to ensure the user is logged out
            localStorage.removeItem("customer");
            localStorage.removeItem("user");
            sessionStorage.removeItem("customer");
            sessionStorage.removeItem("user");

            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Logout error:", error);
            alert("Logout failed. Please check your connection and try again.");
        } finally {
            setLoggingOut(false);
        }
    }

    if (loading) {
        return <div className="profile-page">Loading profile...</div>;
    }

    return (
        <div className="profile-page">
            <header className="profile-header">
                <h1>My Profile</h1>

                <button
                    className="back-button"
                    onClick={() => navigate("/home")}
                >
                    ← Back to Home
                </button>
            </header>

            <div className="profile-card">
                <div className="profile-avatar">
                    {"👤"}
                </div>

                <h2>{customer.name || "Customer"}</h2>   {/* state variable 'customer' which is set from the API response*/}

                {error && <p className="profile-error">{error}</p>}

                <div className="customer-info">
                    <div>
                        <span>Full Name</span>
                        <p>{customer.name || "Not provided"}</p>
                    </div>

                    <div>
                        <span>Username</span>
                        <p>{customer.username || "Not provided"}</p>
                    </div>

                    <div>
                        <span>Email Address</span>
                        <p>{customer.email || "Not provided"}</p>
                    </div>
                </div>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                >
                    {loggingOut ? "Logging out..." : "Logout"}
                </button>
            </div>
        </div>
    );
}

export default Profile;
