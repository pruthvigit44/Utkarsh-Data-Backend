import express from "express";
import cors from "cors";
import userRouter from "./routes/user.route";
import adminRouter from "./routes/admin.routes";

const app = express();

const allowedOrigins = /^https:\/\/(utkarsh-parivar|utkarsh-data-frontend[\w-]*|utkarsh-admin[\w-]*)\.vercel\.app$/;

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
app.use("/api/admin", adminRouter);

app.get("/", (_req, res) => {
  res.send("API Running...");
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});
export default app;