import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import "../CSS/TenantLayout.css"
function TenantLayout(){
    return(
        <div className="tenant-layout">
            {/* Side bar navigation*/}
            <Sidebar />   {/* react renders the jsx returned by the Sidebar component */}
             {/* Main page section */}
            <div className="tenant-main">

                <Header />
                
                {/* Current page will render here */}
                <main className="tenant-content">
                    <Outlet />
                </main>

            </div>

        </div>
    )
}

export default TenantLayout