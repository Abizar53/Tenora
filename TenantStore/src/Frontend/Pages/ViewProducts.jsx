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
                    "http://localhost:4052/api/products",
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
            fetchProducts();
        },[])
        return (
        <div className="view-products-page">
            <header className="products-header">
                <h1>My Products</h1>

                <button onClick={() => navigate("/dashboard")}>
                    Back to Dashboard
                </button>
            </header>

            <main className="products-content">
                {loading && <p>Loading products...</p>}

                {!loading && message && <p>{message}</p>}

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
                        {products.map((product) => (
                            <div className="product-card" key={product._id}>
                                {product.imageUrl && (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                    />
                                )}

                                <h3>{product.name}</h3>

                                <p>{product.description}</p>

                                <p>
                                    Price: ₹{product.price ?? product.priceCents}
                                </p>

                                <p>
                                    Category: {product.category || "Uncategorized"}
                                </p>

                                <p>
                                    Stock: {product.stock ?? 0}
                                </p>
                                <button
                                        onClick={() =>
                                            navigate(`/edit-product/${product._id}`, {
                                                state: { product: product }   //existing product details to that page.
                                            })
                                        }
                                    >
                                        Edit Product
                                    </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default ViewProducts;