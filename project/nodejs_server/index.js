
const WebSocket = require('ws');

const UI_SERVER_WEBSOCKET_PORT = 6556;


//create new websocket Server for UI clients
const wsServer = new WebSocket.Server({ port: UI_SERVER_WEBSOCKET_PORT });

//an array that stores the connected clients
var clients = [];

// Check if is a valid json format or not
function isJSON(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

wsServer.on('connection', function connection(ws) {
    console.log("Devices   "   + (clients.length + 1));
    //new client connected - add client to list
    clients.push(ws);

    //callback that will be called whenever the client sends a message to the server
    ws.on('message', function incoming(message) {
        console.log(`received message from client: ` + message);
        
        if(isJSON(message)) {
            message = JSON.parse(message);
            if(message["type"] === "add to my songs") {
                var fs = require('fs');
                fs.appendFile("data/mysongs.txt", message["song_id"] + "\r\n", function(err) {
                    if(err) {
                        return console.log(err);
                    }

                    console.log("The file was saved!");
                }); 
                clients.pop(ws);
            } else if(message["type"] === "add to my movies") {
                var fs = require('fs');
                fs.appendFile("data/mymovies.txt", message["movie_id"] + "\r\n", function(err) {
                    if(err) {
                        return console.log(err);
                    }

                    console.log("The file was saved!");
                }); 
                clients.pop(ws);
            } else if(message["type"] === "add to my series") {
                var fs = require('fs');
                fs.appendFile("data/myseries.txt", message["serie_id"] + "\r\n", function(err) {
                    if(err) {
                        return console.log(err);
                    }

                    console.log("The file was saved!");
                }); 
                clients.pop(ws);
            } else if(message["type"] === "add to playlist") {
                var fs = require('fs');
                fs.appendFile("data/playlists/" + message["playlist"] + ".txt", message["song_id"] + "\r\n", function(err) {
                    if(err) {
                        return console.log(err);
                    }

                    console.log("The file was saved!");
                }); 
                clients.pop(ws);
            } else if(message["type"] === "new playlist") {
                var fs = require('fs');
				fs.closeSync(fs.openSync("data/playlists/" + message["playlist"] + ".txt", 'w'));
                fs.appendFile("data/playlists.txt", message["playlist"] + " - ", function(err) {
                    if(err) {
                        return console.log(err);
                    }

                    console.log("The file was saved!");
                }); 
                clients.pop(ws);
            } else  if(message["type"] === "new recent") {
                var fs = require('fs');
                fs.appendFile("data/recently_played.txt", message["song_id"] + "\r\n", function(err) {
                    if(err) {
                        return console.log(err);
                    }

                    console.log("The file was saved!");
                }); 
                clients.pop(ws);
			} else  if(message["type"] === "playlist") {
                var fs = require('fs');
                fs.readFile("data/playlists/" + message["title"] + ".txt", function read(err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    ws.send("" + data);
                });
                clients.pop(ws);
			} else if(message["type"] === "remove playlist") {
                var fs = require('fs');
				fs.readFile("data/playlists.txt", 'utf8', function (err,data) {
					if (err) {
						return console.log(err);
					}
					var replace = message["playlist"] + ' - ';
					var re = new RegExp(replace);

					tmp = data.replace(re, "");
					if(data === tmp) {
						var replace = message["playlist"];
						var re = new RegExp(replace);
						tmp = data.replace(re, "");
					}
					data = tmp;
					
					fs.unlinkSync("data/playlists/" + message["playlist"] + ".txt");
					fs.writeFile("data/playlists.txt", data, 'utf8', function (err) {
						if (err) return console.log(err);
					});
                });
                clients.pop(ws);
            } else if(message["type"] === "remove from playlist") {
                var fs = require('fs');
				fs.readFile("data/playlists/" + message["playlist"] + ".txt", 'utf8', function (err,data) {
					if (err) {
						return console.log(err);
					}
					var replace = message["song_id"] + '\r\n';
					var re = new RegExp(replace);

					tmp = data.replace(re, "");
					if(data === tmp) {
						var replace = message["song_id"];
						var re = new RegExp(replace);
						tmp = data.replace(re, "");
					}
					data = tmp;
					
					console.log(data);
					fs.writeFile("data/playlists/" + message["playlist"] + ".txt", data, 'utf8', function (err) {
						if (err) return console.log(err);
					});
                });
                clients.pop(ws);
            } else if(message["type"] === "remove from mysongs") {
                var fs = require('fs');
				fs.readFile("data/mysongs.txt", 'utf8', function (err,data) {
					if (err) {
						return console.log(err);
					}
					var replace = message["song_id"] + '\r\n';
					var re = new RegExp(replace);

					tmp = data.replace(re, "");
					if(data === tmp) {
						var replace = message["song_id"];
						var re = new RegExp(replace);
						tmp = data.replace(re, "");
					}
					data = tmp;
					
					console.log(data);
					fs.writeFile("data/mysongs.txt", data, 'utf8', function (err) {
						if (err) return console.log(err);
					});
                });
                clients.pop(ws);
			} else if(message["type"] === "remove from mymovies") {
                var fs = require('fs');
				fs.readFile("data/mymovies.txt", 'utf8', function (err,data) {
					if (err) {
						return console.log(err);
					}
					var replace = message["movie_id"] + '\r\n';
					var re = new RegExp(replace);

					tmp = data.replace(re, "");
					if(data === tmp) {
						var replace = message["movie_id"];
						var re = new RegExp(replace);
						tmp = data.replace(re, "");
					}
					data = tmp;
					
					console.log(data);
					fs.writeFile("data/mymovies.txt", data, 'utf8', function (err) {
						if (err) return console.log(err);
					});
                });
                clients.pop(ws);
			} else if(message["type"] === "remove from myseries") {
                var fs = require('fs');
				fs.readFile("data/myseries.txt", 'utf8', function (err,data) {
					if (err) {
						return console.log(err);
					}
					var replace = message["serie_id"] + '\r\n';
					var re = new RegExp(replace);

					tmp = data.replace(re, "");
					if(data === tmp) {
						var replace = message["serie_id"];
						var re = new RegExp(replace);
						tmp = data.replace(re, "");
					}
					data = tmp;
					
					console.log(data);
					fs.writeFile("data/myseries.txt", data, 'utf8', function (err) {
						if (err) return console.log(err);
					});
                });
                clients.pop(ws);
			} else if(message["type"] === "interaction") {
                console.log("OK   " + clients.length);
                clients.forEach(client => {
                    console.log("in");
                    client.send(JSON.stringify(message));
                });
            }
        } else {
            if(message === "mysongs") {
                var fs = require('fs');
                fs.readFile("data/mysongs.txt", function read(err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    ws.send("" + data);
                });
                clients.pop(ws);
            } else if(message === "playlists") {
                var fs = require('fs');
                fs.readFile("data/playlists.txt", function read(err, data) {
                    if (err) {
                        return console.log(err);
                    }
					
				
					if(data.toString() === "") return;
					data = data.toString().substring(0, data.toString().length - 3).split(" - ");
					length = data.length;
				
					console.log(data);
					
					json_data = `{"crowd":${length},`;
					
					for(i = 0; i < length; i++) {
						data[i] = data[i].replace(/(\r\n|\n|\r)/gm,"");
						var text = fs.readFileSync("data/playlists/" + data[i] + ".txt",'utf8');
						mid_data = "";
						for(j = 0; j < text.toString().split("\r\n").length; j++) {
							if(text.toString().split("\r\n")[j] === "") {
								console.log("OKKK");
								continue;
							}
							mid_data += '"' + text.toString().split("\r\n")[j] + '"';
							if(j < text.toString().split("\r\n").length - 2) mid_data += ",";
						}
						json_data += `"${data[i]}":[${mid_data.replace(/(\r\n|\n|\r)/gm,"")}]`;
						if(i < length - 1) json_data += ",";
					}
					json_data += "}";
					console.log(json_data);
                    ws.send(json_data);
                });
                clients.pop(ws);
            } else if(message === "mymovies") {
                var fs = require('fs');
                fs.readFile("data/mymovies.txt", function read(err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    ws.send("" + data);
                });
                clients.pop(ws);
            }  else if(message === "myseries") {
                var fs = require('fs');
                fs.readFile("data/myseries.txt", function read(err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    ws.send("" + data);
                });
                clients.pop(ws);
            }
        }

    });

    ws.on('close', function close() {
        clients.splice(clients.indexOf(ws), 1);
    });

});


/* ----------------------------------------------------- */


const webSocketSensorServer = require('./sensorsWebSocketServer');

var sensorsServer = webSocketSensorServer.startServer((channel, message) => {
    //console.log(`channel: ${channel} , message: ${JSON.stringify(message)}`);
if(channel !== "kinect/rotationY" && channel !== "kinect/movement" && channel !== "kinect/position") {
	console.log(`channel: ${channel} , message: ${JSON.stringify(message)}`);
}
    //business logic
    //handle events, choose which client to send what

    clients.forEach(client => {
        client.send(JSON.stringify({
            channel: channel,
            message: message,
        }));
    });

});






