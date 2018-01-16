//NOTE: broadcasting to everyone using io.emit() should be done in server side to emit new messgae to everyone. And use io.on() for connection. Otherwise use soscket.'event'

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


//to include my custom css,javascript files 
app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/chatindex.html');
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});

/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
								/*Connecting to Mongo Database and listen for connections*/
									
console.log("Hey server has started");//server prints this

 var mongo = require("mongodb").MongoClient;
 
 //All server code here executes regardless of whether there is a client
 mongo.connect('mongodb://127.0.0.1/node-mongo',function(err,db)
 {
 	console.log("Connected to database");
	if(err)
		throw(err);

	/*listen on the connection event for incoming sockets, and I log to the console after connecting to the database. Each person that connects is a differernt client.*/	
	io.on('connection',function(socket) {
	console.log("Someone has connected");
	
	
								
/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
								
								/*Display 100 messgaes to new client that connected using 'output' event*/
	
	
	/*our chat messages will be stored in a collection called 'messages' in the 'chat' database*/
	var col = db.collection('messages');
	
	//collect 100 chat messages from database
	col.find().limit(10).sort({_id:1}).toArray(function(err,res)
	{
		if (err)
			throw err;
		
		console.log("going to emit messages");
		
		//emit to only that particular client using output event
		socket.emit('output',res);
	});
/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

						/*function to send status from server to particular client using 'status' event*/
		
		var sendStatus = function(s)
		{
			socket.emit('status',s);
		};
/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

								/*Listening and working with chat name and messgae from client using 'input' event.*/
						
							
	//For example, in browser: socket.emit('input',{"name":"Alex","message":"Hello you over there"});
	socket.on('input',function(data) {
	console.log("Server has received:");
	console.log(data);
	
	var name = data.name;
	var message = data.message;
	whitespacePattern = /^\s*$/;
	
	//checking to whether name or message is blank. If so, do not save in database and send back a strings
	if(whitespacePattern.test(name) || (whitespacePattern.test(message)))
	{
		console.log("Invalid.");
		sendStatus("Both name and message is required");
	}
	
	else //proper chat message with user name
		
	{
		//insert to database, emit to all clients and send a confirmation 'object' to the client that sent the message
		col.insert({name:name,message:message}, function(){
			console.log("Inserted a message");
						
			io.emit('output',[data]);/*data is the one received in 'input' event from client*/
			sendStatus(
			{
				message:"Message Sent",
				clear:true
			});
		});
	}
	
	});
	
/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
	
 });//io.on() ending bracket
 
 }); //mongo.connect() ending bracket


