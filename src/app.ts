import express from "express";
import cors from "cors";
import userRouter from "./routes/user.route";

const app = express();

// app.use(cors({ origin: "*" })); // TEMP
app.use(cors({
  origin: [
    "http://localhost:5173",                 // local dev
    "https://utkarsh-data-frontend.vercel.app"
  ],
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