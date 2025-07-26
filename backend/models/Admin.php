<?php
  class Admin {
    private $conn;
    private $table = 'admin';

    // Admin Properties
    public $Admin_ID;
    public $Admin_Password;
    public $Admin_Role;
    
    // Constructor
    public function __construct($db) {
      $this->conn = $db;
    }

    // It doesn't care about roles. It just checks if the ID and Password match.
    public function login() {
        $query = 'SELECT Admin_ID, Admin_Password, Admin_Role FROM ' . $this->table . ' WHERE Admin_ID = :admin_id LIMIT 1';

        // Prepare statement
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':admin_id', $this->Admin_ID);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            // Check password
            if($this->Admin_Password == $row['Admin_Password']) {
                // If password is correct, set the role property and return true
                $this->Admin_Role = $row['Admin_Role'];
                return true;
            }
        }
        // If user not found or password incorrect, return false
        return false;
    }
  }
?>