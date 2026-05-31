const gorModel = require('../model/gor');
const dbPool = require('../config/db');
const fs = require('fs');
const path = require('path');

const getAllGors = async (req, res) => {
    try {
        const [data] = await gorModel.getAllGors();
        res.json({ success: true, message: 'Berhasil mengambil seluruh data GOR', data: data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data GOR', error: error.message });
    }
};

const createNewGor = async (req, res) => {
    try {
        const payload = { ...req.body };
        if (req.file) {
            payload.foto_gor = req.file.filename;
        }

        await gorModel.createNewGor(payload);
        res.status(201).json({ success: true, message: 'GOR baru berhasil ditambahkan', data: payload });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menambahkan GOR baru', error: error.message });
    }
};

const updateGor = async (req, res) => {
    const { idGor } = req.params;
    try {
        const payload = { ...req.body };

        if (req.file) {
            payload.foto_gor = req.file.filename;

            const [oldData] = await dbPool.execute('SELECT foto_gor FROM gor WHERE id_gor = ?', [idGor]);
            
            if (oldData.length > 0 && oldData[0].foto_gor) {
                const fileNameOnly = path.basename(oldData[0].foto_gor);
                
                const oldImagePath = path.join(__dirname, '../../public/uploads/gor', fileNameOnly);
                
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        await gorModel.updateGor(idGor, payload);
        res.json({ success: true, message: 'Data GOR berhasil diperbarui', data: { id_gor: idGor, ...payload } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal memperbarui data GOR', error: error.message });
    }
};

const deleteGor = async (req, res) => {
    const { idGor } = req.params;
    try {
        const [oldData] = await dbPool.execute('SELECT foto_gor FROM gor WHERE id_gor = ?', [idGor]);
        
        if (oldData.length > 0 && oldData[0].foto_gor) {
            const fileNameOnly = path.basename(oldData[0].foto_gor);
            
            const oldImagePath = path.join(__dirname, '../../public/uploads/gor', fileNameOnly);
            
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        await gorModel.deleteGor(idGor);
        res.json({ success: true, message: 'Data GOR beserta file fotonya berhasil dihapus', data: idGor });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menghapus data GOR', error: error.message });
    }
};

module.exports = {
    getAllGors,
    createNewGor,
    updateGor,
    deleteGor
};