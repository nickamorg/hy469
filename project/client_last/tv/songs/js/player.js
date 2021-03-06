function setPlayer() {
    document.write(

    `<div class="player text-center">
        <div class="col-md-3 hidden-xs hidden-sm" style="padding-right:0px;">
            <div class="col-xs-3" style="padding:10px 0px 10px 0px;">
                <img class="img" style="width:105px">
            </div>
            <div style="font-size: 25px; margin-top: 10px; padding-left: 10px;" class="col-xs-9 text-left">
				<p class="title"></p>
				<p class="artist"></p>
            </div>
        </div>
    
        <div class="col-xs-12 col-sm-12 col-md-7 col-lg-6" style="padding:0">
            <div class="controls">
                <button class="clickableElement" onclick="playerAPI.shuffle()"><em style="font-size:40px" class="fa">&#xf074;</em></button>
                <button class="clickableElement" onClick="playerAPI.prev()"><em style="font-size:40px" class="fa">&#xf048;</em></button>
                <button class="clickableElement" onclick="playerAPI.playPause()"><em style="font-size:65px" class="fa">&#xf01d;</em></button>
                <button class="clickableElement" onClick="playerAPI.next()"><em style="font-size:40px" class="fa">&#xf051;</em></button>
                <button class="clickableElement" onClick="playerAPI.repeat()"><em style="font-size:40px; color:#9999a5" class="fa">&#xf01e;</em></button>
            </div>
        
            <div>
            <div class="curr" style="display:inline-block">0:00</div>
            <div style="display:inline-block" class="myProgress">
                <div class="myBar"></div>
            
                </div>
                <div class="dur" style="display:inline-block"></div>
            </div>
        </div>
        
        <div class="col-xs-3 col-sm-2 col-lg-3" style="padding-top:35px; display: flex; justify-content: space-around;">
            <button class="remote clickableElement" onclick="open_interaction_modal()"><em class="material-icons" style="font-size:40px">&#xe1b1;</em></button>
            <button class="expand clickableElement"><em style="font-size:40px" class="fa">&#xf065;</em></button>
            <div>
                <button class="clickableElement muted"><em style="font-size:40px" class="fa">&#xf027;</em></button>
                <div style="margin-bottom:4px" class="volume">  <span class="volumeBar"></span></div>
            </div>
        </div>
    
    </div>`);
}

function set_songs_by_genre(genre) {
    goToPage('song_by_genre');
    $("#display_by_genre").html("");
    $("#song_by_genre").find("h1")[0].innerHTML = "Songs - " + genre.charAt(0).toUpperCase() + genre.slice(1);

    for(let i = 0; i < playerAPI.songs.crowd; i++) {
        song = playerAPI.songs["id" + i];
        id = "id" + i;
        for(let j = 0; j < song.genre.length; j++) {
            if(song.genre[j] === genre) {
                $("#display_by_genre").append(
                    `<div class="col-xs-3 clickableElement" onclick="toggleContainer(this)">
                        <img style="width:100%" src="../ressrc/songs_images/${song.img}">
                        <p>${song.title}</p>
                        <small>${song.artist}</small>
                        <div class="overlay">
                            <h3 class="text-center">${song.title} - ${song.artist}</h3>
                            <div class="options">
                                <div class="col-xs-4 clickableElement" onclick="display_song_details('${id}')">
                                    <em class="fa fa-external-link" aria-hidden="true"></em>
                                </div>
                    
                                <div class="col-xs-4 play-icon clickableElement" onclick="play_song(${i})">
                                    <em class="fa fa-play-circle-o" aria-hidden="true"></em>
                                </div>
                    
                                <div class="col-xs-4 clickableElement" onclick="open_playlists_modal('${id}');">
                                    <em class="fa fa-plus" aria-hidden="true"></em>
                                </div>
                            </div>
                        </div>
                    </div>`);

                break;
            }
        }
    }
}

