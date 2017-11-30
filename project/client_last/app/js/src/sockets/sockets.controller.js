//*******************************************
//  SOCKETS CONTROLLER
//*******************************************
var Sockets = (function () {
  var socketConnection = null;
	
  /**
   * Connect to socket server
   */
  function Connect() {
    socketConnection = new WebSocket(GlobalConfig.Connections.Sockets);

    socketConnection.onopen = function () {
      console.info("Sockets connected!");
    };

    socketConnection.onerror = function (error) {
      console.info('Sockets Error: ' + error);
    };

    socketConnection.onmessage = function (e) {
      var msg = jQuery.parseJSON(e.data);

      var msgType = msg.channel;
      if (msgType == 'kinect/movement') {
        // move cursor
        Gestures.Manager(`hand:show:${msg.message.handType.toLowerCase()}`);
        Cursor.Move(msg.message.y, msg.message.x);
      } else if (msgType == 'kinect/speech') {
		  console.log("lala");
		  console.log(msg.message);
		  playerAPI.playPause();
		  
		  if(msg.message["speechValue"] === "PLAY") {
			  if($(".pt-page-current")[0].id === "movies_player") {
					playPauseMovie();
				} else if($(".pt-page-current")[0].id === "series_player") {
					playPauseSerie();
				} else if($(".pt-page-current")[0].id.includes("song")) {
					playerAPI.playPause();
				}
			} else if(msg.message["speechValue"] === "PAUSE") {
				if($(".pt-page-current")[0].id === "movies_player") {
					playPauseMovie();
				} else if($(".pt-page-current")[0].id === "series_player") {
					playPauseSerie();
				} else if($(".pt-page-current")[0].id.includes("song")) {
					playerAPI.playPause();
				}
			} else if(msg.message["speechValue"] === "FORWARD") {
				if($(".pt-page-current")[0].id === "movies_player") {
					value = min(document.getElementById("movies_video").currentTime + 10, document.getElementById("movies_video").duration);
					document.getElementById("movies_video").currentTime = value;
					$(".movie_bar").width(document.getElementById("movies_video").duration / value);
				} else if($(".pt-page-current")[0].id === "series_player") {
					value = min(document.getElementById("series_video").currentTime + 10, document.getElementById("series_video").duration);
					document.getElementById("series_video").currentTime = value;
					$(".serie_bar").width(document.getElementById("series_video").duration / value);
				} else if($(".pt-page-current")[0].id.includes("song") === true) {
					value = min(playerAPI.playing.currentTime + 10, playerAPI.playing.duration);
					playerAPI.playing.currentTime = value;
					$(".myBar").width(playerAPI.playing.duration / value);
				}
			} else if(msg.message["speechValue"] === "BACKWARD") {
				if($(".pt-page-current")[0].id === "movies_player") {
					value = max(document.getElementById("movies_video").currentTime - 10, 0);
					document.getElementById("movies_video").currentTime = value;
					$(".movie_bar").width(document.getElementById("movies_video").duration / value);
				} else if($(".pt-page-current")[0].id === "series_player") {
					value = max(document.getElementById("series_video").currentTime - 10, 0);
					document.getElementById("series_video").currentTime = value;
					$(".serie_bar").width(document.getElementById("series_video").duration / value);
				} else if($(".pt-page-current")[0].id.includes("song") === true) {
					value = max(playerAPI.playing.currentTime - 10, 0);
					playerAPI.playing.currentTime = value;
					$(".myBar").width(playerAPI.playing.duration / value);
				}
			} else if(msg.message["speechValue"] === "LEFT") {
			  if($(".pt-page-current")[0].id === "series_player") {
				  /*		*/
			  } else if($(".pt-page-current")[0].id.includes("song")) {
				  playerAPI.prev();
			  }
		  } else if(msg.message["speechValue"] === "RIGHT") {
			  if($(".pt-page-current")[0].id === "series_player") {
				  /*		*/
			  } else if($(".pt-page-current")[0].id.includes("song")) {
				  playerAPI.next();
			  }
		  } else if(msg.message["speechValue"] === "UP") {
			  if($(".pt-page-current")[0].id === "movies_player") {
				    tmp = document.getElementById("movies_video").volume + 0.1;
					tmp = tmp > 1?1:tmp;
					document.getElementById("movies_video").volume = tmp;
					$(".movie_volume_bar").width(tmp * 100);
			  } if($(".pt-page-current")[0].id === "series_player") {
				    tmp = document.getElementById("series_video").volume + 0.1;
					tmp = tmp > 1?1:tmp;
					document.getElementById("series_video").volume = tmp;
					$(".serie_volume_bar").width(tmp * 100);
			  } else if($(".pt-page-current")[0].id.includes("song")) {
					tmp = playerAPI.playing.volume + 0.1;
					tmp = tmp > 1?1:tmp;
					playerAPI.playing.volume = tmp;
					$(".volumeBar").width(tmp * 100);
			  }
		  } else if(msg.message["speechValue"] === "DOWN") {
				if($(".pt-page-current")[0].id === "movies_player") {
					tmp = document.getElementById("movies_video").volume - 0.1;
					tmp = tmp < 0?0:tmp;
					document.getElementById("movies_video").volume = tmp;
					$(".movie_volume_bar").width(tmp * 100);
				} if($(".pt-page-current")[0].id === "series_player") {
						tmp = document.getElementById("series_video").volume - 0.1;
					tmp = tmp < 0?0:tmp;
					document.getElementById("series_video").volume = tmp;
					$(".serie_volume_bar").width(tmp * 100);
				} else if($(".pt-page-current")[0].id.includes("song")) {
					tmp = playerAPI.playing.volume - 0.1;
					tmp = tmp < 0?0:tmp;
					playerAPI.playing.volume = tmp;
					$(".volumeBar").width(tmp * 100);
				}
			} else if(msg.message["speechValue"] === "PLAYLISTS") {
				if($(".pt-page-current")[0].id.includes("song")) {
					$(".playlists").click();
				}
			} else if(msg.message["speechValue"] === "MY") {
				if($(".pt-page-current")[0].id.includes("movie")) {
					$(".to_mymovies").click();
				} if($(".pt-page-current")[0].id.includes("serie")) {
					$(".to_myseries").click();
				} else if($(".pt-page-current")[0].id.includes("song")) {
					$(".to_mysongs").click();
				}
			} else if(msg.message["speechValue"] === "LOBBY") {
				$(".to_lobby").click();
			} else if(msg.message["speechValue"] === "EXPLORE") {
				if($(".pt-page-current")[0].id.includes("movie")) {
					$(".to_movies_home").click();
				} if($(".pt-page-current")[0].id.includes("serie")) {
					$(".to_series_home").click();
				} else if($(".pt-page-current")[0].id.includes("song")) {
					$(".to_song_home").click();
				}
			} else if(msg.message["speechValue"] === "SEARCH") {
				if($(".pt-page-current")[0].id.includes("movie")) {
					$(".to_movies_search").click();
				} if($(".pt-page-current")[0].id.includes("serie")) {
					$(".to_series_search").click();
				} else if($(".pt-page-current")[0].id.includes("song")) {
					$(".to_songs_search").click();
				}
			} else if(msg.message["speechValue"] === "CLOSE") {
				window.close();
			} 

        // redirect to voice manager
        // Voice.Manager(msg.message);
	  } else if (msgType.indexOf("sensors") > -1) {
		  if(msgType === "sensors/touch") {
			  console.log(msg.message["id"]);
			  if(msg.message["id"] === 0) {
				  if($(".pt-page-current")[0].id === "series_player") {
					  /*		*/
				  } else if($(".pt-page-current")[0].id.includes("song")) {
					  playerAPI.prev();
				  }
			  } else if(msg.message["id"] === 1) {
				  if($(".pt-page-current")[0].id === "series_player") {
					  /*		*/
				  } else if($(".pt-page-current")[0].id.includes("song")) {
					  playerAPI.next();
				  }
			  } else if(msg.message["id"] === 2) {
				  if($(".pt-page-current")[0].id === "movies_player") {
					  $('.movie_muted').click();
				  } else if($(".pt-page-current")[0].id === "series_player") {
					  $('.serie_muted').click();
				  } else if($(".pt-page-current")[0].id.includes("song")) {
					  $('.muted').click();
				  }
			  } else if(msg.message["id"] === 3) {
				  if($(".pt-page-current")[0].id === "movies_player") {
					  playPauseMovie();
				  } else if($(".pt-page-current")[0].id === "series_player") {
					  playPauseSerie();
				  } else if($(".pt-page-current")[0].id.includes("song")) {
					  playerAPI.playPause();
				  }
			  }
		  } else if(msgType === "sensors/rotation") {
			value = msg.message["actualValue"] / 1000;
			  
			if($(".pt-page-current")[0].id === "movies_player") {
				document.getElementById("movies_video").currentTime = value;
				// $(".movie_volume_bar").width(value * 100);
			} else if($(".pt-page-current")[0].id === "series_player") {
				document.getElementById("series_video").currentTime = value;
				// $(".serie_volume_bar").width(value * 100);
			} else if($(".pt-page-current")[0].id.includes("song") === true) {
				playerAPI.playing.currentTime = playerAPI.playing.duration * value;
				$(".myBar").width(value * 100);
			}
		  } else if(msgType.includes("touchslider")) {
			  value = msg.message["actualValue"] / 1000;
			  
			  if(msg.message["serialNumber"] === 65317) {
				  if($(".pt-page-current")[0].id === "movies_player") {
					document.getElementById("movies_video").volume = value;
					$(".movie_volume_bar").width(value * 100);
				  } else if($(".pt-page-current")[0].id === "series_player") {
					document.getElementById("series_video").volume = value;
					$(".serie_volume_bar").width(value * 100);
				  } else if($(".pt-page-current")[0].id.includes("song") === true) {
					playerAPI.playing.volume = value;
					$(".volumeBar").width(value * 100);
				  }
			  } else if(msg.message["serialNumber"] === 65451) {
				  if($(".pt-page-current")[0].id === "movies_player") {
					document.getElementById("movies_video").volume = value;
					$(".movie_volume_bar").width(value * 100);
				  } else if($(".pt-page-current")[0].id === "series_player") {
					document.getElementById("series_video").volume = value;
					$(".serie_volume_bar").width(value * 100);
				  } else if($(".pt-page-current")[0].id.includes("song") === true) {
					$(".pt-page-current").find(".content").scrollTop($(".pt-page-current").find(".content").height() * (1 - value));
				  }
				  
			  }
		  }
		  // playerAPI.playPause();
        // redirect to sensor manager
        //Sensors.Manager(msg.message);
		
      }  else if(msgType === 'kinect/gesture'){
		  if(msg.message["gestureType"] === "JoinedHands") {
			  if($(".pt-page-current")[0].id === "movies_player") {
				  playPauseMovie();
			  } else if($(".pt-page-current")[0].id === "series_player") {
				  playPauseSerie();
			  } else if($(".pt-page-current")[0].id.includes("song")) {
				  playerAPI.playPause();
			  }
		  } else if(msg.message["gestureType"] === "SwipeLeft") {
			  if($(".pt-page-current")[0].id === "series_player") {
				  /*		*/
			  } else if($(".pt-page-current")[0].id.includes("song")) {
				  playerAPI.prev();
			  }
		  } else if(msg.message["gestureType"] === "SwipeRight") {
			  if($(".pt-page-current")[0].id === "series_player") {
				  /*		*/
			  } else if($(".pt-page-current")[0].id.includes("song")) {
				  playerAPI.next();
			  }
		  } else if(msg.message["gestureType"].includes("SwipeUp")) {
			  if($(".pt-page-current")[0].id === "movies_player") {
				    tmp = document.getElementById("movies_video").volume + 0.1;
					tmp = tmp > 1?1:tmp;
					document.getElementById("movies_video").volume = tmp;
					$(".movie_volume_bar").width(tmp * 100);
			  } if($(".pt-page-current")[0].id === "series_player") {
				    tmp = document.getElementById("series_video").volume + 0.1;
					tmp = tmp > 1?1:tmp;
					document.getElementById("series_video").volume = tmp;
					$(".serie_volume_bar").width(tmp * 100);
			  } else if($(".pt-page-current")[0].id.includes("song")) {
					tmp = playerAPI.playing.volume + 0.1;
					tmp = tmp > 1?1:tmp;
					playerAPI.playing.volume = tmp;
					$(".volumeBar").width(tmp * 100);
			  }
		  } else if(msg.message["gestureType"].includes("SwipeDown")) {
			if($(".pt-page-current")[0].id === "movies_player") {
				    tmp = document.getElementById("movies_video").volume - 0.1;
					tmp = tmp < 0?0:tmp;
					document.getElementById("movies_video").volume = tmp;
					$(".movie_volume_bar").width(tmp * 100);
			  } if($(".pt-page-current")[0].id === "series_player") {
				    tmp = document.getElementById("series_video").volume - 0.1;
					tmp = tmp < 0?0:tmp;
					document.getElementById("series_video").volume = tmp;
					$(".serie_volume_bar").width(tmp * 100);
			  } else if($(".pt-page-current")[0].id.includes("song")) {
					tmp = playerAPI.playing.volume - 0.1;
					tmp = tmp < 0?0:tmp;
					playerAPI.playing.volume = tmp;
					$(".volumeBar").width(tmp * 100);
			  }
		  }
		  
		  // console.log(msg.message["gestureType"]);
		  // console.log(msg.message["trackingId"]);
	  }
    };
  }

  /**
   * Disconnect from socket server
   */
  function Disconnect() {
    socketConnection.disconnect();
    console.info('Sockets disconnected!');
  }

  /**
   * Send message to socket server
   * 
   * @param {string} type - Type of message
   * @param {any} msg - Object to send as message  
   */
  function SendMessage(type, msg) {
    socketConnection.send({
      type: type,
      message: msg
    });
  }

  return {
    Connect: Connect,
    Disconnect: Disconnect,
    SendMessage: SendMessage
  };
})();