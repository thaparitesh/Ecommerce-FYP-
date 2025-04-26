const { imageUploadUtil } = require("../../config/cloudinary");
const Product = require("../../models/Product");

const handleImageUpload = async(req, res)=>{
    try {
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const url = 'data:' + req.file.mimetype + ';base64,' + b64;
        const result = await imageUploadUtil(url);
        res.json({
            success: true,
            result,
        })
        
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message : 'Error occured'
        })
        
    }
}

const addProduct = async (req, res) => {
    try {
      const { image, title, description, category, brand, price, 
             salePrice, totalStock, averageReview, vendorID , status} = req.body;
  
      const newlyCreatedProduct = await Product.create({
        image,
        title, 
        description,
        category,
        brand,
        price,
        salePrice,
        totalStock,
        averageReview,
        vendorID ,
        status
      });
  
      res.status(201).json({
        success: true,
        data: newlyCreatedProduct,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "Error occurred",
      });
    }
  };

  const fetchAllProducts = async (req, res) => {
    try {
      const {vendorID} = req.params;

      const listOfProducts = await Product.findAll({
        where: { vendorID } 
      });
  
      res.status(200).json({
        success: true,
        data: listOfProducts,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "Error occurred",
      });
    }
};




const editProduct = async (req, res) => {
    try {
      const { id } = req.params; 
      const { 
        image, 
        title, 
        description, 
        category, 
        brand, 
        price, 
        salePrice, 
        totalStock, 
        averageReview,
        vendorID,
        status , 
      } = req.body;

      console.log(status, "status");
      
  
      const product = await Product.findOne({
        where: { 
          productID: id,
          vendorID 
        }
      });
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found or not owned by this vendor",
        });
      }
  
      
      const updates = {
        title: title || product.title,
        description: description || product.description,
        category: category || product.category,
        brand: brand || product.brand,
        price: price === "" ? 0 : price || product.price,
        salePrice: salePrice === "" ? 0 : salePrice || product.salePrice,
        totalStock: totalStock || product.totalStock,
        image: image || product.image,
        averageReview: averageReview || product.averageReview,
        status: status || product.status 
      };
  
      await product.update(updates);
      
      res.status(200).json({
        success: true,
        data: product,
        message: "Product updated successfully"
      });
    } catch (e) {
      console.error("Error editing product:", e);
      res.status(500).json({
        success: false,
        message: "Error occurred while updating product"
      });
    }
  };

const deleteProduct = async (req, res) => {
  try {
    const { id, vendorID } = req.params;
    const product = await Product.destroy({
      where: { productID: id, vendorID },
    });

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};



module.exports = {handleImageUpload, addProduct,  fetchAllProducts,editProduct,deleteProduct,
};