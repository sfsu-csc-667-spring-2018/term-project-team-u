/* Set up game environment */
const socket = io();
$(function () {

  var gamelist_template=Handlebars.compile(gamelist);
  var chat_template=Handlebars.compile(chat);
  
  socket.on('lobby server', function(msg) {
	
	switch(msg.action) {
		case "update_games":
  			msg.email = $("#variables").data('email');	
			html = gamelist_template(msg);
			document.getElementById("gamelist").innerHTML = html;
			break;
		case "update_one_player":
			break;
		case "enter_gameroom":
			window.location.href ="/game/"+msg.game_id
			break;
		case "update_chat":
			html = chat_template(msg);
			document.getElementById("messages").innerHTML = html;
	        window.scrollTo(0, document.body.scrollHeight);
			break;
	}
  });	
});

function create_game(email) {
	console.log(email);
    msg = {email: email, action: "create_game"};
	socket.emit('lobby server', msg);
};

function join_game(email,game_id) {
	console.log(email);
    msg = {email: email, action: "join_game",game_id: game_id};
	socket.emit('lobby server', msg);
}


var gamelist =	`<table id="gameListings" class="table table-hover">
      	  	   <thead>
		     <tr>
		       <th scope="col">Room Number</th>
	               <th scope="col">Capacity</th>
                       <th scope="col">Players</th>
	 	       <th scope="col"></th>
                     </tr>
                   </thead>
                   <tbody>
		   {{#each games}}
                     <tr>
		       <td>Room {{this.id}}</td>
		       <td>{{this.players.length}}/4</td>
		       <td>
		         <ul class="list-inline">
		           {{#each this.players}}
		           <li>{{this}}</li>
		           {{/each}}
			 </ul>
		       </td>
		       <td><button class="btn btn-default" onclick="join_game('{{../email}}',{{this.id}})">Join Game</button></td>
                     </tr>
	           {{/each}}
                   </tbody>
                 </table>`;


var chat=`{{#each messages}}
		<li>{{this.nick_name}}: {{this.message}}   {{this.post_time}}</li>
		{{/each}}`;
