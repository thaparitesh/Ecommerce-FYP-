const { Order, OrderItem } = require("../../models/OrderAssociations");
const { Cart, CartItem } = require("../../models/Cart");
const Product = require("../../models/Product");
const Address = require("../../models/Address");
const User = require("../../models/User");
const esewa = require("../../config/esewa");
const crypto = require("crypto");


const createOrder = async (req, res) => {
  try {
    const {
      userID,
      cartID,
      addressID,
      paymentMethod,
      totalAmount,
    } = req.body;

    // Validate required fields
    if (!userID || !cartID || !addressID || !paymentMethod || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Verify the address belongs to the user
    const address = await Address.findOne({
      where: { addressID, userID }
    });

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Invalid address for this user",
      });
    }

    // Get cart items with product details
    const cartItems = await CartItem.findAll({
      where: { cartID },
      include: [{ 
        model: Product, 
        as: 'product',
        attributes: ['productID', 'title', 'image', 'price', 'salePrice', 'totalStock','vendorID']
      }],
      order: [['createdAt', 'ASC']]
    });

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Validate product availability and calculate actual total
    let calculatedTotal = 0;
    for (const item of cartItems) {
      if (item.product.totalStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for product: ${item.product.title}`,
          productID: item.product.productID
        });
      }
      
      // Use sale price if available, otherwise regular price
      const itemPrice = item.product.salePrice > 0 ? 
                       item.product.salePrice : item.product.price;
      calculatedTotal += itemPrice * item.quantity;
    }

    // Validate total amount matches calculated total
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) { // Allow for rounding differences
      return res.status(400).json({
        success: false,
        message: "Cart total does not match calculated amount",
        calculatedTotal,
        receivedTotal: totalAmount
      });
    }

    // Create order
    const newOrder = await Order.create({
      userID,
      cartID,
      addressID,
      paymentMethod,
      totalAmount: calculatedTotal, // Use calculated total for safety
      orderStatus: "pending",
      paymentStatus: "pending",
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    });
    
    // Create order items
    const orderItems = await Promise.all(
      cartItems.map(item => 
        OrderItem.create({
          orderID: newOrder.orderID,
          productID: item.productID,
          title: item.product.title,
          image: item.product.image,
          price: item.product.salePrice > 0 ? item.product.salePrice : item.product.price,
          quantity: item.quantity,
          vendorID: item.product.vendorID,
          orderDetailStatus: "pending"
        })
      )
    );
   

    // For Esewa integration
    if (paymentMethod === "esewa") {
      try {
        const paymentData = {
          amount: totalAmount,
          taxAmount: 0,
          deliveryCharge: 0,
          total_amount: totalAmount,
          transaction_uuid: newOrder.orderID.toString(),
          productCode: process.env.ESEWA_PRODUCT_CODE,
          successUrl: `${process.env.FRONTEND_URL}/shop/payment/esewa-return`,
          failureUrl: `${process.env.FRONTEND_URL}/shop/payment/esewa-return`
        };
    
        const paymentForm = await esewa.generatePaymentForm(paymentData);
        
        await CartItem.destroy({ where: { cartID: newOrder.cartID } });

        return res.status(201).json({
          success: true,
          formAction: paymentForm.formAction,
          formData: paymentForm.formData,
          orderId: newOrder.orderID,
          requiresPayment: true
        });
      } catch (error) {
        await newOrder.update({ 
          orderStatus: "failed",
          paymentStatus: "failed",
          orderUpdateDate: new Date()
        });
        
        console.error("eSewa payment initiation error:", error);
        return res.status(500).json({
          success: false,
          message: "Failed to initiate eSewa payment",
          error: error.message
        });
      }
    }

  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

const verifyEsewaPayment = async (req, res) => {
  const {data} = req.query; 
  // console.log(data);
  
  if (!data) {
    return res.status(400).json({ 
      success: false, 
      message: "Missing payment data" 
    });
  }

  try {
    const verificationResult = await esewa.verifyPayment(data);

    if (!verificationResult.success) {
      return res.status(400).json({ 
        success: false, 
        message: verificationResult.message 
      });
    }

    const { amount, transaction_uuid, paymentID } = verificationResult.data;
        const order = await Order.findByPk(transaction_uuid, {
          include: [{
            model: OrderItem,
            as: 'items',
            attributes: ['productID', 'quantity']
          }]
        });
    
        if (!order) {
          return res.status(404).json({
            success: false,
            message: "Order not found",
          });
        }
    
        // Additional verification - amount matches
        // if (order.totalAmount != amount) {
        //   return res.status(400).json({
        //     success: false,
        //     message: "Payment amount does not match order total",
        //     orderAmount: order.totalAmount,
        //     paidAmount: amount
        //   });
        // }
        
        await Promise.all(
          order.items.map(async item => {
            await Product.decrement('totalStock', {
              by: item.quantity,
              where: { productID: item.productID }
            });

            
          })
        );
        
      
        await order.update({
          paymentStatus: "paid",
          orderStatus: "processing", 
          orderUpdateDate: new Date(),
          paymentId: paymentID
        });

        await OrderItem.update(
          { orderDetailStatus: "processing" },
          { 
            where: { 
              orderID: order.orderID 
            } 
          }
        );
    
        
        await CartItem.destroy({ where: { cartID: order.cartID } });
    
        res.status(200).json({
          success: true,
          message: "Payment verified and order confirmed",
          data: {
            orderId: order.orderID,
            amount : order.totalAmount,
            status: order.orderStatus,
            paymentStatus: order.paymentStatus,
            paymentId : paymentID,
            orderDetailStatus : order.items.orderDetailStatus
          },
        });
    
      } catch (error) {
        console.error("Payment verification error:", error);
        res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message
        });
      }
  };
    

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userID } = req.params;
   
    
    const orders = await Order.findAll({
      where: { userID },
      include: [
        { 
          model: OrderItem, 
          as: 'items',
          attributes: ['orderItemID', 'productID', 'title', 'image', 'price', 'quantity','vendorID','orderDetailStatus']
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


const getOrderDetails = async (req, res) => {
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
            attributes: ['productID', 'title', 'image', 'price', 'category', 'brand','vendorID']
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
        // orderDetailStatus: item.orderDetailStatus
      }))
    };

    res.status(200).json({
      success: true,
      data: formattedOrder,
    });

  } catch (error) {
    console.error("Get order details error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  verifyEsewaPayment,
  getAllOrdersByUser,
  getOrderDetails,
};