function send_mysongs() {
    var ws = new WebSocket('ws://' + GlobalConfig.ip_address + ':6556');

    ws.onopen = function() {
        message = "mysongs";

        ws.send(message);
        ws.onmessage = function(message) {
            songs = message.data.split("\n");

            var artists = [];
            var genres = [];
            var genres_counter = 0;
            var dates = [];
            var albums = [];
            var index = songs.indexOf("");
            songs.splice(index, 1);
            playerAPI.tmpPlaylist = [songs.length];
			$(".display_songs").find("tbody").html("");

            for(var i = 0; i < songs.length; i++) {
                id = "id" + parseInt(songs[i].substring(2));
                song = playerAPI.songs[id];
                playerAPI.mysongs[i] = id;
                playerAPI.tmpPlaylist[i] = id;
                artists[i] = song.artist;
                for(var j = 0; j < song.genre.length; j++) {
                    genres[genres_counter++] = song.genre[j];
                }
                dates[i] = parseInt(song.release.split(" ")[2]);
                albums[i] = song.album;

                $(".display_songs").find("tbody").append(
                    `<tr>
                            <td><button onclick="play_mysong('${i}')" class="fa fa-play-circle-o ${playerAPI.mysongs[i]}"></button></td>
                            <td><button onclick="open_playlists_modal('${id}');"><em class="fa fa-plus"></em></button></td>
                            <td><button onclick="remove_from_mysongs('${id}', this)"><em class="fa fa-trash-o"></em></button></td>
                            <td><button onclick="display_song_details('${id}')">${song.title}</button></td>
                            <td>${song.artist}</td>
                            <td>${song.album}</td>
                            <td>${song.release}</td>
                            <td>${song.duration}</td>
                        </tr>`);
            }

            // Filter duplicates
            tmp = genres.filter(function(item, pos) {
                return genres.indexOf(item) == pos;
            });
            genres = tmp;

            $("#genres_content").html("");
            for(i = 0; i < genres.length; i++) {
                $("#genres_content").append('<input onchange="apply_filters_mysong()" type="checkbox" name="genre" value="' + genres[i] + '">' + genres[i] + '<br>');
            }
            tmp = artists.filter(function(item, pos) {
                return artists.indexOf(item) == pos;
            });
            artists = tmp;
            $("#artists_content").html("");
            for(i = 0; i < artists.length; i++) {
                $("#artists_content").append('<input onchange="apply_filters_mysong()" type="checkbox" name="artist" value="' + artists[i] + '">' + artists[i] + '<br>');
            }
            tmp = dates.filter(function(item, pos) {
                return dates.indexOf(item) == pos;
            });
            dates = tmp;
            dates = dates.sort(function (a, b) {  return b - a;  });
            tmp = albums.filter(function(item, pos) {
                return albums.indexOf(item) == pos;
            });
            albums = tmp;
            $("#albums_content").html("");
            for(i = 0; i < albums.length; i++) {
                $("#albums_content").append('<input onchange="apply_filters_mysong()" type="checkbox" name="album" value="' + albums[i] + '">' + albums[i] + '<br>');
            }
            $("#from").html("");
            $("#to").html("");
            $("#from").append('<option value=\"' + "none" + '\"></option>');
            $("#to").append('<option value=\"' + "none" + '\"></option>');
            for(i = 0; i < dates.length; i++) {
                $("#from").append('<option value=\"' + dates[i] + '\">' + dates[i] + '</option>');
                $("#to").append('<option value=\"' + dates[i] + '\">' + dates[i] + '</option>');
            }
        };
    };
}

function play_mysong(curr_song) {
    playerAPI.playlist = playerAPI.tmpPlaylist;
    playerAPI.row = parseInt(curr_song);
    playerAPI.width = 0;
    $("#playing").find("source")[0].src = "../ressrc/songs/" + playerAPI.songs[playerAPI.playlist[curr_song]].file;
    $("#playing")[0].load();

    $(".controls").each( function () {
        var play_pause = $(this);
        play_pause.find("button").find("em")[2].innerHTML = "&#xf28c;";
    });

    $(".expand").each( function () {
        var expand_button = $(this);
        expand_button.click(function() {
            display_song_expand_details(playerAPI.playlist[curr_song]);
        })
    });

    $( ".myBar" ).each( function () {
        var myBar = $(this);
        myBar.css("width", "0");
    });
    $("#playing")[0].play();
    $(".fa-pause-circle-o").addClass("fa-play-circle-o");
    $(".fa-pause-circle-o").removeClass("fa-pause-circle-o");
    $("." + playerAPI.playlist[curr_song]).removeClass("fa-play-circle-o");
    $("." + playerAPI.playlist[curr_song]).addClass("fa-pause-circle-o");
    $(".title").html(playerAPI.songs[playerAPI.playlist[curr_song]].title + '<button onclick="open_playlists_modal(\'' + playerAPI.playlist[curr_song] + '\')"><em class="fa">&#xf067;</em></button>');
    $(".artist").text(playerAPI.songs[playerAPI.playlist[curr_song]].artist);
    $(".img").attr("src", "../ressrc/songs_images/" + playerAPI.songs[playerAPI.playlist[curr_song]].img);
}

function apply_filters_mysong() {
    let genres = [];
    let artists = [];
    let albums = [];
    let counter = 0;

    for(i = 0; i < $("#genres_content").find("input").length; i++) {
        if($("#genres_content").find("input")[i].checked) {
            genres[counter++] = $("#genres_content").find("input")[i].value;
        }
    }

    counter = 0;
    for(let i = 0; i < $("#artists_content").find("input").length; i++) {
        if($("#artists_content").find("input")[i].checked) {
            artists[counter++] = $("#artists_content").find("input")[i].value;
        }
    }

    counter = 0;
    for(let i = 0; i < $("#albums_content").find("input").length; i++) {
        if($("#albums_content").find("input")[i].checked) {
            albums[counter++] = $("#albums_content").find("input")[i].value;
        }
    }

    let from = $( "#from option:selected" ).text();
    if(from === "") {
        from = 0;
    }
    let to = $( "#to option:selected" ).text();
    if(to === "") {
        to = (new Date).getFullYear();
    }

    let tmp_mysongs = playerAPI.mysongs.slice();
    let check = [];

    for(let i = 0; i < tmp_mysongs.length; i++) {
        check[i] = true;
    }

    if(genres.length > 0) {
        for(let i = 0; i < tmp_mysongs.length; i++) {
            let flag = false;
            for(let j = 0; j < genres.length; j++) {
                for(let k = 0; k < playerAPI.songs[tmp_mysongs[i]].genre.length; k++) {
                    if(playerAPI.songs[tmp_mysongs[i]].genre[k] === genres[j]) {
                        flag = true;
                        break;
                    }
                }
            }
            check[i] = flag;
        }
    }

    if(artists.length > 0) {
        for(let i = 0; i < tmp_mysongs.length; i++) {
            let flag = false;
            for(let j = 0; j < artists.length; j++) {
                if(playerAPI.songs[tmp_mysongs[i]].artist === artists[j] && check[i]) {
                    flag = true;
                    break;
                }
            }
            check[i] = flag;
        }
    }

    for(let i = 0; i < tmp_mysongs.length; i++) {
        if(parseInt(playerAPI.songs[tmp_mysongs[i]].release.split(" ")[2]) < from ||
           parseInt(playerAPI.songs[tmp_mysongs[i]].release.split(" ")[2]) > to) {
            check[i] = false;
        }
    }

    if(albums.length > 0) {
        for(let i = 0; i < tmp_mysongs.length; i++) {
            let flag = false;
            for(let j = 0; j < albums.length; j++) {
                if(playerAPI.songs[tmp_mysongs[i]].album === albums[j] && check[i]) {
                    flag = true;
                    break;
                }
            }
            check[i] = flag;
        }
    }

    if($("#mysongs_input_keywords").val() !== "") {
        words = $("#mysongs_input_keywords").val().split(" ");
        for(let i = 0; i < tmp_mysongs.length; i++) {
            flag = false;
            for(let j = 0; j < words.length; j++) {
                if(contains_word(playerAPI.songs[tmp_mysongs[i]].title, words[j]) && check[i]) {
                    flag = true;
                    break;
                }

                if(!flag && contains_word(playerAPI.songs[tmp_mysongs[i]].album, words[j]) && check[i]) {
                    flag = true;
                    break;
                }

                if(!flag && contains_word(playerAPI.songs[tmp_mysongs[i]].artist, words[j]) && check[i]) {
                    flag = true;
                    break;
                }

                if(!flag && contains_word(playerAPI.songs[tmp_mysongs[i]].release, words[j]) && check[i]) {
                    flag = true;
                    break;
                }

                if(!flag && contains_word(playerAPI.songs[tmp_mysongs[i]].genre.toString(), words[j]) && check[i]) {
                    flag = true;
                    break;
                }
            }
            check[i] = flag;

        }
    }

    $("#mysongs_table").find("tbody").html("");
    for(let i = 0; i < tmp_mysongs.length; i++) {
        if(check[i]) {
            song = playerAPI.songs[tmp_mysongs[i]];
            $("#mysongs_table").find("tbody").append(
                `<tr>
                    <td><button onclick="play_mysong(${i})" class="fa fa-play-circle-o ${playerAPI.mysongs[i]}"></button></td>
                    <td><button onclick="open_playlists_modal('${tmp_mysongs[i]}');"><em class="fa fa-plus"></em></button></td>
                    <td><button onclick="remove_playlist('${tmp_mysongs[i]}', this)"><em class="fa fa-trash-o"></em></button></td>
                    <td><button onclick="display_song_details('${tmp_mysongs[i]}')">${song.title}</button></td>
                    <td>${song.artist}</td>
                    <td>${song.album}</td>
                    <td>${song.release}</td>
                    <td>${song.duration}</td>
                </tr>`);
        }
    }
}

