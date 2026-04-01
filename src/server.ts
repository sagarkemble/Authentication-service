import app from "./app.js";
import "dotenv/config";

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running at ${PORT} `);
    });
  } catch (err) {
    console.error("Error starting server:", err);
  }
};

start();
