import http from "http";
import "dotenv/config";
import { app } from "./app.js";

async function main() {
  const PORT = process.env.PORT ?? 3000;
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
  });
}
main().catch((err) => {
  console.error(err.message);
});
