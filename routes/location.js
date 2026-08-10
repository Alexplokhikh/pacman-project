"use strict";

var express = require("express");
var router = express.Router();
var os = require("os");

router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date());
  next();
});

router.get("/metadata", function (req, res) {
  console.log("[GET /location/metadata] - Reading via Env Variables");

  // Читаем переменные, которые мы настроим в манифесте Deployment
  var cloud = process.env.CLOUD_PROVIDER || "AWS";
  var zone = process.env.AWS_ZONE || "unknown";
  var h = os.hostname();

  console.log(`CLOUD: ${cloud}`);
  console.log(`ZONE: ${zone}`);
  console.log(`HOST: ${h}`);

  res.json({
    cloud: cloud,
    zone: zone,
    host: h,
  });
});

module.exports = router;
