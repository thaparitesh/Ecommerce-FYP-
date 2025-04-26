const Feature = require("../../models/Feature");

const addFeatureImage = async(req, res) => {
    try {
        const { image } = req.body;
        const featureImage = await Feature.create({ 
            image
        });

        res.status(201).json({
            success: true,
            data: featureImage
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const getFeatureImage = async(req, res) => {
    try {
        const images = await Feature.findAll({
            order: [['createdAt', 'DESC']] 
        });
        res.status(200).json({
            success: true,
            data: images
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const deleteFeatureImage = async(req, res) => {
    try {
        const { featureID } = req.params;
        
        const image = await Feature.findByPk(featureID);
        if (!image) {
            return res.status(404).json({
                success: false,
                message: "Image not found"
            });
        }

        await image.destroy();

        res.status(200).json({
            success: true,
            message: "Image deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

module.exports = { 
    addFeatureImage, 
    getFeatureImage, 
    deleteFeatureImage 
};