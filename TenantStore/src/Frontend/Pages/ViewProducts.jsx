import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "../CSS_files/ViewProduct.css";

function ViewProducts() {
    const navigate=useNavigate()

    const [ products, setproducts ] = useState([])
    const [ loading, setloading ] = useState()
    const [message, setmessage] = useState()

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
                )
                const data = await response.json()
                if (!response.ok) {
                    setmessage(data.message || "Unable to fetch products");
                    return;
                }

                setproducts(data);

        }catch(error){
                console.error("Error fetching products:", error);
                setmessage("Cannot connect to the server.");
            } finally {
                setloading(false);
            }
        }        
        
        fetchProducts()
        },[])
      return (
        <div className="view-products-page">

            <header className="products-header">
                <div>
                    <h1>My Products</h1>
                    <p>Manage and keep track of your store products.</p>
                </div>

                <div className="products-header-actions">
                    <button
                        className="add-product-button"
                        onClick={() => navigate("/add-product")}
                    >
                        + Add Product
                    </button>

                    <button
                        className="back-dashboard-button"
                        onClick={() => navigate("/dashboard")}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </header>

            <main className="products-content">

                {!loading && !message && products.length > 0 && (
                    <div className="products-summary">
                        <span>Total Products</span>
                        <strong>{products.length}</strong>
                    </div>
                )}

                {loading && (
                    <p className="products-feedback">Loading products...</p>
                )}

                {!loading && message && (
                    <p className="products-feedback error-message">{message}</p>
                )}

                {!loading && !message && products.length === 0 && (
                    <div className="empty-products">
                        <h2>No products yet</h2>
                        <p>Add your first product to see it here.</p>

                        <button onClick={() => navigate("/add-product")}>
                            Add Product
                        </button>
                    </div>
                )}

                {!loading && !message && products.length > 0 && (
                    <div className="products-grid">

                       {products.map((product) => {

    const productImages = product.images?.length > 0
        ? product.images.map((image) => image.url)
        : product.imageUrl
            ? [product.imageUrl]
            : [];
            console.log("Product name:", product.name);
            console.log("Images received:", product.images);
            console.log("Image URLs:", productImages);

    return (
        <div className="product-card" key={product._id}>
                                <div className="product-image-container">

                                {productImages.length > 0 ? (

                                    <div className="product-image-gallery">

                                        {/* Main Product Image */}
                                        <img
                                            className="main-product-image"
                                            src={productImages[0]}
                                            alt={product.name}
                                        />

                                        {/* Additional Images */}
                                        {productImages.length > 1 && (
                                            <div className="product-image-thumbnails">

                                                {productImages.slice(1).map((image, index) => (
                                                    <img
                                                        key={index}
                                                        src={image}
                                                        alt={`${product.name} ${index + 2}`}
                                                    />
                                                ))}

                                            </div>
                                        )}

                                    </div>

                                ) : (
                                    <div className="product-image-placeholder">
                                        No Image
                                    </div>
                                )}

                                <span
                                    className={`product-availability ${
                                        product.isAvailable ? "available" : "unavailable"
                                    }`}
                                >
                                    {product.isAvailable ? "Available" : "Unavailable"}
                                </span>

                            </div>

                                <div className="product-card-content">

                                    <p className="product-category">
                                        {product.category || "Uncategorized"}
                                    </p>

                                    <h3>{product.name}</h3>

                                    <p className="product-description">
                                        {product.description || "No description provided."}
                                    </p>

                                    <div className="product-price">
                                        ₹{product.price ?? product.priceCents}
                                    </div>

                                    <div className="product-stock">
                                        <span>Stock</span>
                                        <strong>
                                            {product.stock ?? 0} units
                                        </strong>
                                    </div>

                                    <button
                                        className="edit-product-button"
                                        onClick={() =>
                                            navigate(`/edit-product/${product._id}`, {
                                                state: { product: product }
                                            })
                                        }
                                    >
                                        Edit Product
                                    </button>

                                </div>
                            </div>
                                )
                            })}

                    </div>
                )}

            </main>
        </div>
    );
}


export default ViewProducts;