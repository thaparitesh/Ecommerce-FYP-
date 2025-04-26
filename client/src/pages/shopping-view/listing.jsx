import { useNavigate } from 'react-router-dom';
import ProductFilter from '@/components/shopping-view/filter';
import ShoppingProductTile from '@/components/shopping-view/product-tile';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { sortOptions } from '@/config';
import { fetchAllFilteredProducts } from '@/store/shop/product-slice';
import { ArrowUpDownIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import { toast } from 'sonner';

function createSearchParamsHelper(filterParams) {
  const queryParams = [];
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(',');
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  return queryParams.join('&');
}

function ShoppingListing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { productList, loading } = useSelector(state => state.shopProducts);
  const { user } = useSelector(state => state.auth);
  const { cartItems } = useSelector(state => state.shopCart);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('price-lowtohigh');
  const [searchParams, setSearchParams] = useSearchParams();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const activeProducts = productList?.filter(product => product.status !== 'inactive') || [];

  useEffect(() => {
    const urlFilters = {};
    for (const [key, value] of searchParams.entries()) {
      urlFilters[key] = value.split(',').map(decodeURIComponent);
    }

    const initialFilters = Object.keys(urlFilters).length > 0 
      ? urlFilters 
      : JSON.parse(sessionStorage.getItem('filters')) || {};

    setFilters(initialFilters);
    setIsInitialLoad(false);
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      const fetchProducts = async () => {
        try {
          await dispatch(fetchAllFilteredProducts({ 
            filterParams: filters, 
            sortParams: sort 
          }));

          if (Object.keys(filters).length > 0) {
            const queryString = createSearchParamsHelper(filters);
            setSearchParams(new URLSearchParams(queryString));
          } else {
            setSearchParams(new URLSearchParams());
          }
        } catch (error) {
          toast.error('Failed to load products');
          console.error('Error fetching products:', error);
        }
      }; 

      fetchProducts();
    }
  }, [dispatch, filters, sort, isInitialLoad]);

  const handleSort = (value) => {
    setSort(value);
  };

  const handleFilter = (getSectionId, getCurrentOption) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      
      if (!newFilters[getSectionId]) {
        newFilters[getSectionId] = [getCurrentOption];
      } 
      else if (newFilters[getSectionId].includes(getCurrentOption)) {
        newFilters[getSectionId] = newFilters[getSectionId].filter(
          item => item !== getCurrentOption
        );
        
        if (newFilters[getSectionId].length === 0) {
          delete newFilters[getSectionId];
        }
      } 
      else {
        newFilters[getSectionId].push(getCurrentOption);
      }

      sessionStorage.setItem('filters', JSON.stringify(newFilters));
      return newFilters;
    });
  };

  const handleProductClick = (productId) => {
    navigate(`/shop/listing/${productId}`);
  };

  const handleAddToCart = (getCurrentProductId, getTotalStock) => {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(item => item.productID === getCurrentProductId);
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast.error(`Only ${getQuantity} quantity can be added for this product`);
          return;
        }
      }
    }

    if (!user?.id) {
      toast.error('Please login to add items to cart');
      return;
    }

    dispatch(addToCart({
      userID: user.id, 
      productID: getCurrentProductId, 
      quantity: 1
    })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user.id));
        toast.success('Product added to cart');
      } else {
        toast.error('Failed to add product to cart');
      }
    });
  };

  const clearAllFilters = () => {
    setFilters({});
    sessionStorage.removeItem('filters');
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className='grid grid-cols-[250px_1fr] gap-6 p-6 h-[calc(100vh-80px)]'>
      {/* Fixed Filters Column */}
      <div className='sticky top-20 h-[calc(100vh-100px)] overflow-y-auto'>
        <ProductFilter 
          filters={filters} 
          handleFilter={handleFilter} 
          onClearAll={clearAllFilters}
        />
      </div>
      
      {/* Scrollable Products Column */}
      <div className='bg-background rounded-lg shadow-sm overflow-y-auto'>
        <div className='p-4 border-b flex items-center justify-between sticky top-0 bg-background z-10'>
          <h2 className='text-xl font-bold'>All Products</h2>
          
          <div className='flex items-center gap-3'>
            {Object.keys(filters).length > 0 && (
              <Button 
                variant='ghost' 
                size='sm' 
                onClick={clearAllFilters}
                className='text-primary'
              >
                Clear all
              </Button>
            )}
            
            <span className='text-muted-foreground'>
              {loading ? 'Loading...' : `${activeProducts.length} Products`}
            </span>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm' className='flex items-center gap-1'>
                  <ArrowUpDownIcon className='h-4 w-4'/>
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-[200px]'>
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map(sortItem => (
                    <DropdownMenuRadioItem 
                      value={sortItem.id} 
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {loading ? (
          <div className='flex justify-center items-center h-64'>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : activeProducts.length === 0 ? (
          <div className='flex flex-col items-center justify-center p-12 text-center'>
            <h3 className='text-lg font-medium'>No active products found</h3>
            <p className='text-muted-foreground mt-2'>
              Try adjusting your filters or search criteria
            </p>
            <Button 
              variant='outline' 
              className='mt-4' 
              onClick={clearAllFilters}
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 p-4'>
            {activeProducts.map(productItem => (
              <ShoppingProductTile 
                key={productItem.productID} 
                onClick={() => handleProductClick(productItem.productID)} 
                product={productItem} 
                handleAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShoppingListing;