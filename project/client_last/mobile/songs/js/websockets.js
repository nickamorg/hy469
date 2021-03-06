function send_mysongs() {
    var ws = new WebSocket('ws://' + "localhost" + ':6556');

    ws.onopen = function() {
        message = "mysongs";

        ws.send(message);
        ws.onmessage = function(message) {
            songs = message.data.split("\n");

            var index = songs.indexOf("");
            songs.splice(index, 1);

            var artists = [];
            var genres = [];
            var genres_counter = 0;
            var dates = [];
            var albums = [];
            playerAPI.tmpPlaylist = [songs.length];
            $("#mysongs_content").html("");
            for(var i = 0; i < songs.length; i++) {
                song = playerAPI.songs["id" + parseInt(songs[i].substring(2))];
                playerAPI.mysongs[i] = "id" + parseInt(songs[i].substring(2));
                playerAPI.tmpPlaylist[i] = "id" + parseInt(songs[i].substring(2));
                artists[i] = song.artist;
                for(var j = 0; j < song.genre.length; j++) {
                    genres[genres_counter++] = song.genre[j];
                }
                
                dates[i] = parseInt(song.release.split(" ")[2]);
                albums[i] = song.album;
                $("#mysongs_content").append(
                    `<div class="col-xs-12">
                        <div class="col-xs-2" style="height:100px; line-height:100px;">
                            <img id="img" style="width:80px" src="../ressrc/songs_images/${song.img}">
                        </div>
                        <div class="col-xs-7">
                            <button onclick="display_song_details('id' + ${parseInt(songs[i].substring(2))})" style="text-align:left;">
                                <p style=" overflow-x: hidden; line-height:1.2; font-size:30px">${song.title}</p>
                                <p style="white-space:nowrap; overflow-x: hidden; line-height:1.2; font-size:30px">${song.artist}<p>
                            </button>
                        </div>
                        <div class="col-xs-1" style="padding:0;  height:100px; line-height:100px;">
                            <button onclick="play_mysong(${i})"><em class="fa" style="font-size:40px">&#xf01d;</em></button>
                        </div>
                        <div class="col-xs-1" style="padding:0; height:100px; line-height:100px;">
                            <button onclick="open_playlists_modal('${"id" + parseInt(songs[i].substring(2))}');" style="float:right"><em class="fa fa-plus" style="font-size:40px"></em></button>
                        </div>
                        <div class="col-xs-1" style="padding:0; height:100px; line-height:100px;">
                            <button onclick="remove_from_mysongs('${"id" + parseInt(songs[i].substring(2))}', this);" style="float:right"><em class="fa fa-trash-o" style="font-size:40px"></em></button>
                        </div>
                    </div>`);
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
    playerAPI.row = curr_song;
    $("#playing").find("source")[0].src = "../ressrc/songs/" + playerAPI.songs[playerAPI.playlist[curr_song]].file;
    $("#playing")[0].load();
    $("#play_button").find("em")[0].innerHTML = "&#xf28c;";
    $("#title_artist").html(playerAPI.songs[playerAPI.playlist[curr_song]].title + " - " + playerAPI.songs[playerAPI.playlist[curr_song]].artist);
    $("#expand_player").find("div").find("img")[0].src = "../ressrc/songs_images/" + playerAPI.songs[playerAPI.playlist[curr_song]].img;
    $("#expand_player").find("div").find("p")[6].innerHTML = playerAPI.songs[playerAPI.playlist[curr_song]].title;
    $("#expand_player").find("div").find("p")[7].innerHTML = playerAPI.songs[playerAPI.playlist[curr_song]].artist;
    $("#expand_player").find("div").find("p")[8].innerHTML = playerAPI.songs[playerAPI.playlist[curr_song]].genre;
    $("#expand_player").find("div").find("p")[9].innerHTML = playerAPI.songs[playerAPI.playlist[curr_song]].album;
    $("#expand_player").find("div").find("p")[10].innerHTML = playerAPI.songs[playerAPI.playlist[curr_song]].release;
    $("#expand_player").find("div").find("p")[11].innerHTML = playerAPI.songs[playerAPI.playlist[curr_song]].duration;

    $("#add_from_expand").click(function() {
        $("#expand_player").removeClass("in");
        open_playlists_modal(playerAPI.playlist[playerAPI.row]);
    });

    $("#expand_lyrics").html("<pre>" + playerAPI.songs[playerAPI.playlist[curr_song]].lyrics + "</pre>");
    playerAPI.currentID = playerAPI.mysongs[curr_song];
    $("#playing")[0].play();
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

    $("#mysongs_content").html("");
    for(let i = 0; i < tmp_mysongs.length; i++) {
        if(check[i]) {
            song = playerAPI.songs[tmp_mysongs[i]];
            $("#mysongs_content").append(
                `<div class="col-xs-12">
                        <div class="col-xs-2" style="height:100px; line-height:100px;">
                            <img id="img" style="width:80px" src="../ressrc/songs_images/${song.img}">
                        </div>
                        <div class="col-xs-7">
                            <button onclick="display_song_details('id' + ${parseInt(songs[i].substring(2))})" style="text-align:left;">
                                <p style="white-space:nowrap; overflow-x: hidden; line-height:1.2; font-size:30px">${song.title}</p>
                                <p style="white-space:nowrap; overflow-x: hidden; line-height:1.2; font-size:30px">${song.artist}<p>
                            </button>
                        </div>
                        <div class="col-xs-1" style="padding:0;  height:100px; line-height:100px;">
                            <button onclick="play_mysong(${i})"><em class="fa" style="font-size:40px">&#xf01d;</em></button>
                        </div>
                        <div class="col-xs-1" style="padding:0; height:100px; line-height:100px;">
                            <button onclick="open_playlists_modal('${"id" + parseInt(songs[i].substring(2))}');" style="float:right"><em class="fa fa-plus" style="font-size:40px"></em></button>
                        </div>
                        <div class="col-xs-1" style="padding:0; height:100px; line-height:100px;">
                            <button onclick="remove_from_mysongs('${"id" + parseInt(songs[i].substring(2))}', this);" style="float:right"><em class="fa fa-trash-o" style="font-size:40px"></em></button>
                        </div>
                    </div>`);
        }
    }
}

function play_song(curr_song) {
    // playerAPI.init();
    // playerAPI.row = curr_song;
    $("#playing").find("source")[0].src = "../ressrc/songs/" + playerAPI.songs[curr_song].file;
    $("#playing")[0].load();
    $("#play_button").find("em")[0].innerHTML = "&#xf28c;";

    $("#title_artist").html(playerAPI.songs[curr_song].title + " - " + playerAPI.songs[curr_song].artist);
    $("#expand_player").find("div").find("img")[0].src = "../ressrc/songs_images/" + playerAPI.songs[curr_song].img;
    $("#expand_player").find("div").find("p")[6].innerHTML = playerAPI.songs[curr_song].title;
    $("#expand_player").find("div").find("p")[7].innerHTML = playerAPI.songs[curr_song].artist;
    $("#expand_player").find("div").find("p")[8].innerHTML = playerAPI.songs[curr_song].genre;
    $("#expand_player").find("div").find("p")[9].innerHTML = playerAPI.songs[curr_song].album;
    $("#expand_player").find("div").find("p")[10].innerHTML = playerAPI.songs[curr_song].release;
    $("#expand_player").find("div").find("p")[11].innerHTML = playerAPI.songs[curr_song].duration;
    $("#expand_lyrics").html("<pre>" + playerAPI.songs[curr_song].lyrics + "</pre>");
    playerAPI.currentID = playerAPI.mysongs[curr_song];
    $("#playing")[0].play();
}

function play_playlist_song(curr_song) {
    playerAPI.playlist = playerAPI.tmpPlaylist;

    for (i = 0; i < playerAPI.songs.crowd; i++) {
        playerAPI.tmpPlaylsit[i] = "id" + i;
    }
    playerAPI.row = playerAPI.playlist.indexOf(curr_song);
    $("#playing").find("source")[0].src = "../ressrc/songs/" + playerAPI.songs[curr_song].file;
    $("#playing")[0].load();
    $("#play_button").find("em")[0].innerHTML = "&#xf28c;";

    $("#title_artist").html(playerAPI.songs[curr_song].title + " - " + playerAPI.songs[curr_song].artist);
    $("#expand_player").find("div").find("img")[0].src = "../ressrc/songs_images/" + playerAPI.songs[curr_song].img;
    $("#expand_player").find("div").find("p")[6].innerHTML = playerAPI.songs[curr_song].title;
    $("#expand_player").find("div").find("p")[7].innerHTML = playerAPI.songs[curr_song].artist;
    $("#expand_player").find("div").find("p")[8].innerHTML = playerAPI.songs[curr_song].genre;
    $("#expand_player").find("div").find("p")[9].innerHTML = playerAPI.songs[curr_song].album;
    $("#expand_player").find("div").find("p")[10].innerHTML = playerAPI.songs[curr_song].release;
    $("#expand_player").find("div").find("p")[11].innerHTML = playerAPI.songs[curr_song].duration;
    $("#expand_lyrics").html("<pre>" + playerAPI.songs[curr_song].lyrics + "</pre>");
    playerAPI.currentID = playerAPI.mysongs[curr_song];
    $("#playing")[0].play();
}

function add_to_mysongs(song_id) {
    var ws = new WebSocket('ws://' + "localhost" + ':6556');

    ws.onopen = function() {
        message = '{ "type": "add to my songs", "song_id":"' + song_id + '" }';

        ws.send(message);

        ws.onmessage = function(message) {
            alert(message.data);
        };
    };
    $("#playlists_modal").css("display", "none");
}

function add_to_playlist(song_id, playlist) {
    var ws = new WebSocket('ws://' + "localhost" + ':6556');

    ws.onopen = function() {
        message = '{ "type": "add to playlist", "playlist":"' + playlist + '" , "song_id":"' + song_id + '" }';

        ws.send(message);
    };
    $("#playlists_modal").css("display", "none");
}

function add_new_playlist(playlist) {
    var ws = new WebSocket('ws://' + "localhost" + ':6556');

    ws.onopen = function() {
        message = '{ "type": "new playlist", "playlist":"' + playlist + '"}';
        ws.send(message);
    };
}

// Get the button that opens the modal
// When the user clicks the button, open the modal
function open_playlists_modal(song_id) {
    $("#add").click(function() {
        new_playlist = $("#set_new_playlist").val();
        add_new_playlist(new_playlist);
        add_to_playlist(song_id, new_playlist);
    });

    var ws = new WebSocket('ws://' + "localhost" + ':6556');
    ws.onopen = function() {
        message = "playlists";

        ws.send(message);
        ws.onmessage = function (message) {
            playlists = JSON.parse(message.data);
            keys = Object.keys(playlists);
            console.log(keys);

            html_display = `
                <h3 style="color:#000000">Playlists</h3>
                <div class="col-xs-12"><input id="set_new_playlist" style="width:100%" placeholder="Type a new playlist and press Add"></input></div>`;

            for(i = 0; i < playlists.crowd; i++) {
                html_display += `
                                <div class="col-xs-12">
                                    <button onclick="add_to_playlist('${song_id}', '${keys[i + 1].replace(/(\r\n|\n|\r)/gm,"")}')" style="width:100%">${keys[i + 1]}</button>
                                </div>`;
            }

            html_display += `
                <h3 style="color:#000000">My songs</h3>
                <div class="col-xs-12"><button style="width:100%">My songs</button></div>
                <div class="clearfix"></div>`;
            $(".modal-body")[0].innerHTML = html_display;
            $("#playlists_modal").css("display", "block");
        };
    };
}

function get_playlists() {
    var ws = new WebSocket('ws://' + "localhost" + ':6556');

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

            $("#playlists_content").html("");
            for(i = 0; i < playlists.length; i++) {
                $("#playlists_content").append(`
                    <div class="col-xs-12">
                        <div class="col-xs-10">
                            <button onclick="read_playlist('${playlists[i]}')" style="text-align:left;">
                                <p style="white-space:nowrap; overflow-x: hidden; line-height:1.2; font-size:30px">${playlists[i]}</p>
                                <p style="white-space:nowrap; overflow-x: hidden; line-height:1.2; font-size:30px">${data[playlists[i]].length} songs</p>
                            </button>
                        </div>
                        <div class="col-xs-1" style="padding:0;  height:100px; line-height:100px;">
                            <button onclick="play_playlist('${playlists[i]}')"><em class="fa" style="font-size:40px">&#xf01d;</em></button>
                        </div>
                        <div class="col-xs-1" style="padding:0; height:100px; line-height:100px;">
                            <button onclick="remove_playlist('${playlists[i]}', this)"  style="float:right"><em class="fa fa-trash-o" style="font-size:40px"></em></button>
                        </div>
                    </div>`
                )
            }
        }
    }
}

function add_recently_played_song(song_id) {
    var ws = new WebSocket('ws://' + "localhost" + ':6556');

    ws.onopen = function() {
        message = '{ "type": "new recent", "song_id":"' + song_id + '"}';
        ws.send(message);
    };
}

function read_playlist(playlist) {
    visitedPagesStack.setNewLastVisitedPage("song_playlist");
    goToPage("song_playlist");
    let playlist_songs = "";
    var ws = new WebSocket('ws://' + "localhost" + ':6556');

    ws.onopen = function() {
        message = '{ "type": "playlist", "title":"' + playlist + '"}';

        ws.send(message);
        ws.onmessage = function (message) {
            playlist_songs = message.data.split("\n");
            $("#playlist_content").html("");
            playerAPI.tmpPlaylist = [playlist_songs.length];

            for(var i = 0; i < playlist_songs.length - 1; i++) {
                id = playlist_songs[i].replace(/(\r\n|\n|\r)/gm,"");
                song = playerAPI.songs[id];
                $("#song_playlist").find("h1")[0].innerHTML = "Playlist - " + playlist;
                playerAPI.tmpPlaylist[i] = id;
                $("#playlist_content").append(
                    `
                        <div class="col-xs-12">
                            <div class="col-xs-2" style="height:100px; line-height:100px;">
                                <img id="img" style="width:80px" src="../ressrc/songs_images/${song.img}">
                            </div>
                            <div class="col-xs-7">
                                <button onclick="display_song_details('${id}')" style="text-align:left;">
                                    <p style="white-space:nowrap; overflow-x: hidden; line-height:1.2; font-size:30px">${song.title}</p>
                                    <p style="white-space:nowrap; overflow-x: hidden; line-height:1.2; font-size:30px">${song.artist}<p>
                                </button>
                            </div>
                            <div class="col-xs-1" style="padding:0;  height:100px; line-height:100px;">
                                <button onclick="play_playlist_song('${id}')"><em class="fa" style="font-size:40px">&#xf01d;</em></button>
                            </div>
                            <div class="col-xs-1" style="padding:0; height:100px; line-height:100px;">
                                <button onclick="open_playlists_modal('${id}');" style="float:right"><em class="fa fa-plus" style="font-size:40px"></em></button>
                            </div>
                            <div class="col-xs-1" style="padding:0; height:100px; line-height:100px;">
                                <button style="float:right" onclick="remove_from_playlist('${playlist}', '${id}', this)"><em class="fa fa-trash-o" style="font-size:40px"></em></button>
                            </div>
                        </div>`);
            }
        };
    };
}

function play_playlist(playlist) {
    let playlist_songs = "";
    var ws = new WebSocket('ws://' + "localhost" + ':6556');

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
    var ws = new WebSocket('ws://' + "localhost" + ':6556');

    ws.onopen = function() {
        message = '{ "type": "remove playlist", "playlist":"' + playlist + '"}';

        ws.send(message);
    };

    $(this_elem).parents(':eq(1)').html("");
}

function remove_from_playlist(playlist, song_id, this_elem) {
    var ws = new WebSocket('ws://' + "localhost" + ':6556');

    ws.onopen = function() {
        message = '{ "type": "remove from playlist", "playlist":"' + playlist + '", "song_id":"' + song_id + '"}';

        ws.send(message);
    };

    $(this_elem).parents(':eq(1)').html("");
}

function search_songs() {
    var artists = [];
    var genres = [];
    var genres_counter = 0;
    var dates = [];
    var albums = [];
    $("#search_songs_content").html("");

    for(var i = 0; i < playerAPI.songs.crowd; i++) {
        let id = "id" + i;
        song = playerAPI.songs[id];
        artists[i] = song.artist;
        for(var j = 0; j < song.genre.length; j++) {
            genres[genres_counter++] = song.genre[j];
        }

        dates[i] = parseInt(song.release.split(" ")[2]);
        albums[i] = song.album;
        $("#search_songs_content").append(
            `<div class="col-xs-12">
                <div class="col-xs-2" style="height:100px; line-height:100px;">
                    <img id="img" style="width:80px" src="../ressrc/songs_images/${song.img}">
                </div>
                <div class="col-xs-8">
                    <button onclick="display_song_details('${id}')" style="text-align:left;">
                        <p style="white-space:nowrap; overflow-x: hidden; line-height:1.2; font-size:30px">${song.title}</p>
                        <p style="white-space:nowrap; overflow-x: hidden; line-height:1.2; font-size:30px">${song.artist}<p>
                    </button>
                </div>
                <div class="col-xs-1" style="padding:0;  height:100px; line-height:100px;">
                    <button onclick="play_song('${id}')"><em class="fa" style="font-size:40px">&#xf01d;</em></button>
                </div>
                <div class="col-xs-1" style="padding:0; height:100px; line-height:100px;">
                    <button onclick="open_playlists_modal('${id}');" style="float:right"><em class="fa fa-plus" style="font-size:40px"></em></button>
                </div>
            </div>
            <div class="clearfix"></div>`);
    }

    // Filter duplicates
    tmp = genres.filter(function(item, pos) {
        return genres.indexOf(item) == pos;
    });
    genres = tmp;
    $("#search_genres_content").html("");
    for(i = 0; i < genres.length; i++) {
        $("#search_genres_content").append('<input onchange="apply_filters_search()" type="checkbox" name="genre" value="' + genres[i] + '">' + genres[i] + '<br>');
    }

    tmp = artists.filter(function(item, pos) {
        return artists.indexOf(item) == pos;
    });
    artists = tmp;
    $("#search_artists_content").html("");
    for(i = 0; i < artists.length; i++) {
        $("#search_artists_content").append('<input onchange="apply_filters_search()" type="checkbox" name="artist" value="' + artists[i] + '">' + artists[i] + '<br>');
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
        $("#search_albums_content").append('<input onchange="apply_filters_search()" type="checkbox" name="album" value="' + albums[i] + '">' + albums[i] + '<br>');
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

    if($("#keywords").val() !== "") {
        words = $("#keywords").val().split(" ");
        for(let i = 0; i < playerAPI.songs.crowd; i++) {
            let flag = false;
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

    $("#search_songs_content").html("");

    for(let i = 0; i < playerAPI.songs.crowd; i++) {
        if(check[i]) {
            id = "id" + i;
            song = playerAPI.songs["id" + i];
            $("#search_songs_content").append(
                `<div class="col-xs-12" style="border-bottom:1px solid #50505A">
                <div class="col-xs-2" style="height:100px; line-height:100px;">
                    <img id="img" style="width:80px" src="../ressrc/songs_images/${song.img}">
                </div>
                <div class="col-xs-8">
                    <button onclick="display_song_details('${id}')" style="text-align:left;">
                        <p style="white-space:nowrap; overflow-x: hidden; line-height:1.2; font-size:30px">${song.title}</p>
                        <p style="white-space:nowrap; overflow-x: hidden; line-height:1.2; font-size:30px">${song.artist}<p>
                    </button>
                </div>
                <div class="col-xs-1" style="padding:0;  height:100px; line-height:100px;">
                    <button onclick="play_song('${id}')"><em class="fa" style="font-size:40px">&#xf01d;</em></button>
                </div>
                <div class="col-xs-1" style="padding:0; height:100px; line-height:100px;">
                    <button onclick="open_playlists_modal('${id}');" style="float:right"><em class="fa fa-plus" style="font-size:40px"></em></button>
                </div>
            </div>
            <div class="clearfix"></div>`);
        }
    }
}

function remove_from_mysongs(song_id, this_elem) {
    var ws = new WebSocket('ws://' + "localhost" + ':6556');

    ws.onopen = function() {
        message = '{ "type": "remove from mysongs", "song_id":"' + song_id + '"}';

        ws.send(message);
    };

    $(this_elem).parents(':eq(1)').html("");
}

function set_song_new_releases() {
    $("#song_new_releases_content").html("");

    for(let i = 0; i < playerAPI.songs.crowd; i++) {
        if (playerAPI.songs["id" + i].release.split(" ")[2] === (new Date()).getFullYear().toString()) {
            $("#song_new_releases_content").append(`
                                    <div class="col-xs-6" onclick="display_song_details('id' + ${i})">
                                        <img class="img-responsive" src="../ressrc/songs_images/${playerAPI.songs["id" + i].img}"/>
                                        <p>${playerAPI.songs["id" + i].title}</p>
                                        <small>${playerAPI.songs["id" + i].artist}</small>
                                    </div>
                                    `)
        }
    }
}