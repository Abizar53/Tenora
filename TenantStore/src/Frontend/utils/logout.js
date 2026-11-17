


function logout(navigate){
     sessionStorage.removeItem("token");
    sessionStorage.removeItem("tenant");

    navigate("/login", { replace: true });
}

export default logout;