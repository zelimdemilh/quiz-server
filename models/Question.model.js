const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
  questionText: {
    type: String,
    required: true,  // Обязательное поле для текста вопроса
  },
  options: [{
    type: String,
    required: true,
  }],
  correctAnswer: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Question = mongoose.model("question", questionSchema);

module.exports = Question;
