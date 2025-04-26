import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, isAuthenticatedVendor,
  vendor, children }) {
  const location = useLocation();

  console.log(location.pathname, isAuthenticatedVendor,"isvendor" );

  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    } else {
      if (user?.role === "admin") {
        return <Navigate to="/admin/dashboard" />;
      } else if(isAuthenticatedVendor && vendor?.status==='active'){
        return <Navigate to="/vendor/dashboard"  />;
      }else if (user?.role === "user"){
        return <Navigate to="/shop/home" />;
      }
      else{
        return <Navigate to="/auth/login" />
      }
    }
  }

  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register")
    )
  ) {
    return <Navigate to="/auth/login" />;
  }

  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
  } else if(isAuthenticatedVendor && vendor?.status==='active'){
    return <Navigate to="/vendor/dashboard" />;
  }else if (user?.role === "user"){
    return <Navigate to="/shop/home" />;
  }
  else{
    return <Navigate to="/auth/login" />
  }
}

  if (isAuthenticatedVendor && vendor?.status==='active') {
    if (location.pathname.includes("/shop")) {
      return <Navigate to="/vendor/dashboard" />;
    }
  }

  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.includes("shop")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;
