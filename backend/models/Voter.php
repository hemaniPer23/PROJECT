<?php
class Voter {
    private $conn;
    private $table = 'voter';

    // Voter Properties
    public $NIC;
    public $FullName_English;
    public $Address;
    public $STATUS;

    // Constructor
    public function __construct($db) {
        $this->conn = $db;
    }

    // Find a single voter by NIC and get all details
    public function findByNIC() {
        $query = 'SELECT
                    NIC,
                    FullName_English,
                    Address,
                    STATUS
                  FROM
                    ' . $this->table . '
                  WHERE
                    NIC = :nic
                  LIMIT 1';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':nic', $this->NIC);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            // Set properties if voter is found
            $this->NIC = $row['NIC'];
            $this->FullName_English = $row['FullName_English'];
            $this->Address = $row['Address'];
            $this->STATUS = $row['STATUS'];
            return true;
        }
        
        return false;
    }
    // Update voter's status to 'Voted'
    public function updateStatusToVoted() {
    $query = 'UPDATE ' . $this->table . '
              SET
                STATUS = :status
              WHERE
                NIC = :nic';

    $stmt = $this->conn->prepare($query);

    // Clean data
    $this->NIC = htmlspecialchars(strip_tags($this->NIC));
    $status = 'Voted';

    // Bind data
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':nic', $this->NIC);

    // Execute query
    if($stmt->execute()) {
        // Check if a row was actually affected
        if($stmt->rowCount() > 0) {
            return true;
        }
    }
    return false;
}
}
?>