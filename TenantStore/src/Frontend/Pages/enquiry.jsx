import {useEffect, useState} from "react"
import "../CSS_files/enquiry.css"


function EnquiryPage(){
    const [enquiries, setEnquiries]=useState([])
    const [loading, setLoading]=useState(true)
    const [message, setMessage] = useState()
    const [newStatus, setNewStatus] = useState("");
    const [updating, setUpdating] = useState(false);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);  //    // store the enquiry selected by the tenant
   
    const [filterStatus,setFilterStatus]= useState("ALL")  
    //calculate enquiry statistics
  //  const totalEnquiries = enquiries.length;
    //const newEnquiries = enquiries.filter( (enquiry)=> enquiry.status === "New").length  // filter(checks every Enquiry and keeps only enquiries whose status is NEW) and then count the length of the filtered array
    //const ContactedEnquiries = enquiries.filter((enquiry)=> enquiry.status === "Contacted").length
  //  const inProgressEnquiries = enquiries.filter((enquiry)=> enquiry.status === "In-Progress").length
    //const pendingEnquiries = enquiries.filter((enquiry)=> enquiry.status === "Pending").length
//    const resolvedEnquiries = enquiries.filter((enquiry)=> enquiry.status === "Resolved").length
 
    useEffect(()=>{
    // fetch all enquires from backend 
    async function fetchEnquiries(){
        try{
            const token = sessionStorage.getItem("token")

            const response= await fetch("https://tenora-7c00.onrender.com/api/enquiries",
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` }
                })

            const data= await response.json()
            if (!response.ok) {
                    setmessage(data.message || "Unable to fetch enquiry");
                    return;
                }

            setEnquiries(Array.isArray(data) ? data : []);

     }catch(error){
                console.error("Error fetching ENQUIRY:", error);
                setMessage("Unable to connect to server");                
            } finally {
                setLoading(false);
            }
        }
        
        fetchEnquiries();
    },[]
    )

     // Filter enquiries based on selected status
    const filteredEnquiries = filterStatus === "All"
            ? enquiries
            : enquiries.filter(
                (enquiry) => enquiry.status === filterStatus
            );


   // if (loading) {
     //   return <h2>Loading enquiries...</h2>    }


    async function updateStatus(){
         if (!selectedEnquiry || !newStatus) return;
        try{
            setUpdating(true);
            setMessage("")
            const token = sessionStorage.getItem("token");
            const response = await fetch(`https://tenora-7c00.onrender.com/api/enquiries/${selectedEnquiry._id}/status`, {
                method: "PATCH",
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
                
            const data= await response.json();
            if (!response.ok) {
                setMessage(data.message || "Unable to update enquiry status");
                return;
            }

            // update the enquiry list in existing list 
            setEnquiries((prevEnquiries) =>
                prevEnquiries.map((enquiry) =>
                    enquiry._id === selectedEnquiry._id ?data.enquiry: enquiry))
            // Update the currently opened popup
        setSelectedEnquiry(data.enquiry);

        setMessage("Enquiry status updated successfully");

    } catch (error) {
        console.error("Error updating status:", error);
        setMessage("Unable to connect to server");

    } finally {
        setUpdating(false);
    }
        
    }   
     if (loading) {
        return <h2>Loading enquiries...</h2>;
    }

return (
     <div className="enquiries-page">

            {/* Page heading */}
            <div className="enquiries-header">
                <h1>Customer Enquiries</h1>
                <p>Manage and respond to your customer enquiries.</p>
            </div>

            {/* Success and error messages */}
            {message && (
                <p className="enquiry-message">
                    {message}
                </p>
            )}

            {/* All Enquiries */}
            <section className="all-enquiries-section">

                <div className="all-enquiries-header">
                    <div>
                        <h2>All Enquiries</h2>
                        <p>
                            {filteredEnquiries.length} enquiries found
                        </p>
                    </div>

                    {/* Status filter */}
                    <div className="enquiry-filter">
                        <label htmlFor="statusFilter">
                            Filter by status:
                        </label>

                        <select
                            id="statusFilter"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            <option value="New">New</option>
                            <option value="Pending">Pending</option>
                            <option value="In-Progress">In Progress</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                    </div>
                </div>

                {/* Enquiries table */}
                <div className="enquiry-table-container">

                    <table className="enquiry-table">

                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Customer</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>

                        <tbody>

                            {filteredEnquiries.length > 0 ? (

                                filteredEnquiries.map((enquiry) => (

                                    <tr
                                        key={enquiry._id}
                                        onClick={() => {
                                            setSelectedEnquiry(enquiry);
                                            setNewStatus(enquiry.status);
                                            setMessage("");
                                        }}
                                    >
                                        <td>{enquiry.productName}</td>

                                        <td>{enquiry.customerName}</td>

                                        <td>{enquiry.customerEmail}</td>

                                        <td>
                                            <span
                                                className={`status-badge status-${enquiry.status
                                                    .toLowerCase()
                                                    .replaceAll("-", "")}`}
                                            >
                                                {enquiry.status}
                                            </span>
                                        </td>

                                        <td>
                                            {enquiry.createdAt
                                                ? new Date(enquiry.createdAt).toLocaleDateString()
                                                : "N/A"}
                                        </td>
                                    </tr>

                                ))

                            ) : (

                                <tr>
                                    <td colSpan="5" className="no-enquiries">
                                        No {filterStatus === "All" ? "" : filterStatus + " "}
                                        enquiries found.
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </section>


            {/* Enquiry Details Modal */}
            {selectedEnquiry && (

                <div
                    className="enquiry-overlay"
                    onClick={() => setSelectedEnquiry(null)}
                >

                    <div
                        className="enquiry-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="modal-header">
                            <h2>Enquiry Details</h2>

                            <button
                                className="modal-close"
                                onClick={() => setSelectedEnquiry(null)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="enquiry-details">

                            <p>
                                <strong>Product:</strong>{" "}
                                {selectedEnquiry.productName}
                            </p>

                            <p>
                                <strong>Customer:</strong>{" "}
                                {selectedEnquiry.customerName}
                            </p>

                            <p>
                                <strong>Email:</strong>{" "}
                                {selectedEnquiry.customerEmail}
                            </p>

                            <p>
                                <strong>Message:</strong>
                            </p>

                            <div className="enquiry-customer-message">
                                {selectedEnquiry.message}
                            </div>

                            <p>
                                <strong>Current Status:</strong>{" "}
                                {selectedEnquiry.status}
                            </p>

                            <p>
                                <strong>Date:</strong>{" "}
                                {selectedEnquiry.createdAt
                                    ? new Date(selectedEnquiry.createdAt).toLocaleDateString()
                                    : "N/A"}
                            </p>

                        </div>

                        {/* Update status */}
                        <div className="update-enquiry-status">

                            <label htmlFor="newStatus">
                                Update Status
                            </label>

                            <select
                                id="newStatus"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                            >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="In-Progress">In Progress</option>
                                <option value="Pending">Pending</option>
                                <option value="Resolved">Resolved</option>
                            </select>

                            <button
                                onClick={updateStatus}
                                disabled={
                                    updating ||
                                    newStatus === selectedEnquiry.status
                                }
                            >
                                {updating ? "Updating..." : "Update Status"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default EnquiryPage