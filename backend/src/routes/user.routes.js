import { Router } from "express";
const router = Router();
import { userController } from "../controllers/user.controller.js";
import { auth } from "../services/auth.js";

router.post("/register", async (req, res) => {
  console.log("📍 Received register request with body:", req.body);
  await userController.register(req, res);
});

router.post("/login", async (req, res) => {
  console.log("📍 Received login request with body:", req.body);
  await userController.login(req, res);
});

router.put("/update/:identifier", auth, async (req, res) => {
  console.log("🔄 UPDATE ROUTE HIT");
  console.log("Params:", req.params);
  console.log("Body:", req.body);
  console.log("User from auth:", req.user);
  await userController.update(req, res);
});

router.delete("/delete/:identifier", auth, async (req, res) => {
  console.log("🗑️ DELETE ROUTE HIT");
  console.log("Params:", req.params);
  console.log("User from auth:", req.user);
  await userController.delete(req, res);
});

router.delete("/delete/admin/:identifier", auth, async (req, res) => {
  console.log("👑 ADMIN DELETE ROUTE HIT");
  console.log("Params:", req.params);
  console.log("User from auth:", req.user);
  await userController.deleteadmin(req, res);
});

export default router;