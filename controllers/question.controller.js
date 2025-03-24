const Question = require("../models/Question.model");

module.exports.questionController = {
  // Получить все вопросы
  getAllQuestions: async (req, res) => {
    try {
      const questions = await Question.find(); // Находим все вопросы
      res.status(200).json(questions); // Возвращаем все вопросы
    } catch (e) {
      res.status(400).json({ error: e.toString() });
    }
  },

  // Получить один вопрос по ID
  getOneQuestion: async (req, res) => {
    try {
      const question = await Question.findById(req.params.id); // Находим вопрос по ID
      if (!question) {
        return res.status(404).json({ error: "Вопрос не найден" });
      }
      res.status(200).json(question); // Возвращаем найденный вопрос
    } catch (e) {
      res.status(400).json({ error: e.toString() });
    }
  },

  // Удалить вопрос по ID
  deleteQuestion: async (req, res) => {
    try {
      const question = await Question.findByIdAndDelete(req.params.id); // Удаляем вопрос по ID
      if (!question) {
        return res.status(404).json({ error: "Вопрос не найден" });
      }
      res.status(200).json({ message: "Вопрос удален" }); // Возвращаем успешный ответ
    } catch (e) {
      res.status(400).json({ error: e.toString() });
    }
  },

  // Обновить вопрос (все поля)
  updateQuestion: async (req, res) => {
    const { questionText, options, correctAnswer, difficultyLevel } = req.body;

    try {
      const updatedQuestion = await Question.findByIdAndUpdate(
        req.params.id,
        {
          questionText,
          options,
          correctAnswer,
          difficultyLevel
        },
        { new: true } // new: true возвращает обновленный документ
      );

      if (!updatedQuestion) {
        return res.status(404).json({ error: "Вопрос не найден" });
      }

      res.status(200).json(updatedQuestion); // Возвращаем обновленный вопрос
    } catch (e) {
      res.status(400).json({ error: e.toString() });
    }
  },

  // Создать новый вопрос
  createQuestion: async (req, res) => {
    const { questionText, options, correctAnswer, difficultyLevel, createdBy } = req.body;

    try {
      const newQuestion = new Question({
        questionText,
        options,
        correctAnswer,
        difficultyLevel,
        createdBy
      });

      await newQuestion.save(); // Сохраняем новый вопрос в базе данных
      res.status(201).json(newQuestion); // Возвращаем созданный вопрос
    } catch (e) {
      res.status(400).json({ error: e.toString() });
    }
  }
};
