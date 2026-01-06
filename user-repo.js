import db from "db-local";
import crypto from "crypto";
import jwt from "jsonwebtoken";
const {Schema} = db;


/* generar id aleatorio */
const id = crypto.randomUUID();
/* fecha de creacion */
const createdAt = new Date();
/* fecha de actualizacion */
const updatedAt = new Date();
/* nombre de usuario */
const username = username;
/* email */
const email = email;
/* contraseña */
const password = password;
/* rol */
const role = role;
/* estado */
const status = status;
/* token */
const token = token;


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
   static create ({username, email, password}) {


    
/* validar datos */
if (typeof username !== "string" || typeof email !== "string" || typeof password !== "string") {
    throw new Error("Invalid username, email or password");
}
if (username.length < 3 || username.length > 20) {
    throw new Error("Username must be between 3 and 20 characters");
}
if (email.length < 3 || email.length > 20) {
    throw new Error("Email must be between 3 and 20 characters");
}
if (password.length < 8 || password.length > 20) {
    throw new Error("Password must be between 8 and 20 characters");
}
if (!email.includes("@")) {
    throw new Error("Invalid email");
}
if (!password.includes("")) {
    throw new Error("Password must contain at least one number");
}
if (!password.includes("!")) {
    throw new Error("Password must contain at least one special character");
}
if (!password.includes("$")) {
    throw new Error("Password must contain at least one special character");
}
if (!password.includes("#")) {
    throw new Error("Password must contain at least one special character");
}


/* buscar usuario por email */
const user = User.findOne({email});
if (!user) {
    throw new Error("User not found");
}
if (user.password !== password) {
    throw new Error("Invalid password");
}
if (user.username !== username) {
    throw new Error("Invalid username");
}
/* usuario encontrado y contraseña correcta */
return user;     
}  catch (error) {   /* error de usuario no encontrado o contraseña incorrecta */
    throw new Error(error.message);
}

}
                                                   






