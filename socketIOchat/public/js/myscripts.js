
//return query selector, so dont need jquery
var getNode = function(s)
{
	return document.querySelector(s);
};
/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
									/*get required nodes*/

//var messages =  document.getElementsByClassName("chat-messages");
var messages =  getNode('.chat-messages');
var username =  document.getElementsByClassName("chat-name").value;
var chatName = getNode('.chat-name');
var textarea = getNode('.chat textarea');
var statusDefault = "Idle";
/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

							/*function to set status on a particular client. By default it says idle*/
var setStatus = function(s){
	document.getElementById("thespan").innerHTML = s;
	setTimeout(function (){
		document.getElementById("thespan").innerHTML = "Idle";
		}, 6000);
	};
	
/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

try {
	//load the socket.io-client which exposes a io global and then connect
	var socket = io(); 
}
catch(e){
	//set status to warn user
}

if(socket !== undefined)
{
						/*listen for output event. Output used for both emitting 100 intro messages and new sent messages*/
						
	socket.on('output',function(data){
		if(data.length)
		{
			for(var x = 0;x<data.length;x++)
			{
				var message = document.createElement("div");
				message.setAttribute('class','my_message');
				message.textContent = data[x].name + ": " +data[x].message;
				
				messages.appendChild(message);
				
				/*If want new message to appear at top put this in*/
				//messages.insertBefore(message, messages.firstChild);
			}
		}
	});
	
	console.log("testing: ok");//gets printed in client console
	
/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

					/*AFTER a message is written and the enter key is pressed, logic on working with server's repsonse*/
					
					
	socket.on('status',function(data){
		
		/*if proper message with username sent, server will save in database and send back an 'object'. So set status to somehting like 'sent' and clear the textarea*/
		if(typeof(data) === 'object')
		{
			setStatus("Message Sent");
			textarea.value = "";
		}
		else //If invalid messages sent, it wasnt stored and server sends back a 'string'. e,g case - if name or chat message not filled in
		{
			setStatus(data);
		}	
	});

	
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

								/*Sending a chat message and logic for some keyboard buttons*/
								

	/*listen for keydown. keydown means pressing any key in input whereas keyup is releasing a key*/
	textarea.addEventListener('keydown',function(event){	
		
		var self = this; //'this' refers to textarea since under textarea
		name = chatName.value;
				
		/*
			//check what key was pressed down
			console.log(event.which);
			//more details of the event
			console.log(event);
		*/
		
		/*event.shiftKey is boolen.If pressed then yes and 13 is for enter key.*/
		if(event.which === 13 && event.shiftKey === false)
		{	console.log("Sent");
			
			//send user name and chat message
			socket.emit("input",
			{name:name, message:self.value});
			
			/*under event.which == 13 and no shift key being pressed, so enter original action of mnewline wont work*/ 
			event.preventDefault();
			
		}
	});
	
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
	
} //if (socket) != undefined ending bracket




