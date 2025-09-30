const router = require("express").Router();
const connectDb2 = require("../config/db2");
const {
  getNegotiation,
  updateNegotiationCollaborator,
  updateNegotiationSupplierArray,
  getNegotiationArray,
} = require("../controllers/db2Controller");
const { uploadDocument } = require("../controllers/documentController");

router.post("/getNegotiation", getNegotiation);
router.post("/updateNegotiationCollaborator", updateNegotiationCollaborator);
// router.post("/updateNegotiationCollaboratorArray", updateNegotiationCollaboratorArray);
// router.post("/updateNegotiationSupplier", updateNegotiationSupplier);
router.post("/updateNegotiationSupplierArray", updateNegotiationSupplierArray);
router.post("/createNewReport", uploadDocument);
router.post("/getNegotiationArray", getNegotiationArray);

module.exports = router;
