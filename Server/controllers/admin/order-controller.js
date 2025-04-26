const { Order, OrderItem } = require("../../models/OrderAssociations");
const { Cart, CartItem } = require("../../models/Cart");
const Product = require("../../models/Product");
const Address = require("../../models/Address");
const User = require("../../models/User");

const getAllOrdersFromAllUsers = async (req, res) => {
    try {
      
      const orders = await Order.findAll({
        include: [
          { 
            model: OrderItem, 
            as: 'items',
            attributes: ['orderItemID', 'productID', 'title', 'image', 'price', 'quantity', 'vendorID','orderDetailStatus']
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
          message: "No orders found for this user",
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

  const getOrderDetailsAdmin = async (req, res) => {
    try {
      const { id } = req.params;
  
      const order = await Order.findByPk(id, {
        include: [
          { 
            model: OrderItem, 
            as: 'items',
            include: [{
              model: Product,
              as: 'product',
              attributes: ['productID', 'title', 'image', 'price', 'category', 'brand', 'vendorID']
            }]
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
  
      // Format response
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
          vendorID: item.vendorID,
          orderDetailStatus: item.orderDetailStatus,
        }))
      };
  
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

  const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderStatus, paymentStatus } = req.body;

        const validStatusFlow = ['pending', 'processing', 'shipped', 'delivered'];
        
        // Validate status inputs
        if (orderStatus && !validStatusFlow.includes(orderStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }

        if (paymentStatus && !['pending', 'paid', 'refunded'].includes(paymentStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment status. Only 'pending', 'paid' or 'refunded' allowed"
            });
        }

        const order = await Order.findByPk(id, {
            include: [
                { 
                    model: OrderItem, 
                    as: 'items',
                    include: [{
                        model: Product,
                        as: 'product',
                        attributes: ['productID', 'title', 'image', 'price', 'category', 'brand', 'vendorID']
                    }]
                }
            ]
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // Handle order status update
        if (orderStatus) {
            // Prevent any order status changes for delivered orders
            if (order.orderStatus === 'delivered') {
                return res.status(400).json({
                    success: false,
                    message: "Order already delivered. Order status cannot be changed."
                });
            }

            const currentStatusIndex = validStatusFlow.indexOf(order.orderStatus);
            const newStatusIndex = validStatusFlow.indexOf(orderStatus);

            if (newStatusIndex < currentStatusIndex) {
                return res.status(400).json({
                    success: false,
                    message: `Cannot revert order status from ${order.orderStatus} to ${orderStatus}`
                });
            }

            await order.update({ orderStatus });
            
            await OrderItem.update(
                { orderDetailStatus: orderStatus },
                { where: { orderID: id } }
            );
        }

      
        if (paymentStatus) {
           
            if (order.orderStatus === 'delivered' && !['paid'].includes(paymentStatus)) {
                return res.status(400).json({
                    success: false,
                    message: "Delivered orders can only have 'paid' payment status"
                });
            }
            
            await order.update({ paymentStatus });
        }

        // Fetch updated order to return
        const updatedOrder = await Order.findByPk(id, {
            include: [
                { 
                    model: OrderItem, 
                    as: 'items',
                    include: [{
                        model: Product,
                        as: 'product',
                        attributes: ['productID', 'title', 'image', 'price', 'category', 'brand', 'vendorID']
                    }]
                }
            ]
        });

        res.status(200).json({
            success: true,
            message: "Order updated successfully",
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

// const updatePaymentStatus = async (req, res) => {
//   try {
//       const { id } = req.params;
//       const { paymentStatus } = req.body;

//       if (!['pending', 'paid'].includes(paymentStatus)) {
//           return res.status(400).json({
//               success: false,
//               message: "Invalid payment status. Only 'pending' or 'paid' allowed"
//           });
//       }

    
//       const order = await Order.findByPk(id);
      
//       if (!order) {
//           return res.status(404).json({
//               success: false,
//               message: "Order not found"
//           });
//       }

//       // Check if already paid
//       if (order.paymentStatus === 'paid') {
//           return res.status(400).json({
//               success: false,
//               message: "Payment already completed. No further changes allowed"
//           });
//       }

//       // Update status
//       await order.update({ paymentStatus, paymentMethod: 'COD' });

//       res.status(200).json({
//           success: true,
//           message: `Payment status updated to ${paymentStatus}`,
//           data: {
//               orderId: id,
//               paymentStatus
//           }
//       });

//   } catch (error) {
//       res.status(500).json({
//           success: false,
//           message: "Failed to update payment status",
//           error: error.message
//       });
//   }
// };

const getAdminSalesReports = async (req, res) => {
  try {
    
    const orders = await Order.findAll({
      include: [{
        model: OrderItem,
        as: 'items',
      }],
      where: {
        paymentStatus: 'paid'
      }
    });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: `No orders found for vendor`,
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
    getAllOrdersFromAllUsers,
    getOrderDetailsAdmin,
    updateOrderStatus,
    // updatePaymentStatus,
    getAdminSalesReports
  };