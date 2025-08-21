<?php
class Voter {
    private $conn;
    private $table = 'voter';
    private $vote_table = 'vote';
    private $election_table = 'election';


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

   
    // Find a pending voter
    public function findVerifiedVoter() {  
        $query = 'SELECT
                    NIC,
                    FullName_English
                  FROM
                    ' . $this->table . '
                  WHERE
                    STATUS = "Verified"
                  LIMIT 1';

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            // Set properties if a pending voter is found
            $this->NIC = $row['NIC'];
            $this->FullName_English = $row['FullName_English'];
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

 // Update voter's status to 'Verified'
    public function updateStatusToVerified() {
    $query = 'UPDATE ' . $this->table . '
              SET
                STATUS = :status
              WHERE
                NIC = :nic';

    $stmt = $this->conn->prepare($query);

    // Clean data
    $this->NIC = htmlspecialchars(strip_tags($this->NIC));
    $status = 'Verified';

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



//creates a new record in the 'vote' table with 'Pending' status.
public function initiateVote() {

//Get active election
$electionQuery = 'SELECT Election_ID FROM ' . $this->election_table . ' WHERE IsValid = 1 LIMIT 1';
$electionStmt = $this->conn->prepare($electionQuery);
$electionStmt->execute();

$activeElectionID = null;
if ($electionStmt->rowCount() > 0) {
    $row = $electionStmt->fetch(PDO::FETCH_ASSOC);
    $activeElectionID = $row['Election_ID'];
} else {
    return false;
}

//Get division for NIC
 $divisionQuery = 'SELECT Division_ID FROM ' . $this->table . ' WHERE NIC = :nic LIMIT 1';
 $divisionStmt = $this->conn->prepare($divisionQuery);
 $cleanNIC = htmlspecialchars(strip_tags($this->NIC));
 $divisionStmt->bindParam(':nic', $cleanNIC);
 $divisionStmt->execute();

 if ($divisionStmt->rowCount() === 0) {
        return 'NO_DIVISION';
            }else {
 $row = $divisionStmt->fetch(PDO::FETCH_ASSOC);
 $divisionID = $row['Division_ID'];
            }

//Insert new pending 3vote 
$insertQuery1 = 'INSERT INTO ' . $this->vote_table . ' (Preference, STATUS, Election_ID, Division_ID, Timestamp) VALUES (:preference, :status, :election_id, :division_id, NOW())';
$insertStmt1 = $this->conn->prepare($insertQuery1);
$status = 'Pending';
$Preference = '1'; 
$insertStmt1->bindParam(':preference', $Preference);
$insertStmt1->bindParam(':status', $status);
$insertStmt1->bindParam(':election_id', $activeElectionID);
$insertStmt1->bindParam(':division_id', $divisionID);
$insertStmt1->execute();


$insertQuery2 = 'INSERT INTO ' . $this->vote_table . ' (Preference, STATUS, Election_ID, Division_ID, Timestamp) VALUES (:preference, :status, :election_id, :division_id, NOW())';
$insertStmt2 = $this->conn->prepare($insertQuery2);
$status = 'Pending';
$Preference = '2'; 
$insertStmt2->bindParam(':preference', $Preference);
$insertStmt2->bindParam(':status', $status);
$insertStmt2->bindParam(':election_id', $activeElectionID);
$insertStmt2->bindParam(':division_id', $divisionID);
$insertStmt2->execute();


$insertQuery3 = 'INSERT INTO ' . $this->vote_table . ' (Preference, STATUS, Election_ID, Division_ID, Timestamp) VALUES (:preference, :status, :election_id, :division_id, NOW())';
$insertStmt3 = $this->conn->prepare($insertQuery3);
$status = 'Pending';
$Preference = '3'; 
$insertStmt3->bindParam(':preference', $Preference);
$insertStmt3->bindParam(':status', $status);
$insertStmt3->bindParam(':election_id', $activeElectionID);
$insertStmt3->bindParam(':division_id', $divisionID);
$insertStmt3->execute();

if ($insertStmt1->rowCount() > 0 && $insertStmt2->rowCount() > 0 && $insertStmt3->rowCount() > 0) {
      return 'SUCCESS';
      } else {
  return 'DB_ERROR';
  }
 
    
}



//GET THE STATUS FROM THE 'vote' TABLE
public function getVoteStatus() {
    $query = 'SELECT STATUS FROM vote ORDER BY Timestamp DESC LIMIT 1';

    $stmt = $this->conn->prepare($query);
    $stmt->execute();

    if($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['STATUS']; // Returns 'Pending' or 'Voted'
    }
    return null; // Returns null if no record is found
}

}
?>