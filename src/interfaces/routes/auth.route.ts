import express from 'express'
import { registerUser } from '../controller/user_controller/user.controller'
import { validateUser } from '../middelwares/validator/user.validator';
import { handleValidationErrors } from '../middelwares/validator/validation.middleware';

const router = express.Router()

router.post("/signup",validateUser,handleValidationErrors,registerUser)


export default router;