const express = require('express');
const router = express.Router();
const langgananController = require('../controller/langgananMembershipController');

const { checkCreateLangganan, validateIDLangganan } = require('../middleware/langgananMembershipValidator');

router
.get('/', langgananController.getAllLangganan)
.post('/', checkCreateLangganan, langgananController.createNewLangganan)
.put('/:idLangganan', validateIDLangganan, checkCreateLangganan, langgananController.updateLangganan)
.delete('/:idLangganan', validateIDLangganan, langgananController.deleteLangganan);

module.exports = router;