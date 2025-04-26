import { fetchAllFilteredProducts } from "@/store/shop/product-slice";

export async function navigateWithFilters(dispatch, navigate, path, filters) {
    // Clear previous filters if no new ones provided
    if (!filters || Object.keys(filters).length === 0) {
      sessionStorage.removeItem('filters');
    } else {
      sessionStorage.setItem('filters', JSON.stringify(filters));
    }
  
    // Fetch products before navigation
    await dispatch(fetchAllFilteredProducts({
      filterParams: filters || {},
      sortParams: 'price-lowtohigh'
    }));
  
    // Navigate to the path
    navigate(path);
  }