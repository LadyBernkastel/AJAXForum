<?php

require_once 'php/class.Threaded_GuestBook.php';

$guestbook = new Threaded_GuestBook('thread','post');

function insertPost() {
	global $guestbook;
	return $guestbook->insert($_POST);
}

function editPost() {
	global $guestbook;
	return $guestbook->updatePost($_POST);
}

function getSinglePost(){
	global $guestbook;
	return $guestbook->getPost($_GET['id']);
}

function getPage() {
	global $guestbook;
	return $guestbook->getPostList();
}

function removePost(){
	global $guestbook;
	return $guestbook->removePost($_GET['id']);
}

function getThreadList(){
    global $guestbook;
    return $guestbook->getThreadList();
}

function getThread(){
    global $guestbook;
    return $guestbook->getThread($_GET['id']);
}

function createThread(){
    global $guestbook;
    return $guestbook->createThread($_POST);
}

function renameThread(){
    global $guestbook;
    return $guestbook->renameThread($_POST);
}

function deleteThread(){
    global $guestbook;
    return $guestbook->deleteThread($_GET['id']);
}

echo $_GET['action']();