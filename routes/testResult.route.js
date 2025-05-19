const { Router } = require("express");
const { testResultController } = require("../controllers/testResult.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = Router();

router.post("/", authMiddleware, testResultController.saveTestResult);
router.get("/", authMiddleware, testResultController.getUserResults);

module.exports = router;