<?php

class DatabaseHandler {
    
    /**
     *
     * @var PDO 
     */
    static protected $databaseHandler;
    
    /**
     *
     * @var PDO 
     */
    protected $dbHandler;
    
    protected $tableName, $primaryKey = 'post_id';
    
    /**
     * Initialises the database adapter to the parameters provided
     * @param string $host Host name of server
     * @param string $username Username
     * @param string $password Password
     * @param string $dbname Name of database
     */
    public static function setDatabaseParams($host, $username, $password, $dbname) {
        self::$databaseHandler = new PDO('mysql:dbname='.$dbname.';host='.$host,
                $username, $password);
    }
    
    /**
     *
     * @param string $tableName Table Name
     * @param PDO $adapter Optional database adapter
     */
    public function __construct($tableName, PDO $adapter=null) {
        
        $this->setTable($tableName)
                ->setAdapter($adapter);
    }
    
    /**
     * Sets the table name.
     * @param string $tableName name of table
     * @return \DatabaseHandler 
     */
    public function setTable($tableName) {
        $this->tableName = $tableName;
        
        return $this;
    }
    
    /**
     * Sets the primary key.
     * @param string $key name of the primary key column
     * @return \DatabaseHandler 
     */
    public function setPrimaryKey($key) {
        $this->primaryKey = $key;
        
        return $this;
    }
    
    /**
     *
     * @param PDO $adapter
     * @return \DatabaseHandler 
     */
    public function setAdapter(PDO $adapter = null) {
        if($adapter === null) {
            $this->dbHandler = self::$databaseHandler;
        } else {
            $this->dbHandler = $adapter;
        }
        return $this;
    }
    
    /**
     * Returns an entire set of rows based on the limit and offset.
     * 
     * @param number $limit
     * @param number $offset
     * @return array 
     */
    public function fetchAll($limit = 30, $offset = 0) {
        $sql = 'SELECT * FROM '.$this->tableName.' ORDER BY '.$this->primaryKey.' DESC' . 
                ' LIMIT '.$offset.', '.$limit;
        $query = $this->dbHandler->query($sql);
        
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }
    
    /**
     * Fetch a single row by Primary Key.
     * 
     * @param number $id the primary key
     * @return array The Row 
     */
    public function find($id) {
        $query = $this->dbHandler->prepare('SELECT * FROM '.$this->tableName.
                ' WHERE post_id = ?');
        $query->execute(array($id));
        
        return $query->fetch(PDO::FETCH_ASSOC);
    }
    
    /**
     * Insert a new row into the table, use the array keys as the column
     * names.
     * 
     * @param array $row
     * @return number primary key of the row inserted 
     */
    public function insert(Array $row) {
        $qString = '';
        $columnList = '';
        $values = array();
        
        foreach($row as $name => $value) {
            $qString .= '?,';
            $columnList .= $name . ',';
            $values[] = $value;
            
        }
        $qString = trim($qString, ',');
        $columnList = trim($columnList, ',');
        
        $statement = 'INSERT INTO ' . $this->tableName . '(' . $columnList .
                ') VALUES(' . $qString . ')';
        $query = $this->dbHandler->prepare($statement);
        $query->execute($values);
        
        return $this->dbHandler->lastInsertId();
    }
    
    /**
     *
     * @param array $columns associative array based on the column names as key
     * @param number $id the primary key of row to update
     * @return \DatabaseHandler
     */
    public function update(Array $columns, $id) {
        $setString = '';
        $values = array();
        foreach($columns as $column => $value) {
            $setString .= $column . ' = ?,';
            $values[] = $value;
        }
        
        $setString = trim($setString, ',');
        $values[] = $id;
        
        $statement = 'UPDATE '.$this->tableName.' SET '.$setString. ' WHERE '.
                $this->primaryKey . ' = ?';
        $query = $this->dbHandler->prepare($statement);
        $query->execute($values);
        
        return $this;
    }
    
    /**
     *
     * @param number $id primary key of row to delete
     * @return \DatabaseHandler
     */
    public function delete($id) {
        $statement = 'DELETE FROM '.$this->tableName.' WHERE '.$this->primaryKey
                .' = ?';
        $query = $this->dbHandler->prepare($statement);
        $query->execute(array($id));
        
        return $this;
    }
    
    /**
     * Create a simple custom WHERE clause, eg select('name = ?', 'rob');
     * 
     * @param string $where
     * @param string $value
     * @return Array
     */
    public function select($where, $value) {
        $statement = 'SELECT * FROM '.$this->tableName.' WHERE '.$where. '=' .$value;
        $query = $this->dbHandler->prepare($statement);
        $query->execute(array($value));
        
        return $query->fetchAll();
    }
    
    /**
     * Returns the database handler
     * @return PDO 
     */
    public function getHandler() {
        return $this->dbHandler;
    }
    
}