function play_song(curr_song) {
    for (i = 0; i < playerAPI.songs.crowd; i++) {
        playerAPI.playlist[i] = "id" + i;
        playerAPI.tmpPlaylsit[i] = "id" + i;
    }
    playerAPI.row = playerAPI.playlist.indexOf(curr_song);
    $("#playing").find("source")[0].src = "../ressrc/songs/" + playerAPI.songs[curr_song].file;
    $("#playing")[0].load();

    $(".controls").each( function () {
		var play_pause = $(this);
		play_pause.find("button").find("em")[2].innerHTML = "&#xf28c;";
	});

    $(".expand").each( function () {
		var expand_button = $(this);
        expand_button.click(function() {
            display_song_expand_details(curr_song);
        })
	});
	
	$( ".myBar" ).each( function () {
		var myBar = $(this);
		myBar.css("width", "0");
	});
    $("#playing")[0].play();
    $(".title").html(playerAPI.songs[curr_song].title + '<button onclick="open_playlists_modal(\'' + curr_song + '\')"><em style="font-size:24px" class="fa">&#xf067;</em></button>');
    $(".artist").text(playerAPI.songs[curr_song].artist);
    $(".img").attr("src", "../ressrc/songs_images/" + playerAPI.songs[curr_song].img);
}

function play_playlist_song(curr_song) {
    playerAPI.playlist = playerAPI.tmpPlaylist;

    for (i = 0; i < playerAPI.songs.crowd; i++) {
        playerAPI.tmpPlaylsit[i] = "id" + i;
    }
    playerAPI.row = playerAPI.playlist.indexOf(curr_song);
    $("#playing").find("source")[0].src = "../ressrc/songs/" + playerAPI.songs[curr_song].file;
    $("#playing")[0].load();
    $(".controls").each( function () {
        var play_pause = $(this);
        play_pause.find("button").find("em")[2].innerHTML = "&#xf28c;";
    });

    $(".expand").each( function () {
        var expand_button = $(this);
        expand_button.click(function() {
            display_song_expand_details(curr_song);
        })
    });

    $( ".myBar" ).each( function () {
        var myBar = $(this);
        myBar.css("width", "0");
    });
    $("#playing")[0].play();
    $(".title").html(playerAPI.songs[curr_song].title + '<button onclick="open_playlists_modal(\'' + curr_song + '\')"><em style="font-size:24px" class="fa">&#xf067;</em></button>');
    $(".artist").text(playerAPI.songs[curr_song].artist);
    $(".img").attr("src", "../ressrc/songs_images/" + playerAPI.songs[curr_song].img);
}

