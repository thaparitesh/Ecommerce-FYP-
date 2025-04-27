import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getAllOrdersFromAllUsersForVendor, getVendorSalesReports } from '@/store/vendor-slice/order-slice';
import { Package, Clock, Truck, TrendingUp, ShoppingBag } from 'lucide-react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

function VendorDashboard() {
  const dispatch = useDispatch();
  const { vendor } = useSelector(state => state.vendorAuth);
  const { orderList, salesReports, isLoading } = useSelector(state => state.vendorOrder);

  // Basic order statistics from orderList
  const totalOrders = orderList?.length || 0;
  const pendingOrders = orderList?.filter(order => order.orderStatus === 'pending').length || 0;
  const processingOrders = orderList?.filter(order => order.orderStatus === 'processing').length || 0;
  const deliveredOrders = orderList?.filter(order => order.orderStatus === 'delivered').length || 0;

  // Total revenue from salesReports (delivered orders only)
  const totalRevenue = salesReports?.summary?.totalSales || 0;

  // Recent sales (sum of periodSales for last 30 days)
  const recentSales = salesReports?.periodSales?.reduce((sum, sale) => sum + sale.revenue, 0) || 0;

  useEffect(() => {
    if (vendor?.id) {
      dispatch(getAllOrdersFromAllUsersForVendor(vendor.id));
      dispatch(getVendorSalesReports({
        vendorID: vendor.id,
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
        endDate: new Date(),
        granularity: 'day',
      }));
    }
  }, [dispatch, vendor?.id]);

  // Get recent transactions
  const recentTransactions = orderList
    ? [...orderList]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
    : [];

  return (
    <div className="space-y-6 p-6">
      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">All orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processingOrders}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest 5 orders</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8 text-gray-500">
              Loading transactions...
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="flex justify-center py-8 text-gray-500">
              No recent transactions
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((order) => (
                  <TableRow key={order.orderID }>
                    <TableCell className="font-medium">
                      #{(order.orderID ).slice(0, 8)}
                    </TableCell>
                    <TableCell>
                      {new Date(order.orderDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.orderStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                        order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">Rs {order.totalAmount?.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Sales Report Section */}
      {salesReports && (
        <>
          {/* Sales Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rs {salesReports.summary?.totalSales?.toFixed(2) || '0.00'}</div>
                <p className="text-xs text-muted-foreground">Delivered orders</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Sales</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rs {recentSales.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Last 30 days (delivered)</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Daily revenue for last 30 days (delivered orders)</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesReports.periodSales || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
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
          </div>

        </>
      )}
    </div>
  );
}

export default VendorDashboard;