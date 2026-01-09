import express from "express";

const app = express();

app.use(express.json())

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


app.use(express.json());

/* msje de bienvenida */
app.get("/", (req, res) => {
    res.send("hola estrellita, la tierra te dice hola");
});






/* endpoints de login, registro, logout, olvidé mi contraseña */


/* login */
app.post("/login", (req, res) => { 
     /* login con post */
    const { email, password } = req.body;
    res.send("login successful");
});







/* registro */
app.post("/register", (req, res) => {
     const { name, email, password } = req.body;
     console.log(req.body);
   
     try {
        const id = UserRepository.create({name, email, password});
        res.send({id});
    } catch (error) {
        res.status(500).send("registro fallido papa");
    }
});




/* cambiar contraseña */
app.post("/change-password", (req, res) => { 
     /* cambiar contraseña con post */
    const { email, password } = req.body;
    res.send("password changed successfully");
});


app.post("/reset-password", (req, res) => {  
     /* resetear contraseña con post */ 
     const { email, password } = req.body;  res.send("password reset successful");
});







/* protected */
app.get("/protected", (req, res) => { 
      /* protected con get */
    res.send("protected route");
});






app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