function add_to_mysongs(song_id) {
    var ws = new WebSocket('ws://' + GlobalConfig.ip_address + ':6556');

    ws.onopen = function() {
        message = '{ "type": "add to my songs", "song_id":"' + song_id + '" }';

        ws.send(message);

        ws.onmessage = function(message) {
            alert(message.data);
        };
    };
    $("#playlists_modal").css("display", "none");
    myFunction(`Song '${playerAPI.songs[song_id].title}' added to 'My Songs' successfully`, true);
}

function add_to_playlist(song_id, playlist) {
    var ws = new WebSocket('ws://' + GlobalConfig.ip_address + ':6556');

    ws.onopen = function() {
        message = '{ "type": "add to playlist", "playlist":"' + playlist + '" , "song_id":"' + song_id + '" }';

        ws.send(message);
    };
    $("#playlists_modal").css("display", "none");
    myFunction(`Song '${playerAPI.songs[song_id].title}' added to playlist '${playlist}' successfully`, true);
}

function add_new_playlist(playlist) {
    var ws = new WebSocket('ws://' + GlobalConfig.ip_address + ':6556');

    ws.onopen = function() {
        message = '{ "type": "new playlist", "playlist":"' + playlist + '"}';
        ws.send(message);
        get_playlists();
    };
}

// Get the button that opens the modal
// When the user clicks the button, open the modal
function open_playlists_modal(song_id) {
    $("#playlists_modal").find("h3")[0].innerHTML = "Choose playlist for '" + playerAPI.songs[song_id].title + "'";
    $("#add").click(function() {
        new_playlist = $("#set_new_playlist").val();
        add_new_playlist(new_playlist);
        add_to_playlist(song_id, new_playlist);
    });

    var ws = new WebSocket('ws://' + GlobalConfig.ip_address + ':6556');
    ws.onopen = function() {
        message = "playlists";

        ws.send(message);
        ws.onmessage = function (message) {
            playlists = JSON.parse(message.data);
            keys = Object.keys(playlists);

            html_display = ``;

            for(i = 0; i < playlists.crowd; i++) {
                html_display += `
                                <div class="col-xs-12">
                                    <button onclick="add_to_playlist('${song_id}', '${keys[i + 1].replace(/(\r\n|\n|\r)/gm,"")}')" style="width:100%; color: white;">${keys[i + 1]}</button>
                                </div>`;
            }

            html_display += `
                <div class="col-xs-12"><button onclick="add_to_mysongs('${song_id}')" style="width:100%; color: white;">My songs</button></div>
                <div class="clearfix"></div>`;

             html_display += `
                <h3>Add to new Playlist</h3>
                <div class="col-xs-12"><input id="set_new_playlist" style="width:100%" placeholder="New Plalist"></input></div>`;

            $(".modal-body")[0].innerHTML = html_display;
            $("#playlists_modal").css("display", "block");
        };
    };
}


function get_playlists() {
    var ws = new WebSocket('ws://' + GlobalConfig.ip_address + ':6556');

    ws.onopen = function() {
        message = "playlists";

        ws.send(message);
        ws.onmessage = function(message) {
            data = JSON.parse(message.data);
            playlists = [];
            keys = Object.keys(data);
            for(i = 0; i < data.crowd; i++) {
                playlists[i] = keys[i + 1];
            }

            $("#playlists").find("tbody").html("");
            for(i = 0; i < playlists.length; i++) {
                min = 0;
                sec = 0;
                total = 0;
                for(j = 0; j < data[playlists[i]].length; j++) {
                    current_song = data[playlists[i]][j];
                    min += parseInt(playerAPI.songs[current_song].duration.split(":")[0]);
                    sec += parseInt(playerAPI.songs[current_song].duration.split(":")[1]);

                    min += Math.floor(sec / 60);
                    sec = sec % 60;

                    hours = Math.floor(min / 60);
                    min = min % 60;
                    total = "";
                    if(hours > 0) {
                        if(hours < 10) {
                            total += "0";
                        }
                        total += hours + ":";
                        if(min < 10) {
                            total += "0";
                        }
                    }

                    total += min + ":";
                    if(sec < 10) {
                        total += "0";
                    }
                    total += sec;
                }
                $("#playlists").find("tbody").append(`
                    <tr>
                        <td><button onclick="play_playlist('${playlists[i]}')"><em class="fa">&#xf01d;</em></button></td>
                        <td><button onclick="remove_playlist('${playlists[i]}', this)"><em class="fa fa-trash-o"></em></button></td></td>
                        <td>${i + 1}</td>
                        <td><button onclick="read_playlist('${playlists[i]}')">${playlists[i]}</button></td>
                        <td><em class="fa">${data[playlists[i]].length}</em></td>
                        <td><em class="fa">${total}</em></td>
                    </tr>`
                )
            }
        }
    }
}

