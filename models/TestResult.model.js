const mongoose = require("mongoose");

const testResultSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "client", required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: "test", required: true },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "question" },
      selectedOption: String,
      isCorrect: Boolean
    }
  ],
  score: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now }
});

const TestResult = mongoose.model("testResult", testResultSchema);
module.exports = TestResult;