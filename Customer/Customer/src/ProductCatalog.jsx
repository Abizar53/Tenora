
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCatalog.css";
import axios from "axios";

const API_URL = "http://localhost:5053";

function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [showLiked, setShowLiked] = useState(false);
  const [likedProducts, setLikedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likeMessage, setLikeMessage] = useState("");
  const [savingLike, setSavingLike] = useState(null);
  const [enquiryMessage,setEnquiryMessage]=useState("");
  const navigate = useNavigate();

  // Get the product's ID.
  // Supports MongoDB's "_id".
  function getProductId(product) {
    const id =  product._id;
    return id == null ? "" : String(id);
  }

  // Load products from the backend.
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(`${API_URL}/api/products`);

        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        const data = await response.json();  // take the data coming from the backend and convert it to JSON format
        setProducts(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Load this logged-in customer's saved likes.
  useEffect(() => {
    async function fetchLikes() {
      try {
        const response = await fetch("http://localhost:5053/api/likes", {
          method: "GET",
          credentials: "include"
        });

        if (!response.ok) {
          if (response.status === 401) {
            setLikedProducts([]);
            return;
          }

          throw new Error("Failed to load liked products");
        }

        const data = await response.json();

        // Keep all IDs as strings for reliable comparisons.
        setLikedProducts(
          Array.isArray(data) ? data.map(String) : []  // checks whether the data is an array and if it is, it maps each element to a string, otherwise it returns an empty array
        );
      } catch (error) {
        console.error("Could not load likes:", error);
      }
    }

    fetchLikes();
  }, []);


  async function sendEnquiry(productId,message) {
    try {
      const response=await axios.post("http://localhost:5053/api/enquiry", {
        productId: productId,   message: message   },
        {withCredentials: true} 
      )
      console.log(response.data)
      alert("Enquiry sent successfully!")
    } catch (error) {
      console.error("Error sending enquiry:", error.response?.data || error.message);
      alert("Failed to send enquiry. Please try again.");
    }
  }

  // Like or unlike a product using the backend.
  async function toggleLike(product) {
    const productId = getProductId(product);

    if (!productId || savingLike !== null) {    // prevents the like button from running when product id is null or missing
      return;
    }

    const isLiked = likedProducts.includes(productId);   //Check whether the current product is already in the customer's liked-products list. retunrns true or false

    setSavingLike(productId); // Set the savingLike state to the current product's ID to indicate that a like/unlike operation is in progress.
    setLikeMessage("");  // Clear any previous like-related messages.

    try {
      const response = await fetch(
        `${API_URL}/api/likes/${encodeURIComponent(productId)}`,
        {
          method: isLiked ? "DELETE" : "POST",
          credentials: "include"
        }
      );

      const data = await response.json().catch(() => ({}));  // If the response is not valid JSON, it will return an empty object instead of throwing an error. 

      if (!response.ok) {
        if (response.status === 401) {
          setLikeMessage("Please log in before liking products.");
        } else {
          setLikeMessage(data.message || "Could not update like.");
        }
        return;
      }



      //updating liked products, Update the UI only after the backend confirms success.
      setLikedProducts((previous) => {   //previous represents the latest existing value of likedProducts.
        if (isLiked) {
          return previous.filter((id) => id !== productId);  // If the product was already liked, remove it from the list of liked products(return new array)
        }

        return previous.includes(productId)  // If the product was not already liked, add it to the list of liked products. If the productId is already in the previous array, it returns the previous array unchanged; otherwise, it returns a new array with the productId added.
          ? previous
          : [...previous, productId];
      });
    } catch (error) {
      console.error("Could not update like:", error);
      setLikeMessage("Unable to connect to the backend.");
    } finally {
      setSavingLike(null);
    }
  }

  // Search by name, category, or description.
  function searchProducts(product) {
    const text = search.toLowerCase();
    // return true or false based on whether the product's name, category, short description, or description includes the search text.  
    return (
      product.name?.toLowerCase().includes(text) ||    
      product.category?.toLowerCase().includes(text) ||
      product.shortDescription?.toLowerCase().includes(text) ||
      product.description?.toLowerCase().includes(text)
    );
  }

  // Get product categories.
  const allCategories = products.map(p => p.category);  //extracts the category from each product.

  const uniqueCategories = new Set(allCategories); // only have unique categories

const categories = ["All", ...uniqueCategories];  // Add "All" option to the beginning of the categories array.


  // Apply search, category, and liked filters.
  let filteredProducts = products.filter((product) => {  // keep the products that match the search, category, and liked filters
    const productId = getProductId(product);

    const matchesSearch = searchProducts(product);

    const matchesCategory =
      category === "All" || product.category === category;

    const matchesLiked =
      !showLiked || likedProducts.includes(productId);

    return matchesSearch && matchesCategory && matchesLiked;
  });

  // Sort the filtered products.
  if (sortBy === "priceLow") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "priceHigh") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === "name") {
    filteredProducts.sort((a, b) =>
      (a.name || "").localeCompare(b.name || "")
    );
  } else if (sortBy === "newest") {
    filteredProducts.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  // Format price.
 function formatPrice(product) {
  return `₹${(product.price || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}
  // Display one product card.
  function displayCard(product) {
    const productId = getProductId(product);
    const isLiked = likedProducts.includes(productId);
    const isSaving = savingLike === productId;

    return (
      <div className="product-card" key={productId}>
        <img src={product.imageUrl} alt={product.name} />

        <div className="product-info">
          <p className="product-category">{product.category}</p>
          <h3>{product.name}</h3>
          <p>{product.shortDescription}</p>
          <p className="price">{formatPrice(product)}</p>

          <p className="stock-status">
            {product.isAvailable ? "In stock" : "Unavailable"}
          </p>

          <div className="buttons">
           <button
            className="like-button"
            disabled={savingLike !== null}
            onClick={() => toggleLike(product)}
          >
            {savingLike === String(product._id)
              ? "Saving..."
              : likedProducts.includes(String(product._id))
              ? "♥ Liked"
              : "♡ Like"}
          </button>
          <button
            className="add-cart-button"
            onClick={() => setSelectedProduct(product)} >
            Enquiry Now
        </button>
            <button
              className="view-button"
              onClick={() => setSelectedProduct(product)}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Display selected product details.
  function displayDetails() { 
    if (!selectedProduct) return null;  

    const productId = getProductId(selectedProduct);
    const isLiked = likedProducts.includes(productId);
    const isSaving = savingLike === productId;
    
    return ( 
      <div
        className="details-overlay"
        onClick={() => setSelectedProduct(null)}
      >
        <div
          className="details-box"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            className="close-button"
            onClick={() => setSelectedProduct(null)}
          >
            ×
          </button>

          <img
            src={selectedProduct.imageUrl}
            alt={selectedProduct.name}
          />

          <h2>{selectedProduct.name}</h2>
          <p className="price">{formatPrice(selectedProduct)}</p>
          <p>{selectedProduct.description}</p>
          <p>Category: {selectedProduct.category}</p>

          <p>
            {selectedProduct.isAvailable
              ? "Currently available"
              : "Currently unavailable"}
          </p>

          <button
            className="like-button"
            disabled={savingLike !== null}
            onClick={() => toggleLike(selectedProduct)}
          >
            {isSaving
              ? "Saving..."
              : isLiked
              ? "♥ Liked"
              : "♡ Like"}
          </button>

          {/* Enquiry button */}
          <h3>Send an Enquiry</h3>

<textarea
    value={enquiryMessage}
    onChange={(event) =>
        setEnquiryMessage(event.target.value)
    }
    placeholder="Write your enquiry here..."
/>

<button
    onClick={async () => {
        await sendEnquiry(
            selectedProduct._id,
            enquiryMessage
        );
    }}
>
    Submit Enquiry
</button>
        </div>
      </div>
    );
  }

  // Reset search and filters.
  function clearFilters() {
    setSearch("");
    setCategory("All");
    setSortBy("default");
    setShowLiked(false);
  }

  return (
    <div className="catalog">
      <div className="catalog-header">
        <div>
          <h1>Product Catalog</h1>
          <p className="subtitle">Find your favourite products</p>
        </div>

        <button
          className="profile-button"
          onClick={() => navigate("/profile")}
        >
          👤 Profile
        </button>
      </div>

      <input
        className="search-input"
        type="text"
        placeholder="Search by name, category, or description..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className="catalog-filters">
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item === "All" ? "All Categories" : item}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
        >
          <option value="default">Default Order</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
          <option value="newest">Newest First</option>
        </select>

        <button
          className="like-button"
          onClick={() => setShowLiked(!showLiked)}
        >
          {showLiked ? "♥ All Products" : "♡ Liked Products"}
        </button>

        <button className="view-button" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      {likeMessage && (
        <p className="no-products">{likeMessage}</p>
      )}

      {loading && <p>Loading products...</p>}
      {error && <p className="no-products">{error}</p>}

      {!loading && !error && (
        <>
          <p className="result-count">
            Products found: {filteredProducts.length}
          </p>

          <div className="product-grid">
            {filteredProducts.map(displayCard)}
          </div>

          {filteredProducts.length === 0 && (
            <p className="no-products">
              No products match your filters.
            </p>
          )}
        </>
      )}

      {displayDetails()}

    </div>
  );
}

export default ProductCatalog;
