<?php

  class Database {

    // DB Parameters
    private $host = 'localhost';
    private $db_name = 'electiondb';
    private $username = 'root';
    private $password = '';
    private $conn;

    // DB Connect Method
    public function connect() {
      $this->conn = null;

      
      try { 

        //Create object from PDO(php data object) Class
        $this->conn = new PDO('mysql:host=' . $this->host . ';dbname=' . $this->db_name, $this->username, $this->password);
        
        //throw an Exception
        $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

      } catch(PDOException $e) {
         die('Connection Error: ' . $e->getMessage());
      }

      return $this->conn;
    }
  }
?>