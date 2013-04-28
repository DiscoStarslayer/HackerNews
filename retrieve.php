<?php
$url = 'https://news.ycombinator.com/';

if (isset($_GET['url'])){
	$url = $url . $_GET['url'];
}

	$result = file_get_contents($url);
    echo $result;
?>