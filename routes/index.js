const { Router } = require("express");

const router = Router();

router.use("/client", require("./client.route"));
router.use("/question", require("./question.route"));

module.exports = router;
