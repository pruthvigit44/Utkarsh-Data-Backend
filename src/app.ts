import express from "express";
import cors from "cors";
import userRouter from "./routes/user.route";

const app = express();

const allowedOrigins = /^https:\/\/utkarsh-data-frontend[\w-]*\.vercel\.app$/;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === "http://localhost:5173" || allowedOrigins.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

app.use("/api/users", userRouter);

app.get("/", (_req, res) => {
  res.send("API Running...");
});

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});
export default app;