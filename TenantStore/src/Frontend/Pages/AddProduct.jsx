
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS_files/AddProduct.css";
import ChatLayout from "./ChatBot/ChatLayout";

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

  const [message, setMessage] = useState("")
  const [selectedImages, setSelectedImages]= useState([])   // variable containing images selected by user through file input 

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;   
    setProduct((previousProduct) => ({
      ...previousProduct,
      [name]: value,
    }));
  }

  function handleImageChange(event){
    const files= Array.from(event.target.files)   // get selected files and cone=vert FileList into a normal array
    if (selectedImages.length + files.length > 5){  // selected images are already selected and files are current selection
      setMessage("U can upload a maximum of 5 images")
      event.target.value=""   // cleans file input
      return
    }
     const allowedTypes = ["image/jpeg", "image/png","image/webp"]
      for (const file of files) {   // validate every selected files uploading 
        if (!allowedTypes.includes(file.type)) {
            setMessage("Only JPEG, PNG and WebP images are allowed.");
            event.target.value = "";
            return;
        }
         if (file.size > 5 * 1024 * 1024) {
            setMessage("Each image must be smaller than 5 MB.");
            event.target.value = "";
            return;
        }
      }
      setMessage("")   // clear previous error message

      setSelectedImages((previousImages) => [   // add selected images to state 
        ...previousImages,
        ...files
    ]);

    event.target.value = ""  // reseting allows userto select same image again
  }

  function removeSelectedImage(index) {   // this removes an image from the selection without uploading it 
    setSelectedImages((previousImages) =>
        previousImages.filter((_, imageIndex) => imageIndex !== index)
    );
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
  // STEP 1: Upload selected images to Cloudinary
        let uploadedImages = []   // infomation retured by our backend 
        if (selectedImages.length > 0) {

            const formData = new FormData();   // js object used to send form data especially files 

            // Append each selected image
            selectedImages.forEach((image) => {
                formData.append("images", image) // iterate thorugh every selected image and add the image to our form data
            })

    const imageResponse = await fetch(  // send images to backend 
      "http://localhost:4052/api/products/images",
      {
        method: "POST",
        headers: {
          // "Content-Type": "application/json",  // because w eare sendning image data :multipart/form-data
          "Authorization": `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: formData
      }
    );

    const imageData = await imageResponse.json();  // read backend response 
    console.log("Image upload status:", imageResponse.status);
console.log("Image upload response:", imageData);
    if (!imageResponse.ok) {   // check for error
      setMessage(imageData.message || "Image upload failed ");
      return;
    }

    uploadedImages=imageData.images
  }

   // STEP 2: Prepare product data with uploaded images
        const productData = {
            ...product,
            images: uploadedImages,

            // Keep compatibility with existing single-image frontend
            imageUrl: uploadedImages[0]?.url || product.imageUrl
        }
console.log("Uploaded images:", uploadedImages);
console.log("Product data being sent:", productData);
     // STEP 3: Save product in MongoDB
        const response = await fetch(
            "http://localhost:4052/api/products",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(productData)
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
  setSelectedImages([])

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
    }))
  }

function handleApplySuggestion(field, value) {

    // Convert tags array into the comma-separated string
    // expected by the Add Product input.
    if (field === "tags" && Array.isArray(value)) {
        value = value.join(", ");
    }

    setProduct((previousProduct) => ({
        ...previousProduct,
        [field]: value
    }));
}
  return (
    <ChatLayout context={{
      page:"add-product",product: product
    }}  onApplySuggestion={handleApplySuggestion} >
    <div className="add-product-page">

      {/* Header */}
      <header className="add-product-header">
        <h1>Tenora</h1>

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

                        {/* Product Images */}
              <h3>Product Images</h3>

              <div className="form-group">
                  <label htmlFor="productImages">
                      Upload Product Images
                  </label>

                  <input
                      id="productImages"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handleImageChange}
                  />

                  <small>
                      Select up to 5 images. JPEG, PNG and WebP only. Maximum 5 MB per image.
                  </small>
              </div>

              {/* Image Preview */}
              {selectedImages.length > 0 && (
                  <div className="image-preview-container">

                      {selectedImages.map((image, index) => (
                          <div className="image-preview" key={`${image.name}-${index}`}>

                              <img
                                  src={URL.createObjectURL(image)}
                                  alt={`Product preview ${index + 1}`}
                              />

                              <button
                                  type="button"
                                  onClick={() => removeSelectedImage(index)}
                              >
                                  Remove
                              </button>

                          </div>
                      ))}
                    </div>
              )}
              <div className="form-actions">
                  <button type="submit" className="save-product-button">
                      Add Product
                  </button>
              </div>

        </form>
      </div>
    </div>
    </ChatLayout>
  );
}

export default AddProduct;