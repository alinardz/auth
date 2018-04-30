const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const bcrypt = require("bcrypt");


router.get("/signup", (req, res) => {
    res.render("auth/signup");
});

router.post("/signup", (req, res) => {
    if (req.body.password1 !== req.body.password2) {
        req.body.error = "La concha de tu hermana, password no coincide"
            //une partes: una vista con variables
        return res.render("auth/signup", req.body);
    }

    //hash te da un callback y hashSynch te responde de inmediato
    bcrypt.genSalt(10, (err, salt) => {
        req.body.password = bcrypt.hashSync(req.body.password1, salt);
        User.create(req.body)
            //r el usuario nuevo, el objeto
            .then(r => {
                res.redirect("/login")
            })
            .catch(e => {
                console.log(e);
            })
    });

    //has
    //req.body.password = req.body.password1;
});

router.get("/login", (req, res) => {
    if (req.session.currentUser) return res.send("Ya estás loggeado");
    res.render("login");
});

//hay que renderizar con un error igual que en signup
router.post("/login", (req, res, next) => {

    //find one para que no te devuelva un array
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!bcrypt.compareSync(req.body.password, user.password)) {
                return res.send("Tu contraseña no es correcta")
            }
            req.session.currentUser = user;
            res.send("bienvenido " + user.email);
        })
        .catch(e => res.send("Tu mail no existe"));
});

router.get("/logout", (req, res, next) => {
    req.session.destroy((err) => {
        // cannot access session here
        res.redirect("/login");
    });
});


module.exports = router;