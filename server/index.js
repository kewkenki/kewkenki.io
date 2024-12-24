const express = require("express");
const app = express();
const QRCode = require("qrcode");
const generatePayload = require("promptpay-qr");
const bodyParser = require("body-parser");
const _ = require("lodash");
const core = require("cors");

app.use(core());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

app.post("/generateQR", (req, res) => {
  console.log("req.body", req.body, "Call generateQR");
  const amount = parseFloat(_.get(req, ["body", "amount"]));
  const mobile = _.get(req, ["body", "mobile"]);
  const payload = generatePayload(mobile, { amount });
  const option = {
    type: 'svg',
    color: {
      dark: "#000",
      light: "#FFF",
    },
  };

  QRCode.toString(payload, option, (err, url) => {
    if (err) return res.status(400).send(err);

    return res.status(200).json({
      url: url,
      RespMessage: "Generate QR Code Successfully",
      RespCode: 200,
    });
  });
});

module.exports = app;
