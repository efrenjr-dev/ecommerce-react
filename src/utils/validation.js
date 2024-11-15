import Joi from "joi";
import { tlds } from "@hapi/tlds";

export const validateForm = (schema, formData) => {
    const options = { abortEarly: false };
    const { error } = schema.validate(formData, options);

    if (!error) return null;

    const validationErrors = {};
    for (let item of error.details) {
        validationErrors[item.path[0]] = item.message;
    }
    return validationErrors;
};

export const loginSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: tlds } })
        .required()
        .label("email"),
    password: Joi.string()
        .min(8)
        .max(25)
        .required()
        .pattern(/\d/, { name: "digit" })
        .pattern(/[a-zA-Z]/, { name: "letter" })
        .label("Password")
        .messages({
            "string.min": "Password must be at least 8 characters long.",
            "string.max": "Password must not exceed 25 characters.",
            "string.pattern.name":
                "Password must contain at least 1 {{#name}}.",
            "any.required": "Password is required.",
        }),
});

export const registerSchema = Joi.object({
    fullName: Joi.string().required().label("Full Name"),
    email: Joi.string()
        .email({ tlds: { allow: tlds } })
        .required()
        .label("email"),
    password: Joi.string()
        .min(8)
        .max(25)
        .required()
        .pattern(/\d/, { name: "digit" })
        .pattern(/[a-zA-Z]/, { name: "letter" })
        .label("Password")
        .messages({
            "string.min": "Password must be at least 8 characters long.",
            "string.max": "Password must not exceed 25 characters.",
            "string.pattern.name":
                "Password must contain at least 1 {{#name}}.",
            "any.required": "Password is required.",
        }),
    confirmPassword: Joi.string()
        .valid(Joi.ref("password")) // Ensure confirmPassword matches password
        .required()
        .label("Confirm Password")
        .messages({
            "any.only": "Confirm password must match the password.",
            "any.required": "Confirm password is required.",
        }),
});

export const addProductSchema = Joi.object({
    name: Joi.string().required().label("Product name"),
    price: Joi.number().greater(0).required().label("Price"),
    description: Joi.string().allow("").label("Product description"),
    quantity: Joi.number().label("Product quantity"),
});

export const updateProductSchema = Joi.object({
    name: Joi.string().label("Product name"),
    price: Joi.number().greater(0).label("Price"),
    description: Joi.string().allow("").label("Product description"),
    isActive: Joi.boolean().required().label("Product is active"),
});
