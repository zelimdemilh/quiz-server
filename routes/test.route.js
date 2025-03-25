const { testController } = require("../controllers/test.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { Router } = require("express");

const router = Router();

router.get("/", authMiddleware, testController.getAllTests);
router.get("/:id", authMiddleware, testController.getOneTest);
router.post("/", authMiddleware, testController.createTest);
router.put("/:id", authMiddleware, testController.updateTest);
router.delete("/:id", authMiddleware, testController.deleteTest);

module.exports = router;
