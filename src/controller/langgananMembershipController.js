const langgananModel = require('../model/langgananMembership');

const getAllLangganan = async (req, res) => {
    try {
        const [data] = await langgananModel.getAllLangganan();
        res.json({
            success: true,
            message: 'Berhasil mengambil seluruh data riwayat langganan membership',
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data langganan membership',
            error: error.message
        });
    }
}

const createNewLangganan = async (req, res) => {
    try {
        await langgananModel.createNewLangganan(req.body);
        res.status(201).json({
            success: true,
            message: 'Data langganan membership baru berhasil diajukan',
            data: req.body
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal memproses pengajuan langganan membership',
            error: error.message
        });
    }
}

const updateLangganan = async (req, res) => {
    const { idLangganan } = req.params;
    try {
        await langgananModel.updateLangganan(idLangganan, req.body);
        res.json({
            success: true,
            message: 'Status/Data langganan membership berhasil diperbarui',
            data: {
                id_langganan: idLangganan,
                ...req.body
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui data langganan membership',
            error: error.message
        });
    }
}

const deleteLangganan = async (req, res) => {
    const { idLangganan } = req.params;
    try {
        await langgananModel.deleteLangganan(idLangganan);
        res.json({
            success: true,
            message: 'Kontrak langganan membership berhasil dihapus dari database',
            data: idLangganan
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus data langganan membership',
            error: error.message
        });
    }
}

const getLanggananUser = async (req, res) => {
    const idPengguna = req.user.id_pengguna; // Diambil dari JWT
    
    try {
        const [data] = await langgananModel.getLanggananByUserId(idPengguna);
        res.json({
            success: true,
            message: 'Berhasil mengambil data langganan membership kamu',
            data: data
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data langganan', error: error.message });
    }
};

module.exports = {
    getAllLangganan,
    createNewLangganan,
    updateLangganan,
    deleteLangganan,
    getLanggananUser
};