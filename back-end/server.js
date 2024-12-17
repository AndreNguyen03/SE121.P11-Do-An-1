import app from "./index.js";

const PORT = process.env.PORT || 3055;

const server = app.listen(PORT, () => {
  console.log(`server start with ${PORT}`);
});