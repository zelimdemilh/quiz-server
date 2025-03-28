const { clientController } = require("../controllers/client.controller");
const authMiddleware = require("../middleware/auth.middleware");

const { Router } = require("express");

const router = Router();

router.get("/", authMiddleware, clientController.getAllClients);
router.get('/:id', authMiddleware, clientController.getOneClient);
router.post("/signup", clientController.signUpClient);
router.post("/signIn", clientController.signIn);
router.delete("/", authMiddleware, clientController.deleteClient);
router.get("/signIn/refetch", authMiddleware, clientController.getClientByToken);

module.exports = router;
