const express = require("express");
const mysql = require("mysql");
const path = require("path");
var crypto = require("crypto");
const bodyParser = require('body-parser');
// const session = require("express-session");
var session = require('cookie-session');
const app = express();

const db = mysql.createConnection({
    socketPath: "/cloudsql/nodejs-recipe-website:us-central1:nodejs-recipe-proj",
    user: "nodejsrecipe",
    password: "nodejsrecipe4610",
    database: 'recipe',
});

db.connect( (error)=>{
    if(error){
        console.log(error)
    }
    else{
        console.log("mysql is connected.!!")
    }
});
module.exports = db;

app.use(session({
    secret:'secret-key',
    resave: false,
    saveUninitialized: false,

}));

app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname, '/views/index.html'));
});
app.get("/index.html", (req,res)=>{
    res.sendFile(path.join(__dirname, '/views/index.html'));
});
app.get("/indexUser.html", (req,res)=>{
    res.sendFile(path.join(__dirname, '/views/indexUser.html'));
});
app.get("/login.html", (req,res)=>{
    res.sendFile(path.join(__dirname, '/views/login.html'));
});
app.get("/register.html", (req,res)=>{
    res.sendFile(path.join(__dirname, '/views/register.html'));
});
app.get("/details.html", (req,res)=>{
    res.sendFile(path.join(__dirname, '/views/details.html'));
});
app.get("/results.html", (req,res)=>{
    res.sendFile(path.join(__dirname, '/views/results.html'));
});
app.get("/profile.html", (req,res)=>{
    res.sendFile(path.join(__dirname, '/views/profile.html'));
});
app.get("/logout.html", (req,res)=>{
    res.sendFile(path.join(__dirname, '/views/logout.html'));
});

// app.use(express.static(path.join(__dirname, '../public')));
// app.use(express.static(__dirname + '/public'));

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true })); 

app.post("/login", (req,res)=>{
    var username = req.body.username;
    var password = req.body.password;
    var sha256 = crypto.createHash("sha256");
    sha256.update(password);
    var result = sha256.digest("hex");
    var sql = "SELECT firstName, lastName, id FROM users WHERE username = ? AND password = ?";
    db.query(sql, [username, result],function(err,results,fields){
        if(results.length>0){
            req.session.userID = results[0].id;            
            req.session.profUsername = username;
            req.session.fname = results[0].firstName;
            req.session.lname = results[0].lastName;
            console.log("session variablesSSSSSSSSS: " + req.session.profUsername +"   " + req.session.fname + req.session.lname);
            console.log("resultsssssss from results arayyyyyyyyyy: " +results[0].firstName + results[0].lastName );
            
            res.redirect("/indexUser.html");
        }else{
            res.redirect("/login.html");
        }

    })

});
app.post("/register", (req,res)=>{
    var username = req.body.username;
    //check if username exists
    var sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, username,function(err,results,fields){
        if(results.length>0){
            //error username exists
            res.redirect("/register.html");
        }else{
            //if it doesnt then insert in db
            var fname = req.body.fname;
            var lname = req.body.lname;
            var pass = req.body.password;
            var sha256 = crypto.createHash("sha256");
            sha256.update(pass);
            var resultpass = sha256.digest("hex");
            var sqlinsert = "INSERT INTO users (firstName, lastName, username, password) VALUES (?, ?, ?, ?)";
            db.query(sqlinsert, [fname, lname, username, resultpass],function(err,results,fields){
                if (err) throw err;
                console.log("number of affected rows is: " + results.affectedRows);
                if(results.affectedRows>0){
                    res.redirect("/login.html");
                }

            })
        }

    })
});

app.get("/results", (req,res)=>{
    var sql = "SELECT id, title, imageName FROM recipes";
    db.query(sql, function(err,results,fields){
        if (err) throw err;
        if(results.length>0){
            res.send(results);
        }
    })

});

app.get("/profileAjaxBackend/:fav", (req,res)=>{
    if(req.params.fav=="true"){
        var sql = "SELECT recipes.id, title, imageName FROM recipes JOIN favorites ON recipes.id = favorites.recipeID WHERE favorites.users_id = ?";
        

    }else{
        var sql = "SELECT id, title, imageName FROM recipes WHERE users_id = ?";

    }
    db.query(sql, req.session.userID, function(err,results,fields){
        if (err) throw err;
        if(results.length>0){
            res.send(results);
        }
    })    

});


app.get("/details/:id", (req,res)=>{
    var sql = "SELECT title, cuisine, servings, ingredients, directions, imageName, prepTime, cookTime, difficulty FROM recipes WHERE id = ?";
    db.query(sql, req.params.id, function(err,results,fields){
        if (err) throw err;
        if(results.length>0){
            res.send(results);
        }
    })

 
   

});


app.get("/logout", (req,res)=>{
    delete req.session.fname;
    delete req.session.lname;
    delete req.session.profUsername;
    delete req.session.detailsID;    
    res.redirect("/index.html");

});

app.get("/profileCred", (req,res)=>{
    var info = [{"fname": req.session.fname, "lname": req.session.lname, "username": req.session.profUsername}];
    res.send(info);
});



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});



// app.listen(3001, ()=>{
//     console.log("server started on port 3001!!");
// });



// var http = require('http');
// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello Gloria!!! How are ypu!!!\n');
// }).listen(3000, "127.0.0.1");
// console.log('Server running at http://127.0.0.1:3000/');