function read_playlist(playlist) {
    let playlist_songs = "";
    $("#curr_playlist").html("Playlist - " + playlist);
    goToPage("song_playlist");
    var ws = new WebSocket('ws://' + GlobalConfig.ip_address + ':6556');

    ws.onopen = function() {
        message = '{ "type": "playlist", "title":"' + playlist + '"}';

        ws.send(message);
        ws.onmessage = function (message) {
            playlist_songs = message.data.split("\n");
            $("#playlist_songs").find("tbody").html("");
            playerAPI.tmpPlaylist = [playlist_songs.length];

            var index = playlist_songs.indexOf("");
            playlist_songs.splice(index, 1);
            for(var i = 0; i < playlist_songs.length; i++) {
                song = playerAPI.songs["id" + parseInt(playlist_songs[i].substring(2))];
                id = playlist_songs[i].replace(/(\r\n|\n|\r)/gm,"");
                playerAPI.tmpPlaylist[i] = id;
                $("#playlist_songs").find("tbody").append(
                    `<tr>
                            <td><button onclick="play_playlist_song('${id}')" class="fa fa-play-circle-o ${id}"></button></td>
                            <td><button onclick="open_playlists_modal('${id}');"><em class="fa fa-plus"></em></button></td>
                            <td><button onclick="remove_from_playlist('${playlist}', '${id}', this)"><em class="fa fa-trash-o"></em></button></td>
                            <td><button onclick="display_song_details('${id}')">${song.title}</button></td>
                            <td>${song.artist}</td>
                            <td>${song.album}</td>
                            <td>${song.release}</td>
                            <td>${song.duration}</td>
                        </tr>`);
            }
            goToPage("song_playlist");
        };
    };
}

function play_playlist(playlist) {
    let playlist_songs = "";
    var ws = new WebSocket('ws://' + GlobalConfig.ip_address + ':6556');

    ws.onopen = function() {
        message = '{ "type": "playlist", "title":"' + playlist + '"}';

        ws.send(message);
        ws.onmessage = function (message) {
            playlist_songs = message.data.split("\n");
            playerAPI.tmpPlaylist = [];
            playerAPI.playlist = [];
            for(var i = 0; i < playlist_songs.length; i++) {

                if(playlist_songs[i].replace(/(\r\n|\n|\r)/gm,"") === "") continue;
                playerAPI.tmpPlaylist[i] = "id" + parseInt(playlist_songs[i].replace(/(\r\n|\n|\r)/gm,"").substring(2));
                playerAPI.playlist[i] = "id" + parseInt(playlist_songs[i].replace(/(\r\n|\n|\r)/gm,"").substring(2));
            }
            playerAPI.row = 0;
            play_playlist_song(playerAPI.playlist[0]);
        };
    };
}

function remove_playlist(playlist, this_elem) {
    var ws = new WebSocket('ws://' + GlobalConfig.ip_address + ':6556');

    ws.onopen = function() {
        message = '{ "type": "remove playlist", "playlist":"' + playlist + '"}';

        ws.send(message);
    };

    $(this_elem).parents(':eq(1)').html("");
    myFunction(`Playlist '${playlist}' removed from 'Playlists' successfully`, true);
}

function remove_from_playlist(playlist, song_id, this_elem) {
    var ws = new WebSocket('ws://' + GlobalConfig.ip_address + ':6556');

    ws.onopen = function() {
        message = '{ "type": "remove from playlist", "playlist":"' + playlist + '", "song_id":"' + song_id + '"}';

        ws.send(message);
    };

    $(this_elem).parents(':eq(1)').html("");
    myFunction(`Song '${playerAPI.songs[song_id].title}' removed from playlist '${playlist}' successfully`, true);
}

