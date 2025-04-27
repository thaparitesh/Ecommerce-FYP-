import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Image, Download } from 'lucide-react';
import { format, subDays, isAfter } from 'date-fns';
import { Input } from '@/components/ui/input';
import { getVendorSalesReports } from '@/store/vendor-slice/order-slice';

function VendorSalesReport() {
  const dispatch = useDispatch();
  const { vendor } = useSelector(state => state.vendorAuth);
  const { salesReports, isLoading } = useSelector(state => state.vendorOrder);
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [granularity, setGranularity] = useState('day');

  useEffect(() => {
    if (vendor?.id) {
      dispatch(
        getVendorSalesReports({
          vendorID: vendor.id,
          startDate: dateRange.from,
          endDate: dateRange.to,
          granularity,
        })
      );
    }
  }, [dispatch, vendor?.id, dateRange, granularity]);

  const processedData = salesReports
    ? {
        summary: {
          totalSales: salesReports.summary?.totalSales || 0,
          totalOrders: salesReports.summary?.orderCount || 0,
        },
        detailedOrders: salesReports.detailedOrders || [],
        periodSales: salesReports.periodSales || [],
      }
    : null;

  // Calculate average order value
  const avgOrderValue =
    processedData && processedData.summary.totalOrders > 0
      ? processedData.summary.totalSales / processedData.summary.totalOrders
      : 0;

  // Handle date change
  const handleDateChange = (type, date) => {
    if (type === 'from' && date) {
      if (dateRange.to && isAfter(date, dateRange.to)) {
        alert('From date cannot be after To date');
        return;
      }
      setDateRange(prev => ({ ...prev, from: date }));
      setCurrentPage(1);
    } else if (type === 'to' && date) {
      if (dateRange.from && isAfter(dateRange.from, date)) {
        alert('To date cannot be before From date');
        return;
      }
      setDateRange(prev => ({ ...prev, to: date }));
      setCurrentPage(1);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setDateRange({ from: subDays(new Date(), 30), to: new Date() });
    setSearchTerm('');
    setGranularity('day');
    setCurrentPage(1);
  };

  // Filter and paginate orders
  const filteredOrders = useMemo(() => {
    if (!processedData?.detailedOrders) return [];

    let orders = [...processedData.detailedOrders];

    // Filter by search term
    if (searchTerm) {
      orders = orders.filter(
        order =>
          (order.orderID?.toString() || order.id?.toString())?.includes(searchTerm) ||
          order.items.some(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    return orders;
  }, [processedData?.detailedOrders, searchTerm]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Format period label based on granularity
  const formatPeriod = period => {
    const date = new Date(period);
    if (granularity === 'day') return format(date, 'MMM dd, yyyy');
    if (granularity === 'week') return `Week of ${format(date, 'MMM dd, yyyy')}`;
    if (granularity === 'month') return format(date, 'MMMM yyyy');
    if (granularity === 'year') return format(date, 'yyyy');
    return period;
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Orders Sales Report</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">Rs</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              Rs {processedData?.summary.totalSales.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">Delivered orders</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">#</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {processedData?.summary.totalOrders || 0}
            </div>
            <p className="text-xs text-muted-foreground">Delivered orders</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">Rs</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              Rs {avgOrderValue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Per delivered order</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Customize your sales report</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium">From Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal mt-1"
                >
                  <Image className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    format(dateRange.from, 'LLL dd, y')
                  ) : (
                    <span>Pick a from date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateRange.from}
                  onSelect={date => handleDateChange('from', date)}
                  defaultMonth={dateRange.from}
                  disabled={date => date > new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium">To Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal mt-1"
                >
                  <Image className="mr-2 h-4 w-4" />
                  {dateRange.to ? (
                    format(dateRange.to, 'LLL dd, y')
                  ) : (
                    <span>Pick a to date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateRange.to}
                  onSelect={date => handleDateChange('to', date)}
                  defaultMonth={dateRange.to}
                  disabled={date => date > new Date() || (dateRange.from && date < dateRange.from)}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium">Search Orders</label>
            <Input
              placeholder="Search by Order ID or Product"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="mt-1"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium">Time Period</label>
            <Select value={granularity} onValueChange={value => {
              setGranularity(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Daily</SelectItem>
                <SelectItem value="week">Weekly</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="year">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button variant="secondary" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Period Sales Summary */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Sales by {granularity.charAt(0).toUpperCase() + granularity.slice(1)}</CardTitle>
          <CardDescription>
            Total sales grouped by {granularity}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8 text-gray-500">
              Loading sales data...
            </div>
          ) : processedData?.periodSales.length === 0 ? (
            <div className="flex justify-center py-8 text-gray-500">
              No sales data for the selected period
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedData?.periodSales.map(sale => (
                  <TableRow key={sale.period}>
                    <TableCell>{formatPeriod(sale.period)}</TableCell>
                    <TableCell>Rs {sale.revenue.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delivered Orders Table */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Delivered Orders</CardTitle>
          <CardDescription>
            Showing {filteredOrders.length} delivered orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8 text-gray-500">
              Loading sales data...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex justify-center py-8 text-gray-500">
              No delivered orders found
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.map(order => (
                    <TableRow key={order.orderID || order.id}>
                      <TableCell className="font-medium">
                        #{order.orderID || order.id || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {format(new Date(order.orderDate), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        {order.items.map(item => item.title).join(', ')}
                      </TableCell>
                      <TableCell>
                        {order.items.map(item => `${item.quantity}`).join(', ')}
                      </TableCell>
                      <TableCell>Rs {order.totalAmount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of{' '}
                  {filteredOrders.length} orders
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default VendorSalesReport;