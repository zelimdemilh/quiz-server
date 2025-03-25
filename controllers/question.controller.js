const Question = require("../models/Question.model");

module.exports.questionController = {
  getAllQuestions: async (req, res) => {
    try {
      const questions = await Question.find();
      res.status(200).json(questions);
    } catch (e) {
      res.status(400).json({ error: e.toString() });
    }
  },
  getOneQuestion: async (req, res) => {
    try {
      const question = await Question.findById(req.params.id);
      if (!question) {
        return res.status(404).json({ error: "Вопрос не найден" });
      }
      res.status(200).json(question);
    } catch (e) {
      res.status(400).json({ error: e.toString() });
    }
  },
  deleteQuestion: async (req, res) => {
    try {
      const question = await Question.findByIdAndDelete(req.params.id);
      if (!question) {
        return res.status(404).json({ error: "Вопрос не найден" });
      }
      res.status(200).json({ message: "Вопрос удален" });
    } catch (e) {
      res.status(400).json({ error: e.toString() });
    }
  },
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
        { new: true }
      );

      if (!updatedQuestion) {
        return res.status(404).json({ error: "Вопрос не найден" });
      }

      res.status(200).json(updatedQuestion);
    } catch (e) {
      res.status(400).json({ error: e.toString() });
    }
  },
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

      await newQuestion.save();
      res.status(201).json(newQuestion);
    } catch (e) {
      res.status(400).json({ error: e.toString() });
    }
  }
};
