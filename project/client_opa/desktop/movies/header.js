function setHeader() {
    document.write(

    `<div>
        <ul style="margin: 0; position:relative">
            <li style="float:left"><a class="to_song_home">3Player</a></li>
            <li style="float: left">
                <form style="padding-top:10px" class="navbar-form navbar-left">
                    <div class="input-group">
                        <input type="text" class="form-control" size="50" placeholder="Search for music">
                        <div class="input-group-btn">
                            <button class="btn btn-default" type="submit">
                                <i style="color:#000000" class="glyphicon glyphicon-search"></i>
                            </button>
                        </div>
                    </div>
                </form>
            </li>
            <li><a class="playlists">Playlists</a></li>
            <li><a class="to_mysongs">My movies</a></li>
            <li><a class="to_song_explore">Explore</a></li>
        </ul>
    </div>`);
}