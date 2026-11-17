
import { useEffect, useState } from "react";

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchProducts() {
            const token = sessionStorage.getItem("token");
            
            try {
                const response = await fetch("http://localhost:4052/api/products",{
                    method: 'GET', headers:{
                        "Authorization" : `Bearer ${token}` }
                    } );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Could not fetch products"
                    );
                }

                // Our backend returns an array of products.
                setProducts(Array.isArray(data) ? data : data.products ?? []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    if (loading) {
        return <p>Loading products...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>Products</h1>

            {products.length === 0 ? (
                <p>No products found. Add a product first.</p>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "20px"
                    }}
                >
                    {products.map((product, index) => (
                        <div
                            key={product.id ?? index}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "16px"
                            }}
                        >
                            {product.imageUrl && (
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    style={{
                                        width: "100%",
                                        height: "180px",
                                        objectFit: "cover"
                                    }}
                                />
                            )}

                            <h2>{product.name}</h2>
                            <p>Category: {product.category}</p>
                            <p>{product.description}</p>
                            <p>Price: ₹{product.price}</p>
                            <p>Stock: {product.stock}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Products;
