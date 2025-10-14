require("dotenv").config();

const app = require("./app");
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.info(`Application runnin on port ${port}`);
});
