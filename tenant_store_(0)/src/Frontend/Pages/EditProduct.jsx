import {useState} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
 import "../CSS_files/EditProduct.css";
import logout from "../utills/logout";


 function EditProduct() {
    const location = useLocation(); // Access the location object to retrieve the state passed from the previous page
    const navigate = useNavigate();
    const { id } = useParams(); // Get the product ID from the URL parameters
    const [message, setMessage] = useState(""); // State to hold any messages (success or error)
    const [loading, setLoading] = useState(false); // State to indicate loading status
    const existingProduct = location.state?.product; // Access the existing product details passed from the previous page ie: :get the selected product from view details
    const [updatedFields, setUpdatedFields] = useState({});


    const [product, setProduct] = useState(() => ({
        name: existingProduct?.name || "",
        shortDescription: existingProduct?.shortDescription || "",
        category: existingProduct?.category || "",
        description: existingProduct?.description || "",
        price: existingProduct?.price ?? "",
        currency: existingProduct?.currency || "INR",
        stock: existingProduct?.stock ?? "",
        imageUrl: existingProduct?.imageUrl || "",
        tags: Array.isArray(existingProduct?.tags)
            ? existingProduct.tags.join(", ")
            : existingProduct?.tags || "",
        isAvailable: existingProduct?.isAvailable ?? true,
        weightGrams: existingProduct?.weightGrams ?? "",
        dimensions: {
            widthMm: existingProduct?.dimensions?.widthMm ?? "",
            heightMm: existingProduct?.dimensions?.heightMm ?? "",
            depthMm: existingProduct?.dimensions?.depthMm ?? ""
        }
    }))


// Handle normal input changes
 function handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        // update the form
        setProduct((previousProduct) => ({
            ...previousProduct,
            [name]: value
        }));
        // convert the tags string into an array 
        const updatedValue= name === "tags"? value.split(",") : value // ternary operator,if tag field is there convert it to array, otherwise save the value variable ...... 
        //  JavaScript's split() method creates and returns a new array. 

        // track only updated fields
        setUpdatedFields((prevFields) => ({
            ...prevFields,
            [name]: updatedValue
        }));
    }

// handle dimension changes separately
function handleDimensionChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setProduct((previousProduct)=>({
        ...previousProduct,
        dimensions:{...previousProduct.dimensions, [name]:value}
    }))

       setUpdatedFields((previousFields) => ({
        ...previousFields,
        [`dimensions.${name}`]: value
    }));
}

// submit updated product / send request to backend to upate the database
async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setMessage("") // clear previous messages

    try{
    const token  = sessionStorage.getItem("token");
    if (!token) {
    setMessage("Please login again.");
    return;
}
console.log("Product:", product);
console.log("Updated fields:", updatedFields);
console.log("Updated fields keys:", Object.keys(updatedFields));
    const response = await fetch(`http://localhost:4052/api/products/${id}`, {
        method: 'PATCH', headers: {
        "Content-Type": "application/json",
        "Authorization":`Bearer ${token}` }, 
        body: JSON.stringify(updatedFields)
    })

    const data=await response.json()
    console.log("Backend response:", data);
    if (!response.ok) {
          if (response.status === 401) {
            logout(navigate);
            return;
    }
       if (data.message === "No valid fields provided.") {
    setMessage("Please update at least one field before saving.");
} else {
    setMessage(data.message || "Failed to update product.");
}
    } else {
        setMessage("Product updated successfully!");
        // Navigate back to the products page after a short delay
        setTimeout(() => {
            navigate("/view-products");
        }, 1000);
    }

    } catch (error) {
        console.error("Error updating product:", error);
        setMessage("An error occurred while updating the product.");
    } finally {
        setLoading(false);
    }
}


    // if product data was not passed onto form
    if(!existingProduct){
        return(
            <div className="edit-product-page">
                <h2>Product details not found</h2>
                <button onClick={() => navigate(-1)}>Back to Products</button>
            </div>
        )
    }

