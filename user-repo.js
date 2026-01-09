import db from "db-local";
import crypto from "crypto";
import jwt from "jsonwebtoken";
const {Schema} = db;

/* esquema de usuario */
const userSchema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
}, {timestamps: true});

/* modelo de usuario */
const User = db.model("User", userSchema);

/* crear usuario */
export class UserRepository {
   static async create ({username, email, password}) {
    try {
        /* validar datos */
        if (typeof username !== "string" || typeof email !== "string" || typeof password !== "string") {
            throw new Error("Invalid username, email or password");
        }
        if (username.length < 3 || username.length > 20) {
            throw new Error("Username must be between 3 and 20 characters");
        }
        if (email.length < 3 || email.length > 50) {
            throw new Error("Email must be between 3 and 50 characters");
        }
        if (password.length < 8 || password.length > 20) {
            throw new Error("Password must be between 8 and 20 characters");
        }
        if (!email.includes("@")) {
            throw new Error("Invalid email");
        }
        






        
        /* verificar si el usuario ya existe */
        const existingUser = await User.findOne({username});
        if (existingUser) {
            throw new Error("Username already exists");
        }
        
        const existingEmail = await User.findOne({email});
        if (existingEmail) {
            throw new Error("Email already exists");
        }










        /* crear nuevo usuario */
        const user = await User.create({
            username,
            email,
            password
        });

        return user;
    } catch (error) {
        throw new Error(error.message);
    }
   }
}
