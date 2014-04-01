<?php
require_once 'class.GuestBook.php';

class Threaded_GuestBook extends GuestBook {

    protected $threadtable = 'thread', $foreignKey = 'post_id';

    function __construct($threadtable, $table, $primaryKey = 'thread_id',$order = 'DESC') {
        parent::__construct($table, $primaryKey, $order);
        $this->threadtable = new DatabaseHandler($threadtable);
        $this->threadtable->setPrimaryKey($this->id);
    }

    function getThreadList() {
        $result = $this->threadtable->fetchAll();
        return json_encode($result);
    }

    function getThread($id) {        
        $result = $this->db->select('thread_id', $id);
        return json_encode($result);
    }

    function createThread($array) {
        return $this->threadtable->insert($array);
    }

    function renameThread($array) {
        $this->threadtable->update($array, $array[$this->id]);
        return $array['thread_id'];
    }

    function deleteThread($id) {        
        $this->threadtable->delete($id);
    }

}
