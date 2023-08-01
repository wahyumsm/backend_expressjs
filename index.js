import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import SequelizeStore from "connect-session-sequelize";
import db from "./config/Database.js";
import UserRoute from "./routes/UserRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import AuthRoute from "./routes/AuthRoute.js";

dotenv.config();
const app = express();
//UNTUK SESSION GA KELUAR
const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
  db: db,
});
//UNTUK SESSION LOGOUT
// UNTUK MENGENARATE TABEL SECARA OTOMATIS
(async () => {
  await db.sync();
})();
app.use(
  session({
    secret: process.env.SESS_SECRET,
    secret: "secret_key",
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: "auto",
    },
  })
);
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

// MIDDLEWARE
app.use(express.json());
app.use(UserRoute);
app.use(ProductRoute);
app.use(AuthRoute);
// membuat tabel session
store.sync();
const port = process.env.APP_PORT || 3000;
app.listen(port, () => {
  console.log(`Server up and running on port ${port}`);
});
