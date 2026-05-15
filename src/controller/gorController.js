const gorModel = require('../model/gor');

const getAllGors =  async (req, res) => {
    try{
        const [data] = await gorModel.getAllGors();
        res.json({
            success: true,
            message: 'get all gor',
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        })
    }
};

const createNewGor = async (req, res) => {
    try {
        console.log("mantap");
        console.log(req.body);
        await gorModel.createNewGor(req.body);
        res.json({
            message: 'create new gor',
            data: req.body
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
    }
};

const updateGor = async (req, res) => {
    const {idGor} = req.params;
    try {
        await gorModel.updateGor(idGor, req.body);
        res.json({
            success: true,
            message: 'gor updated successfully',
            data: req.body
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
    }
};

const deleteGor = async (req, res) => {
    const {idGor} = req.params;
    try {
        await gorModel.deleteGor(idGor);
        res.json({
            success: true,
            message: 'gor deleted successfully',
            data:  idGor 
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
    }
};

module.exports = {
    getAllGors,
    createNewGor,
    updateGor,
    deleteGor
}