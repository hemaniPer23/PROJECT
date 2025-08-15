<?php
class Election {
    private $conn;
    private $table = 'election';
    public $Start_time;
    public $End_time;

    public function __construct($db) {
        $this->conn = $db;
    }

    //finds the correct election automatically
    public function setTimeAndActivate() {
      $query = 'UPDATE ' . $this->table . ' 
                  SET 
                    Start_time = :start_time, 
                    End_time = :end_time,
                    IsValid = 1
                  WHERE 
                    Date = CURDATE() AND IsValid = 0
                  LIMIT 1'; 

        $stmt = $this->conn->prepare($query);

        // Sanitize input(removes any HTML or PHP tags from the input)
        $this->Start_time = htmlspecialchars(strip_tags($this->Start_time));
        $this->End_time = htmlspecialchars(strip_tags($this->End_time));

        //bind parameters
        $stmt->bindParam(':start_time', $this->Start_time);
        $stmt->bindParam(':end_time', $this->End_time);

        if($stmt->execute()) {
            // Check if any row was actually updated
            if($stmt->rowCount() > 0) {
                return true; // Success
            }
        }
        return false; // Failure (no rows updated or query failed)
    }
}
?>