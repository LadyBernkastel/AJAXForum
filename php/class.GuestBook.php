<?php

require_once 'database.php';

class GuestBook {

    //Edit these to connect to a different database

    protected $db_server = 'localhost';
    protected $db_user = 'bernkast_uniphp';
    protected $db_pass = 'EDf8iQL0FN';
    protected $db_name = 'bernkast_uniajax';
    //Primary key field is assumed to be called id. Edit if it's not
    protected $id = 'post_id';
    //Field to order posts by, could be set to a date field
    protected $orderBy = 'date_posted';

    /**
     *
     * @var DatabaseHandler
     */
    protected $db;
    protected $table, $order;

    /**
     * Constructor initialises the database class and the table
     * which the guest book uses. 
     * @param $table String
     */
    function __construct($table, $primaryKey = '', $order = 'DESC') {
        DatabaseHandler::setDatabaseParams($this->db_server, $this->db_user, $this->db_pass, $this->db_name);
        $this->db = new DatabaseHandler($table);
        $this->table = $table;
        if ($primaryKey != '')
            $this->id = $primaryKey;
        if ($this->orderBy == '')
            $this->orderBy = $this->id;
        $this->db->setPrimaryKey($this->id);
        $this->order = $order;
    }

    /**
     * Inserts an array into a table where the keys are the
     * column names. Returns the ID of the row just inserted.
     * @return Number
     * @param $array String
     */
    function insert($array) {
        return $this->db->insert($array);
    }

    /**
     * Updates an existing record.
     * @return Number
     * @param $array Array
     * @param $where Number
     */
    function update($array) {
        $this->db->update($array, $array[$this->id]);
        return true;
    }
    
    function updatePost($array) {
        $this->db->setPrimaryKey('post_id');
        $this->db->update($array, $array['post_id']);
        return $array['post_id'];
    }

    /**
     * Returns a single record from the table.
     * @return JSON Object
     * @param $id Number
     */
    function getPost($id) {
        $result = $this->db->find($id);
        return json_encode($result);
    }

    /**
     * Returns an array of posts, if no parameters are specified, it will
     * return the 10 most recently posted.
     * @return JSON Array 
     * @param $size Object[optional]
     * @param $offset Object[optional]
     */
    function getPostList($size = 10, $offset = 0) {
        $result = $this->db->fetchAll($size, $offset);
        return json_encode($result);
    }

    function removePost($id) {
        $this->db->setPrimaryKey('post_id');
        $this->db->delete($id);
        return true;
    }

}
