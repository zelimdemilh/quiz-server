const { Router } = require("express");

const router = Router();

router.use("/client", require("./client.route"));

module.exports = router;
