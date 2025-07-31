<?php
class Admin {
    private $conn;
    private $table = 'admin';
    private $election_table = 'election';

    public $Admin_ID;
    public $Admin_Password;
    public $Admin_Role;
    
    public function __construct($db) {
        $this->conn = $db;
    }

    // Generic Login Method: Validates credentials only
    public function login() {
        $query = 'SELECT Admin_ID, Admin_Password, Admin_Role FROM ' . $this->table . ' WHERE Admin_ID = :admin_id LIMIT 1';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':admin_id', $this->Admin_ID);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if($this->Admin_Password == $row['Admin_Password']) {
                $this->Admin_Role = $row['Admin_Role'];
                return true;
            }
        }
        return false;
    }

    // Checks if election is happening right now (Dynamic IsValid)
    public function isElectionActive() {
        // Corrected query to combine Date and Time
        $query = 'SELECT Election_ID FROM ' . $this->election_table . ' WHERE NOW() BETWEEN CONCAT(Date, " ", Start_time) AND CONCAT(Date, " ", End_time) LIMIT 1';
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }
    // Checks Start_Time is null
    public function preElection() {
        $query = 'SELECT Election_ID FROM ' . $this->election_table . ' WHERE Start_Time = NULL LIMIT 2';
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }
    // Checks if election has finished
    public function hasElectionEnded() {
        $query = 'SELECT Election_ID FROM ' . $this->election_table . ' WHERE NOW() > CONCAT(Date, " ", End_time) LIMIT 1';
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    // Checks if commission login is allowed (more than 30 days before election)
    public function isCommissionLoginAllowed() {
        $query = 'SELECT Date FROM ' . $this->election_table . ' ORDER BY Date ASC LIMIT 1';
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $election_date = new DateTime($row['Date']);
            $current_date = new DateTime();
            
            $interval = $current_date->diff($election_date);
            $days_until_election = (int)$interval->format('%r%a');

            // Block if within 30 days (but not past)
            if ($days_until_election >= 0 && $days_until_election < 30) {
                return false; // NOT allowed
            }
        }
        return true; // Allowed by default
    }
}
?>