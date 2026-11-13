
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS_files/AddProduct.css";

function AddProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    shortDescription: "",
    category: "",
    description: "",
    price: "",
    currency: "INR",
    stock: "",
    imageUrl: "",
    tags: "",
    isAvailable: true,
    weightGrams: "",
    dimensions: {widthMm: "", heightMm: "",depthMm: ""}
  });

  const [message, setMessage] = useState("");

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;   
    setProduct((previousProduct) => ({
      ...previousProduct,
      [name]: value,
    }));
  }

  
async function handleSubmit(event) {
  event.preventDefault();
  setMessage("");

  try {
    const token  = sessionStorage.getItem("token");
    if (!token) {
    setMessage("Please login again.");
    return;
}
    const response = await fetch(
      "http://localhost:4052/api/products",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(product),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Could not save product.");
      return;
    }

    setMessage("Product added successfully!");


   setProduct({  // reset the form after successful submission
    name: "",
    shortDescription: "",
    category: "",
    description: "",
    price: "",
    currency: "INR",
    stock: "",
    imageUrl: "",
    tags: "",
    isAvailable: true,
    weightGrams: "",
    dimensions: {
        widthMm: "",
        heightMm: "",
        depthMm: ""
    } // navigate to view products page after 1 second
    
  })
  setTimeout(() => {
  navigate("/view-products");
}, 1000);
alert("Product added successfully!"); // Show an alert message
  } catch (error) {
    console.error("Error adding product:", error);

    setMessage(
      "Cannot connect to the server. Check whether Node.js is running."
    );
  }
}

function handleDimensionChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    setProduct((previousProduct) => ({
        ...previousProduct,
        dimensions: {
            ...previousProduct.dimensions,
            [name]: value
        }
    }));
}
  return (
    <div className="add-product-page">

      {/* Header */}
      <header className="add-product-header">
        <h1>StoreHub</h1>

        <button
          className="back-button"
          type="button"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </header>

      {/* Form Container */}
      <div className="add-product-container">

        <h2>Add New Product</h2>

        <p className="form-description">
          Add your product details to your store.
        </p>

        <form className="product-form" onSubmit={handleSubmit}>

          {/* Basic Information */}
          <h3>Basic Information</h3>

          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Cotton T-Shirt"
              value={product.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="shortDescription">Short Description</label>
            <input
              id="shortDescription"
              name="shortDescription"
              type="text"
              placeholder="Brief product description"
              value={product.shortDescription}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={product.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="Clothing">Clothing</option>
              <option value="Electronics">Electronics</option>
              <option value="Footwear">Footwear</option>
              <option value="Accessories">Accessories</option>
              <option value="Home">Home & Living</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe your product"
              value={product.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          {/* Pricing and Inventory */}
          <h3>Pricing and Inventory</h3>

          <div className="form-row">

            <div className="form-group">
              <label htmlFor="price">Price *</label>
              <input
                id="price"
                name="price"
                type="number"
                placeholder="999"
                min="10"
                step="1"
                value={product.price}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock Quantity *</label>
            <input
              id="stock"
              name="stock"
              type="number"
              placeholder="10"
              min="0"
              step="1"
              value={product.stock}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="isAvailable">
              <input
                id="isAvailable"
                type="checkbox"
                checked={product.isAvailable}
                onChange={(event) =>
                  setProduct((previousProduct) => ({
                    ...previousProduct,
                    isAvailable: event.target.checked
                  }))
                }
              />
              {" "}Product is available
            </label>
          </div>

          {/* Additional Details */}
          <h3>Additional Details</h3>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              id="tags"
              name="tags"
              type="text"
              placeholder="Wireless, Bluetooth, Electronics"
              value={product.tags}
              onChange={handleChange}
            />
            <small>Separate multiple tags using commas.</small>
          </div>

          <div className="form-group">
            <label htmlFor="weightGrams">Weight (grams)</label>
            <input
              id="weightGrams"
              name="weightGrams"
              type="number"
              min="0"
              placeholder="250"
              value={product.weightGrams}
              onChange={handleChange}
            />
          </div>

          <h4>Product Dimensions (mm)</h4>

          <div className="form-row">

            <div className="form-group">
              <label htmlFor="widthMm">Width</label>
              <input
                id="widthMm"
                name="widthMm"
                type="number"
                min="0"
                placeholder="100"
                value={product.dimensions.widthMm}
                onChange={handleDimensionChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="heightMm">Height</label>
              <input
                id="heightMm"
                name="heightMm"
                type="number"
                min="0"
                placeholder="150"
                value={product.dimensions.heightMm}
                onChange={handleDimensionChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="depthMm">Depth</label>
              <input
                id="depthMm"
                name="depthMm"
                type="number"
                min="0"
                placeholder="50"
                value={product.dimensions.depthMm}
                onChange={handleDimensionChange}
              />
            </div>

          </div>

          {/* Product Image */}
          <h3>Product Image</h3>

          <div className="form-group">
            <label htmlFor="imageUrl">Product Image URL</label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={product.imageUrl}
              onChange={handleChange}
            />
          </div>

          {/* Message */}
          {message && (
            <p className="form-message" role="status">
              {message}
            </p>
          )}

          {/* Buttons */}
          <div className="form-actions">

            <button
              type="submit"
              className="save-product-button"
            >
              Save Product
            </button>

            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default AddProduct;