const express = require("express");
const mysql = require("mysql");


const app = express();

// const db = mysql.createConnection({
//     host: "localhost",
//     socketPath: "/cloudsql/centered-flow-332318:us-central1:recipe-db-new",
//     user: "nduka_recipe_user",
//     database: 'recipe',
//     password: "uscItp2021"

// });
// const db = mysql.createConnection({
//     host: "34.133.155.131",
//     user: "nduka_recipe_user",
//     database: 'recipe',
//     password: "uscItp2021",
//     port: 3306

// });
const db = mysql.createPool({
    user: "nduka_recipe_user",
    password: "uscItp2021",
    database: 'recipe', 
    socketPath: `/cloudsql/centered-flow-332318:us-central1:recipe-db-new`,
})

db.query(`select * from users`, (err,result,fields)=>{
    if(err){
        return console.log(err);
    }
    return console.log(result);
})
// db.connect( (error)=>{
//     if(error){
//         console.log(error)
//     }
//     else{
//         console.log("mysql is connected.!!")
//     }
// });
// module.exports = db;

app.get("/", (req,res)=>{
    res.send("<h1>Gloria's Home Pageeee!!!!</h1>")
});

app.listen(3000, ()=>{
    console.log("server started on port 3000!!");
})



// var http = require('http');
// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello Gloria!!! How are ypu!!!\n');
// }).listen(3000, "127.0.0.1");
// console.log('Server running at http://127.0.0.1:3000/');