function remove_from_mysongs(song_id, this_elem) {
    var ws = new WebSocket('ws://' + GlobalConfig.ip_address + ':6556');

    ws.onopen = function() {
        message = '{ "type": "remove from mysongs", "song_id":"' + song_id + '"}';

        ws.send(message);
    };

    $(this_elem).parents(':eq(1)').html("");
    myFunction(`Song '${playerAPI.songs[song_id].title}' removed from 'My Songs' successfully`, true);
}

function search_songs(keywords) {
    $("#inside_keywords").val(keywords);
    let  artists = [];
    let  genres = [];
    let  genres_counter = 0;
    let  dates = [];
    let  albums = [];
    $("#mysongs_table").find("tbody").html("");
    for(let i = 0; i < playerAPI.songs.crowd; i++) {
        let id = "id" + i;
        let song = playerAPI.songs[id];
        artists[i] = song.artist;
        for(let j = 0; j < song.genre.length; j++) {
            genres[genres_counter++] = song.genre[j];
        }
        dates[i] = parseInt(song.release.split(" ")[2]);
        albums[i] = song.album;
        $("#mysongs_table").find("tbody").append(
            `<tr>
                <td><button onclick="play_song(${id})" class="fa fa-play-circle-o ${"id" + i}"></button></td>
                <td><button onclick="open_playlists_modal('${id}');"><em class="fa fa-plus"></em></button></td>
                <td><button onclick="display_song_details('${id}')">${song.title}</button></td>
                <td>${song.artist}</td>
                <td>${song.album}</td>
                <td>${song.release}</td>
                <td>${song.duration}</td>
            </tr>`);
    }

    // Filter duplicates
    tmp = genres.filter(function(item, pos) {
        return genres.indexOf(item) == pos;
    });
    genres = tmp;

    $("#search_genres_content").html("");
    for(i = 0; i < genres.length; i++) {
        $("#search_genres_content").append('<input type="checkbox" name="genre" value="' + genres[i] + '">' + genres[i] + '<br>');
    }
    tmp = artists.filter(function(item, pos) {
        return artists.indexOf(item) == pos;
    });
    artists = tmp;
    $("#search_artists_content").html("");
    for(i = 0; i < artists.length; i++) {
        $("#search_artists_content").append('<input type="checkbox" name="artist" value="' + artists[i] + '">' + artists[i] + '<br>');
    }
    tmp = dates.filter(function(item, pos) {
        return dates.indexOf(item) == pos;
    });
    dates = tmp;
    dates = dates.sort(function (a, b) {  return b - a;  });
    tmp = albums.filter(function(item, pos) {
        return albums.indexOf(item) == pos;
    });
    albums = tmp;
    $("#search_albums_content").html("");
    for(i = 0; i < albums.length; i++) {
        $("#search_albums_content").append('<input type="checkbox" name="album" value="' + albums[i] + '">' + albums[i] + '<br>');
    }
    $("#search_from").html("");
    $("#search_to").html("");
    $("#search_from").append('<option value=\"' + "none" + '\"></option>');
    $("#search_to").append('<option value=\"' + "none" + '\"></option>');
    for(i = 0; i < dates.length; i++) {
        $("#search_from").append('<option value=\"' + dates[i] + '\">' + dates[i] + '</option>');
        $("#search_to").append('<option value=\"' + dates[i] + '\">' + dates[i] + '</option>');
    }

}

