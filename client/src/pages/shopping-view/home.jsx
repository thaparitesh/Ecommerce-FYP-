import React, { useEffect, useState } from 'react';
import bannerThree from '../../assets/banner3.jpeg';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import whey from '../../assets/whey3.jpeg';
import creatine from '../../assets/creatine2.jpeg';
import preworkout from '../../assets/preworkout.webp';
import vitamins from '../../assets/multivitamin.jpeg';
import gainer from '../../assets/Gainer.jpeg';
import on from '../../assets/on2.png';
import muscleblaze from '../../assets/muscleblaze.png';
import muscletech from '../../assets/muscletech.png';
import myprotein from '../../assets/myprotein.png';
import bsn from '../../assets/bsn.png';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFilteredProducts } from '@/store/shop/product-slice';
import ShoppingProductTile from '@/components/shopping-view/product-tile';
import { useNavigate } from 'react-router-dom';
import { getFeatureImage } from '@/store/common-slice';

const categories = [
  { id: "protein", label: "Protein", icon: whey },
  { id: "preworkout", label: "Pre-Workout", icon: preworkout },
  { id: "creatine", label: "Creatine", icon: creatine },
  { id: "vitamins", label: "Vitamins", icon: vitamins },
  { id: "weightgainer", label: "Weight Gainer", icon: gainer },
];

const brands = [
  { id: "optimumnutrition", label: "Optimum Nutrition", icon: on },
  { id: "muscletech", label: "MuscleTech", icon: muscletech },
  { id: "bsn", label: "BSN", icon: bsn},
  { id: "myprotein", label: "MyProtein" , icon:myprotein},
  { id: "muscleblaze", label: "MuscleBlaze" , icon : muscleblaze},
  
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productList } = useSelector(state => state.shopProducts);
  const {featureImageList} = useSelector(state => state.commonFeature)

  
  function handleNavigationToListingPage(getCurrentItem, section) {
    // Prepare filters before navigation
    const currentFilter = {
      [section]: [getCurrentItem.id]
    };
    
    // Dispatch filtered products before navigation
    dispatch(fetchAllFilteredProducts({
      filterParams: currentFilter,
      sortParams: 'price-lowtohigh'
    })).then(() => {
      // Store filters and navigate after data is loaded
      sessionStorage.setItem('filters', JSON.stringify(currentFilter));
      navigate(`/shop/listing`);
    });
  }
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [featureImageList]);
 
  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: 'price-lowtohigh' }));
  }, [dispatch]);

  const featuredProducts = productList?.slice(0, 4) || [];

  const handleProductClick = (productID) => {
    navigate(`/shop/listing/${productID}`);
  };

  useEffect(()=>{
      dispatch(getFeatureImage())
    },[dispatch])

  

  return (
    <div className="min-h-screen">
      {/* Banner Section */}
      <div className="relative h-[500px] overflow-hidden mt-2">
        {featureImageList && featureImageList.length > 0
            ? featureImageList.map((slide, index) => (
                <img
                  src={slide?.image}
                  key={index}
                  className={`${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
                />
              ))
            : null
          }
       
       <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Card onClick={()=> handleNavigationToListingPage(category,'category')} key={category.id} className="cursor-pointer hover:shadow-lg">
                <CardContent className="flex flex-col items-center p-6">
                  <img 
                    src={category.icon} 
                    alt={category.label}
                    className="w-35 h-35 object-contain mb-4"
                  />
                  <span className="font-bold text-center">{category.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <div 
                key={product.productID} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleProductClick(product.productID)}
              >
                <ShoppingProductTile product={product} hideAddToCart={true} />

              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Top Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {brands.map((brand) => (
              <Card onClick={()=> handleNavigationToListingPage(brand,'brand')} key={brand.id} className="cursor-pointer hover:shadow-lg">
                <CardContent className="flex flex-col items-center p-6">
                  <img 
                    src={brand.icon} 
                    alt={brand.label}
                    className="w-35 h-35 object-contain mb-4"
                  />
                  <span className="font-bold text-center">{brand.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ShoppingHome;
