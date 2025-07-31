<?php
class Election {
    private $conn;
    private $table = 'election';

    // Properties
    public $Election_ID;
    public $Date;
    public $Start_time;
    public $End_time;

    // Constructor
    public function __construct($db) {
        $this->conn = $db;
    }

    // Set election time and activate it by setting IsValid to 1
    public function setTimeAndActivate() {
        $query = 'UPDATE ' . $this->table . '
                  SET
                    Start_time = :start_time,
                    End_time = :end_time,
                    IsValid = 1
                  WHERE
                    Election_ID = :election_id';

        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->Election_ID = htmlspecialchars(strip_tags($this->Election_ID));
        $this->Start_time = htmlspecialchars(strip_tags($this->Start_time));
        $this->End_time = htmlspecialchars(strip_tags($this->End_time));

        // Bind data
        $stmt->bindParam(':election_id', $this->Election_ID);
        $stmt->bindParam(':start_time', $this->Start_time);
        $stmt->bindParam(':end_time', $this->End_time);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>