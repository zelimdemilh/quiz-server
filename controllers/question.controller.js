const Question = require("../models/Question.model");
const Test = require("../models/Test.model");

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
      const questionToDelete = await Question.findById(req.params.id);
      if (!questionToDelete) {
        return res.status(404).json({ error: "Вопрос не найден" });
      }

      const testsWithQuestion = await Test.find({
        questions: { $in: [req.params.id] }
      });

      if (Array.isArray(testsWithQuestion) && testsWithQuestion.length > 0) {
        await Promise.all(
          testsWithQuestion.map((test) => {
            if (test && test._id) {
              return Test.findByIdAndUpdate(
                test._id,
                { $pull: { questions: req.params.id } },
                { new: true }
              );
            }
            return null;
          }).filter(Boolean)
        );
      }
      await Question.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Вопрос удален",
        affectedTests: Array.isArray(testsWithQuestion) ? testsWithQuestion.length : 0,
        testIds: Array.isArray(testsWithQuestion) ? testsWithQuestion.map(t => t._id.toString()) : []
      });

    } catch (e) {
      res.status(500).json({
        error: "Ошибка при удалении вопроса",
        details: e.message
      });
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
