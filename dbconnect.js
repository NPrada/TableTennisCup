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
        console.log("Error Connecting to database");
    } else {
        console.log("Connected");
    }
});

app.get("/matches", function (req,res) {


    connection.query("SELECT * FROM matches", function (error, rows, fields){
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

            //res.send((rows[0].id).toString());        //this sends a 1
            res.send(rows[0]);
            //res.send(rows);


        }
    });
});

app.get("/sets/:matchID", function (req,res) {

    var matchID = req.params.matchID;                                                                                   //this fetches the endpoint call

    connection.query("SELECT singleset.id, singleset.matchid, p2.name AS hplayer, p2.handicap AS hhandicap,  p1.name AS aplayer, p1.handicap AS ahandicap, singleset.g1h, singleset.g1a, singleset.g2h, singleset.g2a, singleset.g3h, singleset.g3a, singleset.g4h, singleset.g4a " +
        "FROM singleset INNER JOIN players p1 ON p1.id=singleset.aplayer INNER JOIN players p2 ON p2.id=singleset.hplayer WHERE singleset.matchid="+matchID, function (error, rows, fields){

        // callback aka when the query is done this fires
        if (!!error){
            console.log("Error in the query");
            console.log(error);
        } else {
            console.log("Successful query");

            console.log(rows);
            res.send(rows);
        }
    });

});

// app.get("/player/:playerID", function (req,res) {
//
//     var playerID = req.params.playerID;                                                                                  //this fetches the id passed in the endpoint call
//
//     connection.query("SELECT * FROM players GROUP BY id HAVING MAX(id) = "+playerID+" AND MIN(id) = "+playerID, function (error, rows, fields){
//         // callback aka when the query is done this fires
//         if (!!error){
//             console.log("Error in the query");
//         } else {
//             console.log("Successful query");
//             //this get function only returns the first row that it fetches matching the citeria
//             //it should only be fetching one row of the database aniway so we only send one row for easier parsing later
//             res.send(rows[0]);
//
//
//
//         }
//     });
//
// });

app.listen(3030);