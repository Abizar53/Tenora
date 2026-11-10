import TenantDashboard from "./Frontend/Pages/TenantDashboard";
import TenantLogin from "./Frontend/Pages/TenantLogin";
import { BrowserRouter,Routes,Route,Navigate } from "react-router-dom";
import AddProduct from "./Frontend/Pages/AddProduct";
import Products from "./Frontend/Pages/products";
import ViewProducts from "./Frontend/Pages/ViewProducts.jsx";
import EnquiryPage from "./Frontend/Pages/enquiry.jsx"

function Run(){
    return (
    <BrowserRouter>    {/*routing system*/}
    <Routes>           {/*routing manager*/} 
        <Route path="/login" element={<TenantLogin/>}/> {/*individual worker  displays your tenant login form.*/}
        <Route path="/dashboard" element={<TenantDashboard/>    } />  {/*TenantDashboard displays the dashboard for a tenant's store.*/} 
        <Route path="*" element={<Navigate to="/login" replace />} />  {/*Unknown URLs fallback route The * pattern matches URLs that do not match your other route definition*/}
        <Route path= "/add-product" element={<AddProduct />} />  {/*falls onto the add product section form */}
        <Route path="/products" element={<Products />} />
        <Route path="/view-products" element={<ViewProducts />} />  {/*\ */}
        <Route path="/enquiries" element={<EnquiryPage />} />  {/*\ */}
        <Route path="/edit-product/:id" element={<EditProduct />} />  
    </Routes>
    </BrowserRouter> 
    )
}

export default Run