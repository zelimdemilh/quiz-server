const { Router } = require("express");

const router = Router();

router.use("/client", require("./client.route"));
router.use("/question", require("./question.route"));
router.use("/test", require("./test.route"));
router.use("/results", require("./testResult.route"));

module.exports = router;
