import { body } from "express-validator";

export const validateUser = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is Required")
        .isLength({ min: 3 })
        .withMessage("Name must be atleast 3 characters long"),
    body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    body("role")
        .trim()
        .notEmpty()
        .withMessage("Role is required")
        .isIn(["lawyer", "client"])
        .withMessage("Role must be either 'lawyer' or 'client'"),
];
