import express from "express";
import path from "path";
import newsRouter from "./routes/news/news.js";
import usersRouter from "./routes/users/users.js";
import queriesRouter from "./routes/queries/queries.js";
import cors from 'cors';


const app = express();
const port = process.env.PORT || 4000;




// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Use routers
app.use("/news", newsRouter);
app.use("/users", usersRouter);
app.use("/queries", queriesRouter);

// Start the server
app.listen(port, () => {
  console.log(`✅ Server listening on port ${port}`);
});