function display_song_details(song_id) {
    song = playerAPI.songs[song_id];
    visitedPagesStack.setNewLastVisitedPage("song_details");
    goToPage('song_details');
    $("#lyrics").html("<h2 class='text-center'>LYRICS</h2>");
    $("#lyrics").append("<pre class='text-center' style='font-size:20px; font-family: Roboto;'>" + song.lyrics + "</pre>");
    $("#song_title").html(song.title);

    $("#details").html(
        `<img style="width: 100%; border-radius: 38px" src="../ressrc/songs_images/${song.img}"/>
        <button style="margin-right: 20px;" onclick="play_song('${song_id}')" class="clickableElement"><em style="font-size:50px" class="fa">&#xf01d;</em></button>
        <button onclick="open_playlists_modal('${song_id}')" class="clickableElement"><em style="font-size:50px" class="fa">&#xf067;</em></button>
        
        <div class="clearfix"></div>
        
        <div class="col-xs-4 text-left" style="font-size: 20px; margin-top: 10px;">
            <p>Title</p>
            <p>Artist</p>
            <p>Album</p>
            <p>Genre</p>
            <p>Release</p>
            <p>Duration</p>
        </div>
        <div id="details" class="col-xs-8 text-left" style="font-size: 20px; margin-top: 10px;">
            <p>${song.title}</p>
            <p>${song.artist}</p>
            <p>${song.album}</p>
            <p>${song.genre}</p>
            <p>${song.release}</p>
            <p>${song.duration}</p>
        </div>`);

    $("#related_content").html("");
    counter = 0;
    common = [];
    common_counter = 0;
    for(i = 0; i < playerAPI.songs.crowd; i++) {
        flag = false;
        for(j = 0; j < playerAPI.songs["id" + i].genre.length; j++) {
            for(k = 0; k < song.genre.length; k++) {
                if(!flag && song_id !== ("id" + i) && (contains_word(playerAPI.songs["id" + i].genre[j], song.genre[k]) ||
                        contains_word(song.genre[k], playerAPI.songs["id" + i].genre[j]))) {
                    counter ++;
                    common[common_counter++] = "id" + i;
                    flag = true;
                    $("#related_content").append(
                        `<div class="col-xs-12 clickableElement" style="padding: 0 0 20px 0" onclick="display_song_details('${"id" + i}')">
                        <div class="col-xs-4" style="padding-right:0"><img class="img-responsive" src="../ressrc/songs_images/${playerAPI.songs["id" + i].img}"></div>
                        <div class="col-xs-8" style="padding-right: 0"><p>${playerAPI.songs["id" + i].title}</p><small>${playerAPI.songs["id" + i].artist}</small></div>
                    </div>`
                    )
                }
            }
        }
        if(counter === 5) break;
    }

    if(counter < 5) {
        for(i = 0; i < playerAPI.songs.crowd; i++) {
            flag = false;
            if(!(common.indexOf(("id" + i)) > -1) && song_id !== ("id" + i) && counter < 5 && song.release.split(" ")[2] === playerAPI.songs["id" + i].release.split(" ")[2]) {
                $("#related_content").append(
                    `<div class="col-xs-12 clickableElement" style="padding: 0 0 20px 0" onclick="display_song_details('${"id" + i}')">
                        <div class="col-xs-4" style="padding-right:0"><img class="img-responsive" src="../ressrc/songs_images/${playerAPI.songs["id" + i].img}"></div>
                        <div class="col-xs-8" style="padding-right: 0"><p>${playerAPI.songs["id" + i].title}</p><small>${playerAPI.songs["id" + i].artist}</small></div>
                    </div>`
                );
                counter++;
            }
            if(counter === 5) break;
        }
    }
}

function display_song_expand_details(song_id) {
    song = playerAPI.songs[song_id];
    visitedPagesStack.setNewLastVisitedPage("song_expand_details");
    goToPage('song_expand_details');
    $("#expand_lyrics").html("<h2>LYRICS</h2>");
    $("#expand_lyrics").append("<pre class='text-center' style='font-size:20px; font-family: Roboto;'>" + song.lyrics + "</pre>");
    $("#song_expand_title").html(song.title);

    $("#expand_details").html(
        `<img style="width:100%; border-radius: 38px" src="../ressrc/songs_images/${song.img}"/>
        <button onclick="play_song('${song_id}')" class="clickableElement"><em style="font-size:50px; margin-top: 8px;" class="fa">&#xf01d;</em></button>
        <button onclick="open_playlists_modal('${song_id}')" class="clickableElement"><em style="font-size:50px; margin-top: 8px;" class="fa">&#xf067;</em></button>
        
        <div class="clearfix"></div>
        
        <div class="col-xs-4 text-left" style="font-size: 20px; margin-top: 10px;">
            <p>Title</p>
            <p>Artist</p>
            <p>Album</p>
            <p>Genre</p>
            <p>Release</p>
            <p>Duration</p>
        </div>
        <div id="details" class="col-xs-8 text-left" style="font-size: 20px; margin-top: 10px;">
            <p>${song.title}</p>
            <p>${song.artist}</p>
            <p>${song.album}</p>
            <p>${song.genre}</p>
            <p>${song.release}</p>
            <p>${song.duration}</p>
        </div>`);

    $("#related_expand_content").html("");
    counter = 0;
    common = [];
    common_counter = 0;
    for(i = 0; i < playerAPI.songs.crowd; i++) {
        flag = false;
        for(j = 0; j < playerAPI.songs["id" + i].genre.length; j++) {
            for(k = 0; k < song.genre.length; k++) {
                if(!flag && song_id !== ("id" + i) && (contains_word(playerAPI.songs["id" + i].genre[j], song.genre[k]) ||
                        contains_word(song.genre[k], playerAPI.songs["id" + i].genre[j]))) {
                    counter ++;
                    common[common_counter++] = "id" + i;
                    flag = true;
                    $("#related_expand_content").append(
                        `<div class="col-xs-12 clickableElement" style="padding: 0 0 20px 0" onclick="display_song_details('${"id" + i}')">
                        <div class="col-xs-4" style="padding-right:0"><img class="img-responsive" src="../ressrc/songs_images/${playerAPI.songs["id" + i].img}"></div>
                        <div class="col-xs-8" style="padding-right: 0"><p>${playerAPI.songs["id" + i].title}</p><small>${playerAPI.songs["id" + i].artist}</small></div>
                    </div>`
                    )
                }
            }
        }
        if(counter === 5) break;
    }

    if(counter < 5) {
        for(i = 0; i < playerAPI.songs.crowd; i++) {
            flag = false;
            if(!(common.indexOf(("id" + i)) > -1) && song_id !== ("id" + i) && counter < 5 && song.release.split(" ")[2] === playerAPI.songs["id" + i].release.split(" ")[2]) {
                $("#related_expand_content").append(
                    `<div class="col-xs-12 clickableElement" style="padding: 0 0 20px 0" onclick="display_song_details('${"id" + i}')">
                        <div class="col-xs-4" style="padding-right:0"><img class="img-responsive" src="../ressrc/songs_images/${playerAPI.songs["id" + i].img}"></div>
                        <div class="col-xs-8" style="padding-right: 0"><p>${playerAPI.songs["id" + i].title}</p><small>${playerAPI.songs["id" + i].artist}</small></div>
                    </div>`
                );
                counter++;
            }
            if(counter === 5) break;
        }
    }
}