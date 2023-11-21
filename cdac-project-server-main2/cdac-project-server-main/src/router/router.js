const router = require("express").Router();
var usersRoutes = require("../components/user/user.routes");
var electionRoutes = require("../components/election/election.routes");

router.use("/api/user", usersRoutes);
router.use("/api/election", electionRoutes);
router.get("*", function (req, res) {
  res.send("not found");
});
module.exports = router;
