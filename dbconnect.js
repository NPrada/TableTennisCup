var express= require("express");
var mysql = require("mysql");
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

var connection = mysql.createConnection({
    //DB properies..
    host: "localhost",
    user: "root",
    password: "",
    database: "ttcupdb"
});

connection.connect(function (error) {       //connect to database
    if (!!error){
        console.log("Error123");
    } else {
        console.log("Connected");
    }
});

app.get('/123', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/Homepage.css', function(req, res) {
    res.sendFile(path.join(__dirname + '/Homepage.css'));
});


app.get("/matches", function (req,res) {
    //res.sendFile(path.join(__dirname + '/test2.html'));

    connection.query("SELECT * FROM mysampletable", function (error, rows, fields){
        // callback aka when the query is done this fires
        if (!!error){
            console.log("Error in the query");
        } else {
            console.log("Successful query");
            //console.log(rows[0].name);
            //console.log(rows[0]);
            //console.log(rows);
            //res.send(rows);
            //res.write('you posted:\n');
            //var x = rows;

            res.send((rows[0].id).toString());

        }
    });

});



app.listen(3030);