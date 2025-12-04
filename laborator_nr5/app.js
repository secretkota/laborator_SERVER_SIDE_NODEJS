import express from "express";
import productRoutes from "./routes/product.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import webhookReceiver from "./routes/webhook.receiver.routes.js";
const app = express();


app.use((req, res, next) => {
  const start = Date.now();
  console.log(`[REQ] ${req.method} ${req.url}`);
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`[RES] ${req.method} ${req.url} -> ${res.statusCode} (${ms}ms)`);
  });
  next();
});


app.use(express.json());
app.use(express.static("public"));

app.use("/products", productRoutes);
app.use("/webhooks", webhookRoutes);
app.use("/webhook-receiver", webhookReceiver);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
