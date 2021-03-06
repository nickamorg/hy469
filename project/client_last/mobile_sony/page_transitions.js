$(document).ready(function () {

    function reset() {

        setTimeout(function(){
            $("movies_bottom_menu").removeClass("special_menu");
            document.getElementById("movies_video").load();
            document.getElementById("series_video").load();
        }, 2500);

        $("#movies_bottom_menu").addClass("special_menu_none");

        document.getElementById("movies_video").currentTime = 0;
        movie_width = 0;
        document.getElementById("movies_video").load();
        $('.movie_volume_bar').css('width', '50%');

        setTimeout(function(){
            $("movies_bottom_menu").removeClass("special_menu");
            $("series_bottom_menu").removeClass("special_menu");
        }, 2500);

        $("#series_bottom_menu").addClass("special_menu_none");

        document.getElementById("series_video").currentTime = 0;
        serie_width = 0;
        document.getElementById("series_video").load();
        $('.serie_volume_bar').css('width', '50%');

    }

	$('#to_song_home, .to_song_home').click(function () {
        reset();
        visitedPagesStack.setNewLastVisitedPage("song_home");
        $("#expand_lyrics").removeClass("in");
        $("#expand_player").removeClass("in");
    	$("#bottom_menu").show();
		goToPage('song_home');
	});

	$('.to_mysongs').click(function () {
        reset();
        visitedPagesStack.setNewLastVisitedPage("song_mysongs");
        goToPage('song_mysongs');
        $("#expand_lyrics").removeClass("in");
        $("#expand_player").removeClass("in");
		send_mysongs();
	});

	$('.to_lobby').click(function () {
        reset();
        visitedPagesStack = new VisitedPagesStack();
        document.getElementById("playing").pause();
        $("#expand_lyrics").removeClass("in");
        $("#expand_player").removeClass("in");
        $("#series_bottom_menu").hide();
        $("#movies_bottom_menu").hide();
        $("#bottom_menu").hide();
        goToPage('lobby');
	});

	$('.display_song_by_genre').click(function () {
        reset();
        visitedPagesStack.setNewLastVisitedPage("song_by_genre");
        $("#expand_lyrics").removeClass("in");
        $("#expand_player").removeClass("in");
		goToPage('song_by_genre');
	});

    $('.playlists').click(function () {
        reset();
        visitedPagesStack.setNewLastVisitedPage("playlists");
        $("#expand_lyrics").removeClass("in");
        $("#expand_player").removeClass("in");
        get_playlists();
        goToPage('playlists');
    });

    $('.to_songs_search').click(function () {
        reset();
        visitedPagesStack.setNewLastVisitedPage("song_search");
        $("#expand_lyrics").removeClass("in");
        $("#expand_player").removeClass("in");
        $("#bottom_menu").show();
        search_songs();
        goToPage('song_search');
    });

    $('#song_new_releases_link').click(function () {
        reset();
        visitedPagesStack.setNewLastVisitedPage("song_new_releases");
        set_song_new_releases();
        goToPage('song_new_releases');
    });

    $('#song_charts_link').click(function () {
        reset();
        visitedPagesStack.setNewLastVisitedPage("song_charts");
        goToPage('song_charts');
    });

    $('#song_genres_link').click(function () {
        reset();
        visitedPagesStack.setNewLastVisitedPage("song_genres");
        goToPage('song_genres');
    });

    $('#season-7').click(function () {
        reset();
        visitedPagesStack.setNewLastVisitedPage("serie_episodes");
        goToPage('serie_episodes');
    });

    $('#episode-2').click(function () {
        reset();
        visitedPagesStack.setNewLastVisitedPage("serie_episodes");
        goToPage('episode_details');
    });

    $('#to_movies_home, .to_movies_home').click(function () {
        reset();
        $("#movies_bottom_menu").show();
        visitedPagesStack.setNewLastVisitedPage("movies_home");
        goToPage('movies_home');
    });

    $('#movies_news_link').click(function () {
        reset();
        set_movies_news();
        visitedPagesStack.setNewLastVisitedPage("movies_news");
        goToPage('movies_news');
    });

    $('#movies_tops_link').click(function () {
        reset();
        set_movies_tops();
        visitedPagesStack.setNewLastVisitedPage("movies_tops");
        goToPage('movies_tops');
    });

    $('.to_movies_search').click(function () {
        reset();
        $("#movies_bottom_menu").show();
        visitedPagesStack.setNewLastVisitedPage('movie_search');
        goToPage('movie_search');
    });

    $('#movies_genres_link').click(function () {
        reset();
        set_movies_genres();
        visitedPagesStack.setNewLastVisitedPage("movies_genres");
        goToPage('movies_genres');
    });

    $('#song_recently_played_link').click(function () {
        reset();
        visitedPagesStack.setNewLastVisitedPage("song_recently_played");
        goToPage('song_recently_played');
    });

    $('.to_mymovies').click(function () {
        reset();
        visitedPagesStack.setNewLastVisitedPage("movies_mymovies");
        goToPage('movies_mymovies');
        send_mymovies();
    });

    $('#movies_recently_watched_link').click(function () {
        reset();
        visitedPagesStack.setNewLastVisitedPage("movies_recently_watched");
        goToPage('movies_recently_watched');
    });

    $('#to_series_home, .to_series_home').click(function () {
        reset();
        $("#series_bottom_menu").show();
        visitedPagesStack.setNewLastVisitedPage("series_home");
        goToPage('series_home');
    });

    $('#series_news_link').click(function () {
        reset();
        set_series_news();
        visitedPagesStack.setNewLastVisitedPage("series_news");
        goToPage('series_news');
    });

    $('#series_tops_link').click(function () {
        reset();
        set_series_tops();
        visitedPagesStack.setNewLastVisitedPage("series_tops");
        goToPage('series_tops');
    });

    $('#series_genres_link').click(function () {
        reset();
        set_series_genres();
        visitedPagesStack.setNewLastVisitedPage("series_genres");
        goToPage('series_genres');
    });

    $('.to_myseries').click(function () {
        reset();
        visitedPagesStack.setNewLastVisitedPage("series_myseries");
        goToPage('series_myseries');
        send_myseries();
    });

    $('#series_recently_watched_link').click(function () {
        reset();
        visitedPagesStack.setNewLastVisitedPage("series_recently_watched");
        goToPage('series_recently_watched');
    });

    $('.to_series_search').click(function () {
        reset();
        $("#series_bottom_menu").show();
        visitedPagesStack.setNewLastVisitedPage('serie_search');
        goToPage('serie_search');
    });

});