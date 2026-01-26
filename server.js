const express = require("express");
require("dotenv").config();
const helmet = require("helmet")

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger/swagger.json");

const envelopRouter = require("./routes/envelopRouter");
const transactionRouter = require("./routes/transactionRoute"); // لو عندك الراوت
const userRouter = require("./routes/usersRoute")
const db = require("./models");
const incomeRouter = require("./routes/incomeRoute");
const expensesRouter = require("./routes/expensesRoute");
const  app = express();

 // adjust path





const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(helmet());

app.use("/api/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api", envelopRouter);
app.use("/api", transactionRouter); // لو عندك
app.use("/api", userRouter)
app.use("/api",incomeRouter)
app.use("/api",expensesRouter)

app.get("/",(req,res)=>{

  res.send("Welcome to my App of personal budget")
});

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("DB is connected");

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
})(); 


