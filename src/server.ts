import "dotenv/config";
import app from "./app.js";
import connectDb from "./common/config/db.config.js";

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Server is running at ${PORT} `);
    });
  } catch (err) {
    console.error("Error starting server:", err);
  }
};

start();
