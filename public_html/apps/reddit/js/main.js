/**
 * REDDIT APP
 **/


/**
 * This class is based on code from https://raw.githubusercontent.com/khanhas/Spicetify/master/Apps/reddit/bundle.js
 **/
class Reddit {
    /**
     * Mapping posts
     **/
    postMapper(posts) {
        var mappedPosts = [];
        posts.forEach(post => {
            var uri = liburi.from(post.data.url);
            if (uri && (uri.type === "playlist" || uri.type === "track" || uri.type === "album")) {
                mappedPosts.push({
                    uri: uri.toURI(),
                    type: uri.type,
                    title: post.data.title,
                    upvotes: post.data.ups
                })
            } else if (fetchYoutube && post.data.media && post.data.media.type === "youtube.com") {
                mappedPosts.push({
                    type: "youtube",
                    title: unEscapeHTML(post.data.media.oembed.title),
                    upvotes: post.data.ups,
                    html: unEscapeHTML(post.data.media.oembed.html),
                    description: unEscapeHTML(post.data.title),
                    image: post.data.media.oembed.thumbnail_url
                })
            }
        });
        return mappedPosts;
    }
    /**
     * Returns subreddit
     */
    getSubreddit(section, playlists = [], after = '') {
        // www is needed or it will block with "cross-origin" error.
        var url = `https://www.reddit.com/r/${section}/${sort}.json?limit=100`
        if (after) {
            url += `&after=${after}`
        }
        if (sort.match(/top|constroversial/) && time) {
            url += `&t=${time}`
        }

        fetch(url)
            .then(response => response.json())
            .then(data => this.getSubredditMetadata(
                playlists,
                this.postMapper(data.data.children),
                data.data.after
                )
            );
    }
    /**
     * Return metadata for subrredit based on playlists
     **/
    getSubredditMetadata (section, playlists, posts, after) {
        var fetchingCount = 0;
        var fetchingContent = [];
        var promises = [];
        for (const post of posts) {
            if (post.type === "playlist") { //Start categorize post type
                promises.push(new Promise((resolve, reject) => {
                    API.getPlaylistById(post.uri).then( (metadata) => {
                        resolve({
                            type: "playlist",
                            uri: post.uri,
                            name: metadata.name,
                            description: unEscapeHTML(post.title),
                            upvotes: post.upvotes,
                            followers_count: metadata.followers,
                            is_following: metadata.followed,
                            image_url: metadata.picture,
                        });
                    }).catch((error) => reject(error || responseError));
                }))
            } else if (post.type === "track" || post.type === "album") {
                promises.push(new Promise((resolve, reject) => {
                    API.getPlaylistById(post.uri).then( (metadata) => {
                        resolve({
                            type: post.type,
                            uri: post.uri,
                            name: metadata.name,
                            artists: metadata.artists,
                            upvotes: post.upvotes,
                            image_url: metadata.image
                        });
                    }).catch((error) => reject(error));
                }))
            } else if (post.type === "youtube") {
                promises.push(new Promise((resolve, reject) => {
                    resolve({
                        type: post.type,
                        uri: 'youtube',
                        name: post.title,
                        description: post.description,
                        upvotes: post.upvotes,
                        image_url: post.image,
                        html: escape(post.html)
                    });
                }))
            } //End categorize post type
        }
        Promise.all(promises)
        .then(data => {
            playlists.push(...data);

            $rootScope.$broadcast('reddit', {
                section,
                sort,
                time,
                content: playlists
            })

            if (after && playlists.length < 100) {
                getSubreddit(section, playlists, after);
            } else {
                promises = [];
                playlists = [];
                posts = [];
            }
        }).catch(e => console.log(e))
    }

}
 (function() {

    var app = angular.module('PlayerApp');


    app.controller('RedditAppController', function ($scope) {
        $scope.model = {
            name: 'Reddit',
            uri: 'spotify:app:reddit',
            id: 'reddit',
            images: [
                {
                    url: 'https://i.scdn.co/image/ae4d05f67fde1545aa300c8f11c814a455aedf03'
                }
            ]
        }
    }).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true)
        $routeProvider.when('/app/reddit', {
            templateUrl: 'apps/reddit/partials/reddit.html',
            controller: 'RedditAppController'
        });
    }])
  return new Reddit();

})();


