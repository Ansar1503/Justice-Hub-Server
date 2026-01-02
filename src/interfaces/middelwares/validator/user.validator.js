"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = void 0;
const express_validator_1 = require("express-validator");
exports.validateUser = [
    (0, express_validator_1.body)("name")
        .trim()
        .notEmpty()
        .withMessage("Name is Required")
        .isLength({ min: 3 })
        .withMessage("Name must be atleast 3 characters long"),
    (0, express_validator_1.body)("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format"),
    (0, express_validator_1.body)("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    (0, express_validator_1.body)("role")
        .trim()
        .notEmpty()
        .withMessage("Role is required")
        .isIn(["lawyer", "client"])
        .withMessage("Role must be either 'lawyer' or 'client'"),
];
