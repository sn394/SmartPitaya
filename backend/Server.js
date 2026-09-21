const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

/* Health Check */
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "SmartPitaya Node backend running"
  });
});

app.listen(PORT, () => {
  console.log(`Node backend running on http://localhost:${PORT}`);
});
