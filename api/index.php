<?php
require_once 'define.inc.php';


function searchGoogle($fields, $q, $site, $cx, $exclude, $offset, $limit)
{
    $url = "https://www.googleapis.com/customsearch/v1?key=" . GOOGLE_API_KEY . "&fields=" . $fields . "&cx=" . $cx . "&q=" . urlencode($q) . "&siteSearch=" . $site . "&siteFilter=i&start=" . ($offset + 1) . '&excludeTerms=' . urlencode($exclude);
    $result = file_get_contents($url);
    return json_decode($result, TRUE);
}

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