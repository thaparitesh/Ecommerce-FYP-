import ProductImageUpload from '@/components/admin-view/image-upload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { fetchAllVendors, fetchPendingVendors } from '@/store/admin/approveVendor-slice';
import { getAllOrdersFromAllUsers, getAdminSalesReports } from '@/store/admin/order-slice';
import { getAllUsers } from '@/store/auth-slice';
import { addFeatureImage, deleteFeatureImage, getFeatureImage } from '@/store/common-slice';
import { Trash2, Users, Package, PackageCheck, Image, ShoppingBag, TrendingUp, BarChart2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  
  const { featureImageList, isLoading } = useSelector(state => state.commonFeature);
  const { user, allUserList } = useSelector(state => state.auth);
  const { orderList, salesReports } = useSelector(state => state.adminOrder);
  const { vendors, pendingVendors } = useSelector(state => state.adminApproval);

  // Calculate dashboard metrics
  const totalUsers = allUserList.length;
  const totalOrders = orderList?.length || 0;
  const approvedVendor = vendors?.filter(vendor => vendor.status === 'active').length || 0;
  const pendingOrders = orderList?.filter(order => order.orderStatus === 'pending').length || 0;
  const processingOrders = orderList?.filter(order => order.orderStatus === 'processing').length || 0;
  const deliveredOrders = orderList?.filter(order => order.orderStatus === 'delivered').length || 0;
  
  // Calculate total revenue
  // const totalRevenue = salesReports?.summary?.totalSales || 
  //   orderList?.reduce((sum, order) => {
  //     if (order.paymentStatus === 'paid' && order.orderStatus === 'delivered') {
  //       return sum + (order.totalAmount || 0);
  //     }
  //     return sum;
  //   }, 0) || 0;

  function handleUploadImageFeature() {
    if (!uploadedImageUrl) {
      toast.error('Please upload an image first');
      return;
    }

    setImageLoadingState(true);
    dispatch(addFeatureImage(uploadedImageUrl))
      .then(data => {
        if (data?.payload?.success) {
          toast.success('Feature image uploaded successfully');
          setImageFile(null);
          setUploadedImageUrl('');
          dispatch(getFeatureImage());
        } else {
          toast.error('Failed to upload image');
        }
      })
      .catch(() => {
        toast.error('Error uploading image');
      })
      .finally(() => {
        setImageLoadingState(false);
      });
  }

  function handleDeleteImage(imageId) {
    if (window.confirm('Are you sure you want to delete this image?')) {
      dispatch(deleteFeatureImage(imageId))
        .then(data => {
          if (data?.payload?.success) {
            toast.success('Image deleted successfully');
            dispatch(getFeatureImage());
          } else {
            toast.error('Failed to delete image');
          }
        })
        .catch(() => {
          toast.error('Error deleting image');
        });
    }
  }  
  
  useEffect(() => {
    if (allUserList.length === 0) {
      dispatch(getAllUsers());
    }
  }, [dispatch, allUserList.length]);

  useEffect(() => {
    dispatch(getFeatureImage());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllOrdersFromAllUsers());
    dispatch(getAdminSalesReports());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchPendingVendors());
    dispatch(fetchAllVendors());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedVendor}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Vendors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingVendors.length}</div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs {totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">All time orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processingOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered Orders</CardTitle>
            <PackageCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveredOrders}</div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Report Section */}
      {salesReports && (
        <>
          {/* Sales Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rs {salesReports.summary.totalSales.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Sales</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rs {salesReports.summary.periodSales.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Products</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{salesReports.topProducts.length}</div>
                <p className="text-xs text-muted-foreground">Best sellers</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Daily revenue for last 30 days</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesReports.periodSales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`Rs ${value.toFixed(2)}`, 'Revenue']}
                    />
                    <Bar 
                      dataKey="revenue" 
                      fill="#8884d8" 
                      radius={[4, 4, 0, 0]}
                      name="Revenue"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Order Status Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
                <CardDescription>Current order distribution</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(salesReports.orderStatusCounts).map(([name, value]) => ({
                        name,
                        value
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {Object.keys(salesReports.orderStatusCounts).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} orders`]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Most popular items across all vendors</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Quantity Sold</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesReports.topProducts.map((product) => (
                    <TableRow key={product.productID}>
                      <TableCell className="font-medium">{product.title}</TableCell>
                      <TableCell>{product.vendorName}</TableCell>
                      <TableCell>{product.totalQuantity}</TableCell>
                      <TableCell className="text-right">Rs {product.totalRevenue.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Top Vendors Table */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Top Performing Vendors</CardTitle>
              <CardDescription>Vendors by sales volume</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Total Orders</TableHead>
                    <TableHead className="text-right">Total Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesReports.topVendors.map((vendor) => (
                    <TableRow key={vendor.vendorID}>
                      <TableCell className="font-medium">{vendor.businessName}</TableCell>
                      <TableCell>{vendor.orderCount}</TableCell>
                      <TableCell className="text-right">Rs {vendor.totalRevenue.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card> */}
        </>
      )}

      {/* Feature Image Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Upload Feature Images
            </CardTitle>
            <CardDescription>Add new images to feature on the homepage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ProductImageUpload
                imageFile={imageFile} 
                setImageFile={setImageFile} 
                uploadedImageUrl={uploadedImageUrl} 
                setUploadedImageUrl={setUploadedImageUrl}
                setImageLoadingState={setImageLoadingState}
                imageLoadingState={imageLoadingState}
              />

              <Button
                onClick={handleUploadImageFeature}
                disabled={!uploadedImageUrl || imageLoadingState}
                className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                {imageLoadingState ? 'Uploading...' : 'Upload Feature Image'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Current Feature Images
            </CardTitle>
            <CardDescription>{featureImageList?.length || 0} images featured</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : featureImageList?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {featureImageList.map((item) => (
                  <div key={item.featureID} className="relative group rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
                    <img
                      src={item.image}
                      alt="Feature"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                        e.target.onerror = null;
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteImage(item.featureID)}
                        className="flex items-center gap-2 shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500 rounded-lg border border-dashed">
                No feature images uploaded yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Vendor Approvals Card */}
      {/* <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vendor Approvals</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingVendors.length}</div>
          <p className="text-xs text-muted-foreground">
            <Link to="/admin/vendors" className="text-blue-600 hover:underline">
              Manage vendors
            </Link>
          </p>
        </CardContent>
      </Card> */}
    </div>
  );
}

export default AdminDashboard;