function apply_filters_search() {
    let genres = [];
    let artists = [];
    let albums = [];
    let counter = 0;

    for(i = 0; i < $("#search_genres_content").find("input").length; i++) {
        if($("#search_genres_content").find("input")[i].checked) {
            genres[counter++] = $("#search_genres_content").find("input")[i].value;
        }
    }

    counter = 0;
    for(let i = 0; i < $("#search_artists_content").find("input").length; i++) {
        if($("#search_artists_content").find("input")[i].checked) {
            artists[counter++] = $("#search_artists_content").find("input")[i].value;
        }
    }

    counter = 0;
    for(let i = 0; i < $("#search_albums_content").find("input").length; i++) {
        if($("#search_albums_content").find("input")[i].checked) {
            albums[counter++] = $("#search_albums_content").find("input")[i].value;
        }
    }

    let from = $( "#search_from option:selected" ).text();
    if(from === "") {
        from = 0;
    }
    let to = $( "#search_to option:selected" ).text();
    if(to === "") {
        to = (new Date).getFullYear();
    }


    let check = [];

    for(let i = 0; i < playerAPI.songs.crowd; i++) {
        check[i] = true;
    }

    if(genres.length > 0) {
        for(let i = 0; i < playerAPI.songs.crowd; i++) {
            let flag = false;
            for(let j = 0; j < genres.length; j++) {
                for(let k = 0; k < playerAPI.songs["id" + i].genre.length; k++) {
                    if(playerAPI.songs["id" + i].genre[k] === genres[j]) {
                        flag = true;
                        break;
                    }
                }
            }
            check[i] = flag;
        }
    }

    if(artists.length > 0) {
        for(let i = 0; i < playerAPI.songs.crowd; i++) {
            let flag = false;
            for(let j = 0; j < artists.length; j++) {
                if(playerAPI.songs["id" + i].artist === artists[j] && check[i]) {
                    flag = true;
                    break;
                }
            }
            check[i] = flag;
        }
    }

    for(let i = 0; i < playerAPI.songs.crowd; i++) {
        if(parseInt(playerAPI.songs["id" + i].release.split(" ")[2]) < from ||
            parseInt(playerAPI.songs["id" + i].release.split(" ")[2]) > to) {
            check[i] = false;
        }
    }

    if(albums.length > 0) {
        for(let i = 0; i < playerAPI.songs.crowd; i++) {
            let flag = false;
            for(let j = 0; j < albums.length; j++) {
                if(playerAPI.songs["id" + i].album === albums[j] && check[i]) {
                    flag = true;
                    break;
                }
            }
            check[i] = flag;
        }
    }

    if($("#inside_keywords").val() !== "") {
        words = $("#inside_keywords").val().split(" ");
        for(let i = 0; i < playerAPI.songs.crowd; i++) {
            flag = false;
            for(let j = 0; j < words.length; j++) {
                if(contains_word(playerAPI.songs["id" + i].title, words[j]) && check[i]) {
                    flag = true;
                    break;
                }

                if(!flag && contains_word(playerAPI.songs["id" + i].album, words[j]) && check[i]) {
                    flag = true;
                    break;
                }

                if(!flag && contains_word(playerAPI.songs["id" + i].artist, words[j]) && check[i]) {
                    flag = true;
                    break;
                }

                if(!flag && contains_word(playerAPI.songs["id" + i].release, words[j]) && check[i]) {
                    flag = true;
                    break;
                }

                if(!flag && contains_word(playerAPI.songs["id" + i].genre.toString(), words[j]) && check[i]) {
                    flag = true;
                    break;
                }
            }
            check[i] = flag;
        }
    }

    $("#").find("tbody").html("");
    for(let i = 0; i < playerAPI.songs.crowd; i++) {
        if(check[i]) {
            song = playerAPI.songs["id" + i];
            $("#mysongs_table").find("tbody").append(
                `<tr>
                    <td><button onclick="play_song('${"id" + i}')" class="fa fa-play-circle-o ${"id" + i}"></button></td>
                    <td><button onclick="open_playlists_modal('${"id" + i}')"><em class="fa">&#xf067;</em></button></td>
                    <td><button onclick="display_song_details('${"id" + i}')">${song.title}</button></td>
                    <td>${song.artist}</td>
                    <td>${song.album}</td>
                    <td>${song.release}</td>
                    <td>${song.duration}</td>
                </tr>`);
        }
    }
}

function set_song_new_releases() {
    $("#song_new_releases_content").html("");

    for(let i = 0; i < playerAPI.songs.crowd; i++) {
        if (playerAPI.songs["id" + i].release.split(" ")[2] === (new Date()).getFullYear().toString()) {
            $("#song_new_releases_content").append(`
                        <div class="col-xs-3" onclick="display_song_details('id' + ${i})">
                            <img class="img-responsive" src="../ressrc/songs_images/${playerAPI.songs["id" + i].img}"/>
                            <p>${playerAPI.songs["id" + i].title}</p>
                            <small>${playerAPI.songs["id" + i].artist}</small>
                        </div>
                        `)
        }
    }
}

function open_new_playlist_modal() {
    $('#new_playlist_modal').css('display', 'block');
    $("#playlist_title").focus();
}