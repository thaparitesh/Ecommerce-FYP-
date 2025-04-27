const { Order, OrderItem } = require("../../models/OrderAssociations");
const { Cart, CartItem } = require("../../models/Cart");
const Product = require("../../models/Product");
const Address = require("../../models/Address");
const User = require("../../models/User");
const Vendor = require("../../models/Vendor");
const { Op } = require('sequelize');
const { format, startOfWeek, startOfMonth, startOfYear } = require('date-fns');



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
    const { startDate, endDate, granularity = 'day' } = req.query;

    // Default to last 30 days
    const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
    const end = endDate ? new Date(endDate) : new Date();

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format',
      });
    }

    if (start > end) {
      return res.status(400).json({
        success: false,
        message: 'Start date must be before end date',
      });
    }

    // Validate granularity
    const validGranularities = ['day', 'week', 'month', 'year'];
    if (!validGranularities.includes(granularity)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid granularity. Use day, week, month, or year.',
      });
    }

    // Fetch delivered orders
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          as: 'items',
          where: {
            vendorID,
            orderDetailStatus: 'delivered',
          },
          required: true,
        },
      ],
      where: {
        paymentStatus: 'paid',
        orderDate: {
          [Op.between]: [start, end],
        },
      },
    });

    // Filter orders where all items are delivered
    const deliveredOrders = orders.filter(order =>
      order.items.every(item => item.orderDetailStatus === 'delivered')
    );

    if (!deliveredOrders.length) {
      return res.status(404).json({
        success: false,
        message: `No delivered orders found for vendor ${vendorID}`,
      });
    }

    // Calculate total sales
    const totalSales = deliveredOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Group sales by granularity
    const periodSales = {};
    deliveredOrders.forEach(order => {
      let periodKey;
      const orderDate = new Date(order.orderDate);
      if (granularity === 'day') {
        periodKey = format(orderDate, 'yyyy-MM-dd');
      } else if (granularity === 'week') {
        periodKey = format(startOfWeek(orderDate, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      } else if (granularity === 'month') {
        periodKey = format(startOfMonth(orderDate), 'yyyy-MM');
      } else if (granularity === 'year') {
        periodKey = format(startOfYear(orderDate), 'yyyy');
      }
      periodSales[periodKey] = (periodSales[periodKey] || 0) + order.totalAmount;
    });

    // Response
    const response = {
      summary: {
        totalSales,
        orderCount: deliveredOrders.length,
      },
      periodSales: Object.keys(periodSales)
        .map(key => ({
          period: key,
          revenue: periodSales[key],
        }))
        .sort((a, b) => new Date(a.period) - new Date(b.period)),
      detailedOrders: deliveredOrders.map(order => ({
        orderID: order.orderID,
        orderDate: order.orderDate,
        totalAmount: order.totalAmount,
        items: order.items.map(item => ({
          productID: item.productID,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
        })),
      })),
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Sales report error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};


  module.exports = {
    getAllOrdersFromAllUsersForVendor,
    getOrderDetailsVendor,
    updateOrderStatus,
    getSalesReports
   
  };