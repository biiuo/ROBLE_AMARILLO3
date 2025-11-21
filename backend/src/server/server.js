import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT
import express from "express";
import cors from "cors";
import { swaggerConfig } from "../config/swagger.js";
import connectDB from "../config/db.js";
import userRoutes from "../routes/user.routes.js";
import courseRoutes from "../routes/course.routes.js";
import adminRoutes from "../routes/admin.js";
import uploadRoutes from "../routes/upload.route.js";
//import purchaseRoutes from "../routes/purchase.routes.js";
//import certificateRoutes from "../routes/certificate.routes.js";

const app = express();
app.use(cors({origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
swaggerConfig(app);
// Rutas
app.use("/user", userRoutes);
app.use("/course", courseRoutes);
app.use("/admin", adminRoutes);
app.use("/upload", uploadRoutes);

//app.use("/courses", courseRoutes);
//app.use("/purchases", purchaseRoutes);
//app.use("/certificates", certificateRoutes);

app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
