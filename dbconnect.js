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

    connection.query("SELECT matches.date, matches.postponed, matches.scores,  matches.hteam, ht.teamName AS homeTeam, matches.ateam, at.teamName AS awayTeam " +
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
//this is used to set the date of a match
app.post("/updateMatchDate/matchID/:matchID/newDate/:newDate", function (req,res) {

    var matchID = req.params.matchID;
    var newDate = req.params.newDate

    connection.query("UPDATE conp2.matches SET date = " + newDate +" WHERE matches.id ="+matchID, function (error, rows, fields){
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

app.post("/newClub/:clubName", function (req,res) {

    var clubName = req.params.clubName;

    connection.query("INSERT INTO conp2.clubs (clubName) VALUES ('"+clubName+"')", function (error, rows, fields){

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
//this post is used to create a new team
app.post("/newTeam/:clubID/:teamName/:teamCaptainId/:contactEmail", function (req,res) {

    var clubID          = req.params.clubID;
    var teamName        = req.params.teamName;
    var teamCaptainId   = req.params.teamCaptainId;
    var email           = req.params.contactEmail;

    connection.query("INSERT INTO conp2.teams (clubID,teamName,teamCaptainID,contactEmail) VALUES ('"+clubID+"', '"+teamName+"', '"+teamCaptainId+"', '"+email+"')", function (error, rows, fields){

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
//the next three middlewares are used to fetch all the clubs teams and players
//fethes the entire clubs table
app.get("/allClubs", function (req,res) {

    connection.query("SELECT * FROM clubs" ,function (error, rows, fields){

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
//fethes the entire teams table
app.get("/allTeams", function (req,res) {

    connection.query("SELECT * FROM teams" ,function (error, rows, fields){

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
//fethes the entire players table
app.get("/allPlayers", function (req,res) {

    connection.query("SELECT * FROM players" ,function (error, rows, fields){

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

//get all the players of a certain team
app.get("/playersOfTeam/:teamID", function (req,res) {

    var teamID = req.params.teamID;

    connection.query("SELECT * FROM players WHERE players.teamID="+teamID ,function (error, rows, fields){

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
//update a whole single set row
app.post("/updateSingleSet/:setID/:hPlayerID/:aPlayerID/:g1h/:g1a/:g2h/:g2a/:g3h/:g3a/:g4h/:g4a", function (req,res) {

        var setID =   req.params.setID;
        var hplayer = req.params.hPlayerID;
        var aplayer = req.params.aPlayerID;
        var g1h = req.params.g1h;
        var g1a = req.params.g1a;
        var g2h = req.params.g2h;
        var g2a = req.params.g2a;
        var g3h = req.params.g3h;
        var g3a = req.params.g3a;
        var g4h = req.params.g4h;
        var g4a = req.params.g4a;

        connection.query("UPDATE conp2.singleset SET hplayer = '"+hplayer+"', aplayer = '"+aplayer+"', g1h = '"+g1h+"', g1a = '"+g1a+"', g2h = '"+g2h+"',g2a = '"+g2a+"',g3h = '"+g3h+"',g3a = '"+g3a+"',g4h = '"+g4h+"',g4a = '"+g4a+"' WHERE id ="+ setID, function (error, rows, fields){
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

app.post("/updateDoubleSet/:setID/:hPlayer1ID/:hPlayer2ID/:aPlayer1ID/:aPlayer2ID/:g1h/:g1a/:g2h/:g2a/:g3h/:g3a/:g4h/:g4a", function (req,res) {

    var setID =   req.params.setID;
    var hplayer1 = req.params.hPlayer1ID;
    var hplayer2 = req.params.hPlayer2ID;
    var aplayer1 = req.params.aPlayer1ID;
    var aplayer2 = req.params.aPlayer2ID;
    var g1h = req.params.g1h;
    var g1a = req.params.g1a;
    var g2h = req.params.g2h;
    var g2a = req.params.g2a;
    var g3h = req.params.g3h;
    var g3a = req.params.g3a;
    var g4h = req.params.g4h;
    var g4a = req.params.g4a;
    //console.log("hplayer value ="+hplayer)

    console.log("UPDATE conp2.doubleset SET hP1 = '"+hplayer1+"',hP2 = '"+hplayer2+"' aP1 = '"+aplayer1+"',aP2 = '"+aplayer2+"', g1h = '"+g1h+"', g1a = '"+g1a+"', g2h = '"+g2h+"',g2a = '"+g2a+"',g3h = '"+g3h+"',g3a = '"+g3a+"',g4h = '"+g4h+"',g4a = '"+g4a+"' WHERE id ="+ setID)
    connection.query("UPDATE conp2.doubleset SET hP1 = '"+hplayer1+"',hP2 = '"+hplayer2+"', aP1 = '"+aplayer1+"',aP2 = '"+aplayer2+"', g1h = '"+g1h+"', g1a = '"+g1a+"', g2h = '"+g2h+"',g2a = '"+g2a+"',g3h = '"+g3h+"',g3a = '"+g3a+"',g4h = '"+g4h+"',g4a = '"+g4a+"' WHERE id ="+ setID, function (error, rows, fields){
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


app.listen(port);