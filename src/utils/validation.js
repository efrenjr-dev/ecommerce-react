import Joi from "joi";
import { tlds } from "@hapi/tlds";

const BIGINT_MIN = BigInt("-9223372036854775808");
const BIGINT_MAX = BigInt("9223372036854775807");

const login = Joi.object({
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

const register = Joi.object({
    name: Joi.string().required().label("Full Name"),
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
        .valid(Joi.ref("password"))
        .required()
        .label("Confirm Password")
        .messages({
            "any.only": "Confirm password must match the password.",
            "any.required": "Confirm password is required.",
        }),
});

const resetPassword = Joi.object({
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
        .valid(Joi.ref("password"))
        .required()
        .label("Confirm Password")
        .messages({
            "any.only": "Confirm password must match the password.",
            "any.required": "Confirm password is required.",
        }),
});

const addProduct = Joi.object({
    name: Joi.string().required().label("Product name"),
    price: Joi.number().greater(0).required().label("Price"),
    description: Joi.string().allow("").label("Product description"),
    quantity: Joi.number().label("Product quantity"),
    images: Joi.array()
        .items(
            Joi.object({
                name: Joi.string().required(),
                type: Joi.string()
                    .valid("image/jpeg", "image/png", "image/gif")
                    .required(),
                size: Joi.number()
                    .max(5 * 1024 * 1024)
                    .required(),
            })
        )
        .min(1) // At least one image
        .max(5) // Maximum 5 images
        .required()
        .messages({
            "array.min": "At least one image is required.",
            "array.max": "You can upload a maximum of 5 images.",
            "any.required": "Images field is required.",
        }),
});

const updateProduct = Joi.object({
    name: Joi.string().min(1).required(),
    description: Joi.string().allow("").optional(),
    price: Joi.number().greater(0).required(),
    isActive: Joi.boolean().required(),
    existingImages: Joi.array()
        .items(
            Joi.object({
                id: Joi.any()
                    .custom((value, helpers) => {
                        if (typeof value !== "bigint") {
                            return helpers.error("any.invalid", {
                                message: "Value must be a BigInt",
                            });
                        }
                        if (value < BIGINT_MIN || value > BIGINT_MAX) {
                            return helpers.error("any.invalid", {
                                message: "Value is out of 64-bit range",
                            });
                        }
                        return value;
                    }, "64-bit BigInt validation")
                    .required(),
                url: Joi.string().uri().required(),
                created_at: Joi.date().optional(),
                productId: Joi.string().uuid().optional(),
            })
        )
        .optional(),
    newImages: Joi.array()
        .items(
            Joi.object({
                name: Joi.string().required(),
                size: Joi.number()
                    .max(5 * 1024 * 1024)
                    .required(), // Limit to 5MB max size
                type: Joi.string()
                    .valid("image/jpeg", "image/png", "image/gif")
                    .required(), // Allow specific types
            })
        )
        .optional(),
});

const addUser = Joi.object({
    name: Joi.string().required().label("Full Name"),
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
        .valid(Joi.ref("password"))
        .required()
        .label("Confirm Password")
        .messages({
            "any.only": "Confirm password must match the password.",
            "any.required": "Confirm password is required.",
        }),
    role: Joi.string().required().valid("user", "admin"),
});

const updateUser = Joi.object({
    name: Joi.string().required().label("Full Name"),
    email: Joi.string()
        .email({ tlds: { allow: tlds } })
        .required()
        .label("email"),
    role: Joi.string().required().valid("user", "admin"),
    isActive: Joi.boolean().required(),
});

export const schema = {
    login,
    register,
    resetPassword,
    addProduct,
    updateProduct,
    addUser,
    updateUser,
};

export const validateForm = (schema, formData) => {
    let transformedData = { ...formData };
    if (formData.images) {
        transformedData = {
            ...formData,
            images: formData.images.map((file) => ({
                name: file.name,
                type: file.type,
                size: file.size,
            })),
        };
    }

    if (formData.newImages) {
        transformedData = {
            ...formData,
            newImages: formData.newImages.map((file) => ({
                name: file.name,
                type: file.type,
                size: file.size,
            })),
        };
    }

    const options = { abortEarly: false };
    const { error } = schema.validate(transformedData, options);
    console.log("Validation error:", error);
    if (!error) return null;

    const validationErrors = {};
    for (let item of error.details) {
        validationErrors[item.path[0]] = item.message;
    }
    return validationErrors;
};
