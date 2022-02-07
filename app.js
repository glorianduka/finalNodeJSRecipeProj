const express = require("express");
const mysql = require("mysql");
const path = require("path");
var crypto = require("crypto");
const bodyParser = require('body-parser');

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
app.get("/search.html", (req,res)=>{
    res.sendFile(path.join(__dirname, '/views/search.html'));
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
    var bar = req.query.bar;
    var cuisine = req.query.cuisine;
    if(bar==="true"){

    }else{
        if(cuisine==="All"){
            var sql = "SELECT id, title, imageName FROM recipes";
            db.query(sql, function(err,results,fields){
                if (err) throw err;
                if(results.length>0){
                    //return result to results.html
                    res.json(results);
                }
                res.redirect("/results.html");

            })


        }else{
            var sql = "SELECT id, title, imageName FROM recipes WHERE cuisine = ?";
            db.query(sql,cuisine,function(err,results,fields){
                if (err) throw err;
                if(results.length>0){
                    //return result to results.html
                    res.send(results);
                }
                res.redirect("/results.html");


            })

        }
    }

    

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