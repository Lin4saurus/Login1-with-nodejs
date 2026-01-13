// server/services/UserService.js
import DBLocal from "db-local";
import crypto from "crypto";
import bcrypt from "bcrypt";

/* la base de datos */
const { Schema } = new DBLocal({ path: "./db" });

/* esquema de usuario */
const User = Schema("User", {
    _id: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    is_staff: { type: Boolean, default: false }, // Campo para roles
    is_active: { type: Boolean, default: true },  // Campo para activación
}, { timestamps: true });

/* clase de validación */
class Validation {
    static async username({ username }) {
        if (typeof username !== "string") {
            throw new Error("Invalid username, email or password");
        }
        if (username.length < 3 || username.length > 20) {
            throw new Error("Username must be between 3 and 20 characters");
        }
        // Solo letras, números y guiones bajos
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(username)) {
            throw new Error("Username can only contain letters, numbers and underscores");
        }
    }


    static async email({ email }) {
        if (typeof email !== "string") {
            throw new Error("Invalid email");
        }
        // Validación más estricta
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Invalid email format");
        }
        if (email.length < 3 || email.length > 50) {
            throw new Error("Email must be between 3 and 50 characters");
        }
    }

    
    static async password({ password }) {
        if (typeof password !== "string") {
            throw new Error("Invalid password");
        }
        if (password.length < 6) { // Mínimo 6 caracteres
            throw new Error("Password must be at least 6 characters");
        }
        // Requiere al menos una mayúscula, minúscula y número
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        
        if (!(hasUpperCase && hasLowerCase && hasNumbers)) {
            throw new Error("Password must contain uppercase, lowercase and numbers");
        }
        if (password.length > 20) {
            throw new Error("Password must be maximum 20 characters");
        }
    }
}

/* crear usuario */
export class UserService {
    static async create({ username, email, password }) {
        try {
            await Validation.username({ username });
            await Validation.password({ password });
            await Validation.email({ email });

            /* verificar si el usuario ya existe */
            const user = await User.findOne({ username });
            if (user) {
                throw new Error("Username already exists");
            }
            
            const Email = await User.findOne({ email });
            if (Email) {
                throw new Error("Email already exists");
            }

            const id = crypto.randomUUID();
            const hashedPassword = await bcrypt.hash(password, 10);

            /* crear nuevo usuario */
            await User.create({
                _id: id,
                username,
                email,
                password: hashedPassword,
                is_staff: false,  // Nuevo usuario no es staff por defecto
                is_active: true   // Nuevo usuario activo por defecto
            }).save();

            return id;
        } catch (error) {   
            throw new Error(error.message);
        }
    }

    static async login({ username, email, password }) {
        try {
            // Acepta username o email
            const loginField = username || email;
            if (!loginField) {
                throw new Error("Username o email es requerido");
            }
            
            await Validation.password({ password });
            
            // Buscar por username o email (db-local no soporta $or, hacer dos consultas)
            let user = await User.findOne({ username: loginField });
            if (!user) {
                user = await User.findOne({ email: loginField });
            }
            
            if (!user) {
                throw new Error("User no encontrado");
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                throw new Error("pass invalida");
            }

            const { password: _, ...rest } = user.toObject();
            return rest;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}