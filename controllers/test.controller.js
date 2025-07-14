const Test = require("../models/Test.model");
const Client = require("../models/Client.model");

module.exports.testController = {
  getAllTests: async (req, res) => {
    try {
      const tests = await Test.find().populate("questions");
      const user = await Client.findById(req.user.userId);

      const testsWithStatus = tests.map(test => ({
        ...test.toObject(),
        isPassed: user.passedTests.some(t => t.testId.equals(test._id))
      }));

      res.status(200).json(testsWithStatus);
    } catch (e) {
      res.status(400).json({ error: e.toString() });
    }
  },

  getOneTest: async (req, res) => {
    try {
      const test = await Test.findById(req.params.id).populate("questions");
      if (!test) {
        return res.status(404).json({ error: "Тест не найден" });
      }
      res.status(200).json(test);
    } catch (e) {
      res.status(400).json({ error: e.toString() });
    }
  },

  createTest: async (req, res) => {
    const { title, description, questions, createdBy } = req.body;

    try {
      const newTest = new Test({
        title,
        description,
        questions,
        createdBy,
      });

      await newTest.save();
      res.status(201).json(newTest);
    } catch (e) {
      res.status(400).json({ error: e.toString() });
    }
  },

  updateTest: async (req, res) => {
    const { title, description, questions } = req.body;

    try {
      const updatedTest = await Test.findByIdAndUpdate(
        req.params.id,
        { title, description, questions },
        { new: true }
      ).populate("questions");

      if (!updatedTest) {
        return res.status(404).json({ error: "Тест не найден" });
      }

      res.status(200).json(updatedTest);
    } catch (e) {
      res.status(400).json({ error: e.toString() });
    }
  },

  deleteTest: async (req, res) => {
    try {
      const test = await Test.findByIdAndDelete(req.params.id);
      if (!test) {
        return res.status(404).json({ error: "Тест не найден" });
      }
      res.status(200).json({ message: "Тест удален" });
    } catch (e) {
      res.status(400).json({ error: e.toString() });
    }
  },
};
