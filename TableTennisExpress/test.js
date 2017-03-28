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

connection.connect(function (error) {
    //callback
    if (!!error){
        console.log("Error123");
    } else {
        console.log("Connected");
    }
});

//app.get('/test2.html', function (req, res) {
//    res.sendFile(path.join(__dirname + '/test2.html'));
//});
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/test2.html'));
    //__dirname : It will resolve to your project folder.
});

app.get("/", urlencodedParser , function (req,res) {
    res.sendFile(path.join(__dirname + '/test2.html'));

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

            var x = rows;
            res.send((x[0].id).toString());
            //document.getElementById("demo").innerHTML =
        }

    });

});



app.listen(3030);