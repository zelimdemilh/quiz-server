const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
  questionText: {
    type: String,
    required: true,  // Обязательное поле для текста вопроса
  },
  options: [{
    type: String,  // Массив строк для вариантов ответов
    required: true,  // Обязательное поле для вариантов ответа
  }],
  correctAnswer: {
    type: String,
    required: true,  // Обязательное поле для правильного ответа
  },
  createdAt: {
    type: Date,
    default: Date.now,  // Время создания вопроса
  },
});

const Question = mongoose.model("question", questionSchema);

module.exports = Question;
