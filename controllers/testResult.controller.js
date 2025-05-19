const Client = require("../models/Client.model");
const Test = require("../models/Test.model");
const TestResult = require("../models/TestResult.model");

module.exports = {
  saveTestResult: async (req, res) => {
    try {
      const { testId, answers } = req.body;
      const userId = req.user.userId;

      // Получаем тест с вопросами
      const test = await Test.findById(testId).populate("questions");
      if (!test) {
        return res.status(404).json({ error: "Test not found" });
      }

      // Проверяем, не проходил ли пользователь тест ранее
      const existingResult = await TestResult.findOne({ userId, testId });
      if (existingResult) {
        return res.status(400).json({ error: "Test already completed" });
      }

      // Проверяем ответы и считаем результат
      let correctAnswers = 0;
      const detailedAnswers = await Promise.all(
        test.questions.map(async (question) => {
          const userAnswer = answers.find(
            (a) => a.questionId.toString() === question._id.toString()
          );
          const isCorrect = userAnswer && userAnswer.selectedOption === question.correctAnswer;
          if (isCorrect) correctAnswers++;

          return {
            questionId: question._id,
            selectedOption: userAnswer?.selectedOption || null,
            isCorrect
          };
        })
      );

      const score = Math.round((correctAnswers / test.questions.length) * 100);

      // Сохраняем детализированный результат
      const testResult = new TestResult({
        userId,
        testId,
        answers: detailedAnswers,
        score
      });
      await testResult.save();

      // Добавляем запись в профиль пользователя
      await Client.findByIdAndUpdate(userId, {
        $push: {
          passedTests: {
            testId,
            score,
            correctAnswers,
            totalQuestions: test.questions.length
          }
        }
      });

      res.status(201).json({
        success: true,
        score,
        correctAnswers,
        totalQuestions: test.questions.length
      });
    } catch (e) {
      res.status(500).json({ error: e.toString() });
    }
  },

  updateTestProgress: async (req, res) => {
    try {
      const { testId, questionId, selectedOption } = req.body;
      const userId = req.user.userId;

      // Находим или создаем запись о прохождении
      let testResult = await TestResult.findOne({ userId, testId });

      if (!testResult) {
        testResult = new TestResult({
          userId,
          testId,
          answers: [],
          score: 0
        });
      }

      // Обновляем/добавляем ответ
      const question = await Question.findById(questionId);
      const isCorrect = selectedOption === question.correctAnswer;

      const answerIndex = testResult.answers.findIndex(a =>
        a.questionId.equals(questionId)
      );

      if (answerIndex >= 0) {
        testResult.answers[answerIndex] = { questionId, selectedOption, isCorrect };
      } else {
        testResult.answers.push({ questionId, selectedOption, isCorrect });
      }

      // Пересчитываем прогресс
      const correctCount = testResult.answers.filter(a => a.isCorrect).length;
      testResult.score = Math.round((correctCount / test.questions.length) * 100);

      await testResult.save();
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.toString() });
    }
  },

  getUserResults: async (req, res) => {
    try {
      const results = await TestResult.find({ userId: req.user.userId })
        .populate("testId", "title description")
        .sort({ completedAt: -1 });
      res.json(results);
    } catch (e) {
      res.status(500).json({ error: e.toString() });
    }
  }
};