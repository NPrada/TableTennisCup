var express= require("express");
var mysql = require("mysql");
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

var connection = mysql.createConnection({
    //DB properies..
    host: "178.62.9.140",
    user: "root",
    password: "niccolo123456789",
    database: "conp2"
});
var port = 3080;
connection.connect(function (error) {       //connect to database
    if (!!error){
        console.log(error);
        console.log("Error Connecting to database");
    } else {
        console.log("Connected to port:" + port);
    }
});

//NOT JUNK and allows cors (I am allowing anything to access the server) maybe localhost instead of * will work
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/matches/:matchID", function (req,res) {

    var matchID = req.params.matchID;           //this fetches the variable value for the query

    connection.query("SELECT matches.date, matches.postponed, matches.scores, ht.teamName AS homeTeam, at.teamName AS awayTeam " +
        "FROM matches " +
        "INNER JOIN teams ht ON ht.id=matches.hteam " +
        "INNER JOIN teams at ON at.id=matches.ateam " +
        "WHERE matches.id="+matchID, function (error, rows, fields){
        // callback aka when the query is matches.iddone this fires
        if (!!error){
            console.log("Error in the query");
        } else {
            console.log(rows);
            res.send(rows);  //rows [0] because there should only be 1 row returned anyway (makes the code later cleaner)
            console.log("Match info Successful query");
        }
    });
});

app.get("/singleSets/:matchID", function (req,res) {

    var matchID = req.params.matchID;           //this fetches the variable value for the query

    connection.query("SELECT singleset.id, singleset.matchid, p2.name AS hplayer, p2.handicap AS hhandicap,  " +
        "p1.name AS aplayer, p1.handicap AS ahandicap, singleset.g1h, singleset.g1a, singleset.g2h, singleset.g2a, " +
        "singleset.g3h, singleset.g3a, singleset.g4h, singleset.g4a FROM singleset " +
        "INNER JOIN players p1 ON p1.id=singleset.aplayer " +
        "INNER JOIN players p2 ON p2.id=singleset.hplayer " +
        "WHERE singleset.matchid="+matchID, function (error, rows, fields){

        // callback aka when the query is done this fires
        if (!!error){
            console.log("Error in the query");
            console.log(error);
        } else {
            //console.log(rows);
            console.log("Single Sets Successful query");
            res.send(rows);
        }
    });

});

app.get("/doubleSets/:matchID", function (req,res) {

    var matchID = req.params.matchID;      //this fetches the variable value for the query

    connection.query("SELECT doubleset.id, doubleset.matchid, p1.name AS hplayer1 , p1.handicap AS hhandicap1, " +
        "p2.name AS hplayer2, p2.handicap AS hhandicap2, p3.name AS aplayer1,p3.handicap AS ahandicap1, " +
        "p4.name AS aplayer2,p4.handicap AS ahandicap2, doubleset.g1h, doubleset.g1a, doubleset.g2h, " +
        "doubleset.g2a, doubleset.g3h, doubleset.g3a, doubleset.g4h, doubleset.g4a FROM doubleset " +
        "INNER JOIN players p1 ON p1.id=doubleset.hP1 INNER JOIN players p2 ON p2.id=doubleset.hP2 " +
        "INNER JOIN players p3 ON p3.id=doubleset.aP1 INNER JOIN players p4 ON p4.id=doubleset.aP2 " +
        "WHERE doubleset.matchID="+matchID, function (error, rows, fields){

        // callback aka when the query is done this fires
        if (!!error){
            console.log("Error in the query");
            console.log(error);
        } else {
            console.log(rows);
            console.log("Double sets Successful query");
            res.send(rows);
        }
    });

});

app.get("/allMatches", function (req,res) {

    connection.query("SELECT matches.id, matches.date, matches.postponed, ht.teamName AS homeTeam, at.teamName AS awayTeam, matches.scores " +
        "FROM matches " +
        "INNER JOIN teams ht ON ht.id=matches.hteam " +
        "INNER JOIN teams at ON at.id=matches.ateam", function (error, rows, fields){

        // callback aka when the query is done this fires
        if (!!error){
            console.log("Error in the query");
            console.log(error);
        } else {
            console.log(rows);
            console.log("allMatches sets Successful query");
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

app.listen(port);