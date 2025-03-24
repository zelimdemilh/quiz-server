const { questionController } = require("../controllers/questionController");
const authMiddleware = require("../middleware/auth.middleware");

const { Router } = require("express");

const router = Router();

// Получить все вопросы
router.get("/", authMiddleware, questionController.getAllQuestions);

// Получить один вопрос по ID
router.get("/:id", authMiddleware, questionController.getOneQuestion);

// Создать новый вопрос
router.post("/", authMiddleware, questionController.createQuestion);

// Обновить вопрос
router.put("/:id", authMiddleware, questionController.updateQuestion);

// Удалить вопрос по ID
router.delete("/:id", authMiddleware, questionController.deleteQuestion);

module.exports = router;
