const adminDashboardModel = require('../model/adminDashboard');

const getDashboardStats = async (req, res) => {
    try {
        const stats = await adminDashboardModel.getDashboardStats();
        res.json({
            success: true,
            message: 'Berhasil mengambil data statistik analitik dashboard admin',
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data statistik dashboard',
            error: error.message
        });
    }
};

module.exports = { getDashboardStats };