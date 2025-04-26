import { Navigate, useLocation } from "react-router-dom";

function VendorCheckAuth({ isAuthenticatedVendor, vendor, isVendor, children }) {
  const location = useLocation();
  const isVendorAuthRoute = location.pathname.includes("/vendorAuth");
  const isVendorRoute = location.pathname.startsWith("/vendor");

  console.log("Auth check:", {
    path: location.pathname,
    isAuth: isAuthenticatedVendor,
    isVendorRoute,
    isVendorAuthRoute
  });

  // Handle root path
  if (location.pathname === "/") {
    return isAuthenticatedVendor && vendor?.status==='active'
      ? <Navigate to="/vendor/dashboard"  /> 
      : <Navigate to="/auth/login"  />;
  }

  // Allow access to vendor auth routes
  if (isVendorAuthRoute) {
    // Prevent authenticated vendors from accessing auth pages
    if (isAuthenticatedVendor && vendor?.status==='active') {
      return <Navigate to="/vendor/dashboard"  />;
    }
    return children;
  }

  // Protect vendor routes
  if (isVendorRoute && !isAuthenticatedVendor) {
    return <Navigate to="/auth/login" />;
  }

  // Prevent vendors from accessing customer routes
  if (isAuthenticatedVendor && vendor?.status==='active' && location.pathname.startsWith("/shop")) {
    return <Navigate to="/vendor/dashboard"  />;
  }

  // Prevent vendors from accessing admin routes
  if (isAuthenticatedVendor && location.pathname.startsWith("/admin")) {
    return <Navigate to="/unauth-page"  />;
  }

  return children;
}

export default VendorCheckAuth;