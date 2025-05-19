const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
  passedTests: [
    {
      testId: { type: mongoose.Schema.Types.ObjectId, ref: "test" },
      score: Number,
      correctAnswers: Number,
      totalQuestions: Number,
      completedAt: { type: Date, default: Date.now }
    }
  ]
});

const Client = mongoose.model("client", clientSchema);
module.exports = Client;