return (
    <>   
          <div className="edit-product-page">

            <header className="edit-header">
                <div>
                    <h1>Tenora</h1>
                    <p>Product Management</p>
                </div>
                <button className= "edit-back-button" onClick={() => navigate(-1)}>Back to Products</button>
            </header>

             <main className="edit-product-container">

                <div className="edit-title">
                    <h2>Edit Product</h2>
                    <p>Update your product information below.</p>
                </div>

                <form className="edit-product-form" onSubmit={handleSubmit}>
               
                     {/* BASIC INFORMATION */}
                    <section className="form-section">

                        <h3>Basic Information</h3>

                         <div className="form-grid">

                            <div className="form-group full-width">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={product.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                             <div className="form-group">
                                <label>Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={product.category}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Short Description</label>
                                <input
                                    type="text"
                                    name="shortDescription"
                                    value={product.shortDescription}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group full-width">
                                <label>Full Description</label>
                                <textarea
                                    name="description"
                                    value={product.description}
                                    onChange={handleChange}
                                    rows="4"
                                    required
                                />
                            </div>

                        </div>
                    </section>


                    {/* PRICING AND INVENTORY */}
                    <section className="form-section">

                        <h3>02 — Pricing & Inventory</h3>

                        <div className="form-grid">

                            <div className="form-group">
                                <label>Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={product.price}
                                    onChange={handleChange}
                                    min="0.01"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Currency</label>
                                <select
                                    name="currency"
                                    value={product.currency}
                                    onChange={handleChange}
                                >
                                    <option value="INR">INR</option>
                                    <option value="USD">USD</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Stock Quantity</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={product.stock}
                                    onChange={handleChange}
                                    min="0"
                                    step="1"
                                    required
                                />
                            </div>

                            <div className="form-group availability-group">
                                <label>Product Availability</label>

                                <label className="availability-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={product.isAvailable}
                                        onChange={(event) =>
                                            setProduct((previousProduct) => ({
                                                ...previousProduct,
                                                isAvailable: event.target.checked
                                            }))
                                        }
                                    />
                                    Available for customers
                                </label>
                            </div>

                        </div>
                    </section>


                    {/* ADDITIONAL DETAILS */}
                    <section className="form-section">

                        <h3>03 — Additional Details</h3>

                        <div className="form-grid">

                            <div className="form-group full-width">
                                <label>Product Tags</label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={product.tags}
                                    onChange={handleChange}
                                    placeholder="Electronics, Wireless, Audio"
                                />
                                <small>Separate tags using commas.</small>
                            </div>

                            <div className="form-group">
                                <label>Weight (grams)</label>
                                <input
                                    type="number"
                                    name="weightGrams"
                                    value={product.weightGrams}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>

                            <div className="form-group">
                                <label>Width (mm)</label>
                                <input
                                    type="number"
                                    name="widthMm"
                                    value={product.dimensions.widthMm}
                                    onChange={handleDimensionChange}
                                    min="0"
                                />
                            </div>

                            <div className="form-group">
                                <label>Height (mm)</label>
                                <input
                                    type="number"
                                    name="heightMm"
                                    value={product.dimensions.heightMm}
                                    onChange={handleDimensionChange}
                                    min="0"
                                />
                            </div>

                            <div className="form-group">
                                <label>Depth (mm)</label>
                                <input
                                    type="number"
                                    name="depthMm"
                                    value={product.dimensions.depthMm}
                                    onChange={handleDimensionChange}
                                    min="0"
                                />
                            </div>

                        </div>
                    </section>


                    {/* PRODUCT IMAGE */}
                    <section className="form-section">

                        <h3>04 — Product Image</h3>

                        <div className="form-group">
                            <label>Image URL</label>
                            <input
                                type="url"
                                name="imageUrl"
                                value={product.imageUrl}
                                onChange={handleChange}
                                placeholder="Enter product image URL"
                            />
                        </div>

                        {product.imageUrl && (
                            <div className="edit-image-preview">
                                <img
                                    src={product.imageUrl}
                                    alt="Product preview"
                                />
                            </div>
                        )}

                    </section>
                          <div className="edit-form-actions">

                        <button
                            type="button"
                            className="edit-cancel-button"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="edit-save-button"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                        

                    </div>
                     {/* show error  message */} 
                    {message && (
    <div className="form-alert">
        {message}
    </div>
)}

                </form>


 </main>
        </div>
</>

)
}



export default EditProduct
    