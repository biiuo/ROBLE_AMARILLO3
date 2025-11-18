
import { Router } from "express";
const router = Router();
import {   userController} from "../controllers/user.controller.js";

router.post("/register", userController.register);
router.post("/login", async (req, res) => {
    console.log("Received login request with body:", req.body);
  await userController.login(req, res);
});
router.put("/update/:identifier", userController.update);
router.delete("/delete/:identifier", userController.delete);

export default router;

