const express = require("express");
const app = express();
const server = require("http").createServer(app);

const dotenv = require("dotenv");
dotenv.config({ path: "./index.env" });

const Razorpay = require("razorpay");

var instance = new Razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret,
});

const cors = require("cors");
app.use(cors());

// app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  var options = {
    amount: 50 * 100, // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_1",
  };

  instance.orders.create(options, function (err, order) {
    //   console.log(order);
    res.status(200).json({ orderID: order });
  });
});

app.post("/payment", (req, res) => {
  console.log("requrest aayi hai");
  console.log(req.body);

  var options = {
    amount: teacher.fees * 100, // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_1",
  };

  instance.orders.create(options, function (err, order) {
    //   console.log(order);
    res.status(200).json({ orderID: order });
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, (err) => {
  if (!err) console.log("Successfully connectd to the port", PORT);
  else console.error("Failed to connect to server");
});
