const express = require("express");
const app = express();
const QRCode = require("qrcode");
const generatePayload = require("promptpay-qr");
const bodyParser = require("body-parser");
const _ = require("lodash");
const cors = require("cors");
const path = require("path");
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ให้ express สามารถให้บริการไฟล์ในโฟลเดอร์ public
app.use(express.static(path.join(__dirname, '../public')));
console.log(path.join(__dirname, '../public'));

const server = app.listen(port, () => {
  console.log("Server is running on port 3001");
});


// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post("/generateQR", async (req, res) => {
  try {
    console.log("req.body", req.body, "Call generateQR");

    const amount = parseFloat(_.get(req, ["body", "amount"]));
    const mobile = _.get(req, ["body", "mobile"]);

    // Check if amount and mobile are provided
    if (!amount || !mobile) {
      return res.status(400).json({
        RespMessage: "Amount and Mobile are required fields.",
        RespCode: 400,
      });
    }

    // Generate PromptPay payload
    const payload = generatePayload(mobile, { amount });

    // QR code options
    const option = {
      type: "svg",
      color: {
        dark: "#000",
        light: "#FFF",
      },
    };

    // Generate QR code
    const url = await QRCode.toString(payload, option);

    // Send success response
    return res.status(200).json({
      url: url,
      RespMessage: "Generate QR Code Successfully",
      RespCode: 200,
    });
  } catch (err) {
    console.error("Error generating QR Code:", err);
    return res.status(500).json({
      RespMessage: "An error occurred while generating the QR Code.",
      RespCode: 500,
    });
  }
});

module.exports = app;
