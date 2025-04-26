import ProductImageUpload from '@/components/admin-view/image-upload';
import CommonForm from '@/components/common/form';
import { Button } from '@/components/ui/button';
import { addProductFormElements } from '@/config';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { addNewProduct, editProduct } from '@/store/vendor-slice/product-slice';

const initialFormData = {
  image: null,
  title: '',
  description: '',
  category: '',
  brand: '',
  price: '',
  salePrice: '',
  totalStock: '', 
  vendorID: '',
  status: '',
};

function AddProductVendorPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({
    image: false,
    title: false,
    description: false,
    category: false,
    brand: false,
    price: false,
    totalStock: false,
    vendorID: false,
    status: false
  });

  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { productList } = useSelector(state => state.vendorProducts);
  const { vendor } = useSelector(state => state.vendorAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadProductData = () => {
      if (!id) {
        setFormData({
          ...initialFormData,
          vendorID: vendor?.id || ''
        });
        setUploadedImageUrl('');
        setIsLoading(false);
        return;
      }

      if (location.state?.productData) {
        const product = location.state.productData;
        setFormData({
          ...product,
          salePrice: product.salePrice || '',
          vendorID: vendor?.id || '',
          status: product.status || 'active'
        });
        setUploadedImageUrl(product.image || '');
        setIsLoading(false);
        return;
      }

      if (productList?.length > 0) {
        const productToEdit = productList.find(product => 
          product.productID === id || product.id === id
        );
        if (productToEdit) {
          setFormData({
            ...productToEdit,
            salePrice: productToEdit.salePrice || '',
            vendorID: vendor?.id || '',
            status: productToEdit.status || 'active'
          });
          setUploadedImageUrl(productToEdit.image || '');
        }
        setIsLoading(false);
      }
    };

    loadProductData();
  }, [id, productList, location.state, vendor]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  function validateForm() {
    const errors = {
      image: !id && !uploadedImageUrl && !formData.image,
      title: !formData.title,
      description: !formData.description,
      category: !formData.category,
      brand: !formData.brand,
      price: !formData.price,
      totalStock: !formData.totalStock
    };
    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  }

  function onSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill all required fields');
      return;
    }

    const productPayload = {
      ...formData,
      image: uploadedImageUrl || formData.image,
      vendorID: vendor?.id
    };

    const action = id
      ? editProduct({ id, formData: productPayload })
      : addNewProduct(productPayload);

    dispatch(action).then((data) => {
      if (data?.payload?.success) {
        navigate('/vendor/products');
        toast.success(`Product ${id ? 'updated' : 'added'} successfully`);
      }
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          {id ? 'Edit Product' : 'Add New Product'}
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <ProductImageUpload 
            imageFile={imageFile} 
            setImageFile={setImageFile} 
            uploadedImageUrl={uploadedImageUrl} 
            setUploadedImageUrl={url => {
              setUploadedImageUrl(url);
              setFormData(prev => ({...prev, image: url}));
              setFormErrors(prev => ({...prev, image: false}));
            }}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={!!id}
            hasError={formErrors.image}
          />
          
          <div className='py-6'>
            <CommonForm 
              onSubmit={onSubmit}
              formData={formData} 
              setFormData={setFormData} 
              buttonText={id ? 'Update Product' : 'Add Product'} 
              formControls={addProductFormElements.map(control => ({
                ...control,
                error: formErrors[control.name] ? `${control.label} is required` : ''
              }))} 
            />
            {formErrors.image && (
              <p className="text-red-500 text-sm mt-2">Product image is required</p>
            )}
          </div>
          
          <div className="flex justify-end gap-4 mt-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/vendor/products')}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProductVendorPage;