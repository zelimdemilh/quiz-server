const { questionController } = require("../controllers/question.controller");
const authMiddleware = require("../middleware/auth.middleware");

const { Router } = require("express");

const router = Router();

router.get("/", authMiddleware, questionController.getAllQuestions);
router.get("/:id", authMiddleware, questionController.getOneQuestion);
router.post("/", authMiddleware, questionController.createQuestion);
router.put("/:id", authMiddleware, questionController.updateQuestion);
router.delete("/:id", authMiddleware, questionController.deleteQuestion);

module.exports = router;
