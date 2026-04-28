import router from "express";

export const authRouter = router();
authRouter.get("/", (req, res) => {
  res.json("hi");
});
