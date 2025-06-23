const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const path = require("path");

const session = require("express-session");
const flash = require("connect-flash");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


const sessionOptions ={
    secret : "SuperSecrtString",
    resave: false,
    saveUninitialized: true
};

app.use( session(sessionOptions));
app.use(flash());


app.get("/register", (req, res) => {
    let {name = "None"} = req.query;
    req.session.name = name;
    if(name == "None") {
        req.flash("error", "User Not registerded");
    } else {
        req.flash("success", "User registerded sucessfully");
    }
    
    res.redirect("/hello");
});

app.get("/hello", (req, res) => {

    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.render("page.ejs", {name: req.session.name});
})

// app.get("/reqcount", (req, res) => {
//     if(req.session.count) {
//         req.session.count++;
//     } else {
//         req.session.count = 1;
//     }
//     res.send(`You send a request ${req.session.count} times`);
// })

app.listen(5000, () => {
    console.log("Server is listening to 5000");
});















































/*



const cookieParser = require("cookie-parser");

app.use(cookieParser("secretcode"));

app.get("/getsignedcookie", (req, res) => {
    res.cookie("made-in", "india", {signed: true});
    res.send("Signed cookie sent");
});

app.get("/verify", (req, res) => {
    console.log(req.signedCookies);
    res.send("Verified!!")
})


app.get("/getcookies", (req, res) => {
    res.cookie("greet", "Namaste");
    res.cookie("MadeIn", "India");
    res.send("We sent you cookies!!")
});

app.get("/greet" , (req, res) => {

    let {name = "Boss"} = req.cookies
    res.send(`Hi, ${name}`);
})

app.get("/", (req, res) => {
    console.dir(req.cookies);
    res.send("Hi, I am Root");
});


app.use("/users", users);

app.use("/posts", posts);

*/  