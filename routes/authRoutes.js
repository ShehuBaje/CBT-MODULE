import { registerUserValidation, loginUserValidation} from "../middlewares/authValidation.js";
import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post("/register",protect, registerUserValidation, registerUser);
router.post("/login", loginUserValidation, loginUser);

export default router;
