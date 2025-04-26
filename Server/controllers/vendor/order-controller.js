const { Order, OrderItem } = require("../../models/OrderAssociations");
const { Cart, CartItem } = require("../../models/Cart");
const Product = require("../../models/Product");
const Address = require("../../models/Address");
const User = require("../../models/User");
const Vendor = require("../../models/Vendor");


const getAllOrdersFromAllUsersForVendor = async (req, res) => {
  try {
      const { vendorID } = req.params;
      
      console.log(vendorID,"vendorID");
      
      
      const orders = await Order.findAll({
          include: [
              { 
                  model: OrderItem, 
                  as: 'items',
                  where: { vendorID }, 
                  required: true, 
                  attributes: ['orderItemID', 'productID', 'title', 'image', 'price', 'quantity', 'vendorID', 'orderDetailStatus']
              },
              { 
                  model: Address, 
                  as: 'address',
                  attributes: ['addressID', 'address', 'city', 'phoneNumber', 'notes']
              }
          ],
          order: [['orderDate', 'DESC']]
      });

      if (!orders.length) {
          return res.status(404).json({
              success: false,
              message: `No orders found for vendor ${vendorID}`,
          });
      }

      res.status(200).json({
          success: true,
          count: orders.length,
          data: orders,
      });

  } catch (error) {
      console.error("Get orders error:", error);
      res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message
      });
  }
};
const getOrderDetailsVendor = async (req, res) => {
  try {
    const { id, vendorID } = req.params;

    const order = await Order.findByPk(id, {
      include: [
        { 
          model: OrderItem, 
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['productID', 'title', 'image', 'price', 'category', 'brand', 'vendorID'],
              where: { vendorID } 
            },
            {
              model: Vendor,
              as: 'vendor',
              attributes: ['vendorID', 'businessName', 'email', 'phone']
            }
          ]
        },
        { 
          model: Address, 
          as: 'address',
          attributes: ['addressID', 'address', 'city', 'phoneNumber', 'notes']
        },
        { 
          model: User, 
          as: 'user', 
          attributes: ['userID', 'userName', 'email', 'phoneNumber']
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!order.items || order.items.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No items found for this vendor in the order",
      });
    }

    
    const formattedOrder = {
      orderID: order.orderID,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      totalAmount: order.totalAmount,
      orderDate: order.orderDate,
      orderUpdateDate: order.orderUpdateDate,
      paymentId: order.paymentId,
      user: order.user,
      address: order.address,
      items: order.items.map(item => ({
        orderItemID: item.orderItemID,
        productID: item.productID,
        title: item.title,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        product: item.product,
        vendor: item.vendor, 
        orderDetailStatus: item.orderDetailStatus
      }))
    };

    const vendorSubtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    formattedOrder.vendorSubtotal = vendorSubtotal;

    res.status(200).json({
      success: true,
      data: formattedOrder,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

const updateOrderStatus = async(req, res) => {
  try {
      const {id, vendorID} = req.params;
      const {orderDetailStatus} = req.body;

      const validStatusFlow = ['pending', 'processing', 'shipped'];

      const orderItems = await OrderItem.findAll({
          where: { 
              orderID: id,
              vendorID 
          },
          include: [
              {
                  model: Product,
                  as: 'product',
                  attributes: ['productID', 'title', 'image', 'price', 'category', 'brand', 'vendorID']
              },
              {
                  model: Vendor,
                  as: 'vendor',
                  attributes: ['vendorID', 'businessName', 'email', 'phone']
              }
          ]
      });

      if (!orderItems || orderItems.length === 0) {
          return res.status(403).json({
              success: false,
              message: "No items found for this vendor in the order",
          });
      }

      const alreadyDelivered = orderItems.some(item => item.orderDetailStatus === 'delivered');
      if (alreadyDelivered) {
          return res.status(400).json({
              success: false,
              message: "Order already delivered. Status cannot be changed."
          });
      }

      for (const item of orderItems) {
          const currentStatusIndex = validStatusFlow.indexOf(item.orderDetailStatus);
          const newStatusIndex = validStatusFlow.indexOf(orderDetailStatus);

          if (newStatusIndex < currentStatusIndex) {
              return res.status(400).json({
                  success: false,
                  message: `Cannot revert order status from ${item.orderDetailStatus} to ${orderDetailStatus}`
              });
          }
      }

      await OrderItem.update(
          { orderDetailStatus },
          { 
              where: { 
                  orderID: id,
                  vendorID 
              }
          }
      );
      const updatedOrder = await Order.findByPk(id, {
          include: [
              { 
                  model: OrderItem, 
                  as: 'items',
                  include: [
                      {
                          model: Product,
                          as: 'product'
                      },
                      {
                          model: Vendor,
                          as: 'vendor'
                      }
                  ]
              },
              { 
                  model: Address, 
                  as: 'address'
              },
              { 
                  model: User, 
                  as: 'user'
              }
          ]
      });

      res.status(200).json({
          success: true,
          message: "Order status updated successfully",
          data: updatedOrder
      });

  } catch (error) {
      res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message
      });
  }
}

const getSalesReports = async (req, res) => {
  try {
    const { vendorID } = req.params;
    
    // Get orders for this vendor
    const orders = await Order.findAll({
      include: [{
        model: OrderItem,
        as: 'items',
        where: { vendorID },
        required: true
      }],
      where: {
        paymentStatus: 'paid'
      }
    });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: `No orders found for vendor ${vendorID}`,
      });
    }

    // Calculate total sales
    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Last 30 days sales
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentSales = orders
      .filter(order => new Date(order.orderDate) >= thirtyDaysAgo)
      .reduce((sum, order) => sum + order.totalAmount, 0);

    // Group by date for last 30 days
    const dailySales = {};
    orders.forEach(order => {
      if (new Date(order.orderDate) >= thirtyDaysAgo) {
        const dateStr = order.orderDate.toISOString().split('T')[0];
        dailySales[dateStr] = (dailySales[dateStr] || 0) + order.totalAmount;
      }
    });

    // Get top products
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.productID]) {
          productSales[item.productID] = {
            title: item.title,
            totalQuantity: 0,
            totalRevenue: 0
          };
        }
        productSales[item.productID].totalQuantity += item.quantity;
        productSales[item.productID].totalRevenue += (item.price * item.quantity);
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5);

    // Order status counts
    const statusCounts = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0
    };

    orders.forEach(order => {
      order.items.forEach(item => {
        statusCounts[item.orderDetailStatus] = 
          (statusCounts[item.orderDetailStatus] || 0) + 1;
      });
    });

    // Format the response
    const response = {
      summary: {
        totalSales,
        periodSales: recentSales,
        orderCount: orders.length
      },
      periodSales: Object.keys(dailySales).map(date => ({
        date,
        revenue: dailySales[date]
      })).sort((a, b) => new Date(a.date) - new Date(b.date)),
      topProducts,
      orderStatusCounts: statusCounts
    };

    res.status(200).json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error("Sales report error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

  module.exports = {
    getAllOrdersFromAllUsersForVendor,
    getOrderDetailsVendor,
    updateOrderStatus,
    getSalesReports
   
  };