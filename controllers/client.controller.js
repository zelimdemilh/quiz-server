const Client = require("../models/Client.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.clientController = {
  getAllClients: async (req, res) => {
    try {
      const responce = await Client.find();
      res.status(200).json(responce);
    } catch (e) {
      res.status(400).json({ error: e.toString() });
    }
  },

  getOneClient: async (req, res) => {
    try {
      const client = await Client.findById(req.params.id);
      res.json(client);
    } catch (err) {
      res.json(500).json(err);
    }
  },

  deleteClient: async (req, res) => {
    try {
      await Client.findByIdAndDelete(req.params.id);
      res.status(200).json("Клиент удален");
    } catch (e) {
      res.json({ error: e.toString() });
    }
  },

  signUpClient: async (req, res) => {
    const { firstname, lastname, role, username, password } = req.body;
    const hash = await bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS));
    let candidate = await Client.findOne({username});

    if(candidate) {
      return res.status(409).json({error: 'Логин уже занят'})
    }

    try {
      await Client.create({
        firstname,
        lastname,
        role,
        username,
        password: hash,
      });
      res.status(200).json("Пользователь добавлен");
    } catch (e) {
      res.status(400).json({ error: e.toString() });
    }
  },

  getClientByToken: async (req, res) => {
    const clientId = req.user.userId;

    try {
      const clientCurrent = await Client.findById(clientId);
      res.json({firstname: clientCurrent.firstname,
        lastname: clientCurrent.lastname,
        id: clientCurrent._id,
        role: clientCurrent.role});
    } catch (e) {
      res.json({ error: e.toString() });
    }
  },

  signIn: async (req, res) => {
    const { username, password } = req.body;
    try {
      let candidate;

      if (!candidate) {
        candidate = await Client.findOne({ username });
      }
      if (!candidate) {
        return res
          .status(401)
          .json({ error: "Неверные логин или пароль (логин)" });
      }
      const valid = await bcrypt.compare(password, candidate.password);

      if (!valid) {
        return res
          .status(401)
          .json({ error: "Неверные логин или пароль (пароль)" });
      }
      const payload = {
        userId: candidate._id,
        role: candidate.role
      };

      token = await jwt.sign(payload, process.env.SECRET_JWT_KEY, {
        expiresIn: "1d"
      });
      res.json({ token, id: candidate._id, role: candidate.role });
    } catch (e) {
      res.json({ error: e.toString() });
    }
  }
};
