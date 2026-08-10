"use strict";

var express = require("express");
var router = express.Router();
var fs = require("fs");
var os = require("os");

// Middleware для логирования времени (сохраняем оригинальное поведение)
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date());
  next();
});

// Основной роут
router.get("/metadata", function (req, res) {
  console.log("[GET /location/metadata] - Reading via Downward API");

  var cloud = "unknown";
  var zone = "unknown";
  var h = os.hostname(); // Имя пода берем напрямую из ОС

  try {
    var providerPath = "/etc/node-info/provider";
    var zonePath = "/etc/node-info/zone";

    // 1. Безопасно определяем облако (ожидаем строку вида "aws:///...")
    if (fs.existsSync(providerPath)) {
      var providerStr = fs.readFileSync(providerPath, "utf8").trim();
      if (providerStr.toLowerCase().indexOf("aws") !== -1) {
        cloud = "AWS";
      } else if (providerStr) {
        cloud = providerStr.split(":")[0].toUpperCase(); // На случай другого провайдера
      }
    }

    // 2. Безопасно читаем зону (ожидаем строку вида "eu-central-1a")
    if (fs.existsSync(zonePath)) {
      zone = fs.readFileSync(zonePath, "utf8").trim();
    }
  } catch (err) {
    console.error("Safe Metadata Reader Error: ", err.message);
  }

  console.log(`CLOUD: ${cloud}`);
  console.log(`ZONE: ${zone}`);
  console.log(`HOST: ${h}`);

  // Отправляем JSON обратно на фронтенд в функцию ajaxGetCloudMetadata()
  res.json({
    cloud: cloud,
    zone: zone,
    host: h,
  });
});

module.exports = router;
