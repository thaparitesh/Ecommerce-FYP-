import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { deleteProduct, fetchAllProducts } from '@/store/vendor-slice/product-slice';
import VendorProductTile from '@/components/vendor-view/product-tile';

function VendorProducts() {
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    productId: null
  });
  
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const { productList } = useSelector(state => state.vendorProducts);
  const { vendor } = useSelector(state => state.vendorAuth);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const filteredProducts = productList?.filter(product => {
       if (activeTab === 'all') return true;
    return product.status === activeTab;
  });

  function handleDelete(getCurrentProductId) {
    setDeleteConfirmation({
      open: true,
      productId: getCurrentProductId
    });
  }

  function confirmDelete() {
    if (!deleteConfirmation.productId) return;
    
    dispatch(deleteProduct({id: deleteConfirmation.productId, vendorID: vendor?.id})).then(data => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts(vendor.id));
        toast.success('Product deleted successfully');
      }
    });
    
    setDeleteConfirmation({
      open: false,
      productId: null
    });
  }

  function cancelDelete() {
    setDeleteConfirmation({
      open: false,
      productId: null
    });
  }
 
 
  useEffect(() => {
    if (vendor?.id) {
      setIsLoading(true);
      dispatch(fetchAllProducts(vendor?.id)).finally(() => {
        setIsLoading(false);
      });
    }
  }, [dispatch, vendor?.id]);

  const StatusBadge = ({ status }) => {
    const statusStyles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      default: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs capitalize ${statusStyles[status.toLowerCase()] || statusStyles.default}`}>
        {status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Product Management</CardTitle>
          <div className="flex items-center gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts && filteredProducts.length > 0 ? 
            filteredProducts.map((productItem) => (
              <div key={productItem.id} className="relative">
                <VendorProductTile 
                  product={productItem} 
                  handleDelete={handleDelete}
                />
                <div className="absolute top-2 right-2">
                  <StatusBadge status={productItem.status} />
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">
                  No {activeTab === 'all' ? '' : activeTab} products found
                </p>
              </div>
            )
          } 
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmation.open} onOpenChange={cancelDelete}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this product? 
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default VendorProducts;