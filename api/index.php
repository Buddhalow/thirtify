<?php
require_once 'define.inc.php';


function searchGoogle($fields, $q, $site, $cx, $exclude, $offset, $limit)
{
    $url = "https://www.googleapis.com/customsearch/v1?key=" . GOOGLE_API_KEY . "&fields=" . $fields . "&cx=" . $cx . "&q=" . urlencode($q) . "&siteSearch=" . $site . "&siteFilter=i&start=" . ($offset + 1) . '&excludeTerms=' . urlencode($exclude);
    $result = file_get_contents($url);
    return json_decode($result, TRUE);
}
/*
function getPlaylistsFeaturingRelease($name, $artist, $exclude, $offset, $limit)
{

    $q = 'name=' . $name . '&exclude=' . $exclude . '&offset=' . $offset . '&limit=' . $limit;
    $filePath = '/.bungalow/cache/' . md5($q) . '.json';

    if (file_exists($filePath)) {
        $result = json_decode(file_get_contents($filePath), TRUE);
        return result;
    }

    foreach ([0, 1, 2, 3] as $i) {
        $result = searchGoogle('"' . $artist . ' - ' . $name . '"', 'open.spotify.com/user', 'items(title,link)', '015106568197926965801%3Aif4ytykb8ws', $exclude, $offset + ($i * $limit), $limit);

        $data = [];
        try {
          foreach($result['items'] as $o) {
                $uri = 'spotify:' . $o . join(':', array_slice(explode('/', $link)), 3));
                return array(
                    'id' => explode(':', $uri)[4],
                    'uri' => $uri,
                    'name' => $o['title'],
                    'type' => 'playlist',
                    'user' => array(
                        'name' => $o['name'],
                        'id' => explode(':', $uri )[2],
                        'uri' => 'spotify:user:' . explode(':', $uri )[2],
                        'type' => 'user'

                    )
                );
            }
            $data['service'] = 'google';
            return $data;
        } catch (Exception $e) {

        }
    }
}
*/
function getCreatorData($id) {
    $delimiter = "<script id=\"__NEXT_DATA__\" type=\"application/json\">";
    $ender = "}</script>";
    $html = file_get_contents("https://artists.spotify.com/songwriter/" . $id);

    $datastart = strrpos($html, $delimiter) + strlen($delimiter);
    $dataend = strrpos($html, $ender, $datastart);
    $json = substr($html, $datastart, $dataend - $datastart) . "}";
    $data = json_decode($json, TRUE);
    return $data;
}

$resource = $_REQUEST['resource'];
$sub_resource = $_REQUEST['sub_resource'];

$q = $_REQUEST['q'];
$id = $_REQUEST['id'];
header('Content-type: application/json');
if ($resource === 'creator') {
    $creatorData = getCreatorData($id);
    $creator = $creatorData['props']['pageProps']['writerProfile'];
    if (!$sub_resource) {
        $uri = $creator['writerInfo']['creatorUri'];
        $uris = explode(':', $uri);
        $id = $uris[2];
        $creator = array(
            'id' => $id,
            'type' => 'creator',
            'href' => '/creator/' . $id,
            'name' => $creator['writerInfo']['name'],
            'uri' => $creator['writerInfo']['creatorUri']
        );
        echo json_encode($creator, JSON_PRETTY_PRINT);
    }
    else if($sub_resource === 'track')
    {
        $result = array(
            'objects' => array()
        );
        foreach($creator['recordings'] as $recording) {
            $result['objects'][] = array(
                'artist' => array(
                    'name' => $recording['artistName'],
                    'uri' => 'spotify:search:' . $recording['artistName'],
                    'type' => 'artist'
                ),
                'name' => $recording['title'],
                'album' => array(
                    'name' => $recording['albumName'],
                    'uri' => 'spotify:search:' . $recording['albumName'],
                    'type' => 'album'
                ),
                'totalStreams '=> (int)$recording['totalStreams']
            );
        }
        echo json_encode($result, JSON_PRETTY_PRINT);

    }
    else if($sub_resource === 'artist')
    {
        $result = array(
            'objects' => array()
        );
        foreach($creator['relatedArtists'] as $artist) {
            $ids = explode(':', $artist['uri']);
            $id = $ids[2];
            $result['objects'][] = array(
                'name' => $artist['name'],
                'href' => '/artist/' . $id,
                'type' => 'artist',
                'uri' => $artist['uri'],
                'id' => $id
            );
        }
        echo json_encode($result, JSON_PRETTY_PRINT);

    }
}

