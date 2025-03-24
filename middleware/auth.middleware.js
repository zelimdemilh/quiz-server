const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res
      .status(401)
      .json({ error: "Ошибка авторизации(отстутвует headers)" });
  }
  const [type, token] = authorization.split(" ");
  if (type !== "Bearer") {
    return res
      .status(401)
      .json({ error: "Ошибка авторизации(неверный тип Bearer)" });
  }
  try {
    req.user = await jwt.verify(token, process.env.SECRET_JWT_KEY);
    next();
  } catch (e) {
    res.status(401).json({ error: "Неверный токен: " + e.toString() });
  }
};
