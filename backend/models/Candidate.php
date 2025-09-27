<?php
class Candidate {
    private $conn;
    private $table = 'candidate';
    private $election_table = 'election';

    // Properties
    public $Candidate_ID;
    public $Candidate_FullName;
    public $Party_ID;
    public $Image; // This can be kept or removed as it's not directly used in the new query's output array

    // Constructor
    public function __construct($db) {
        $this->conn = $db;
    }

    // Get all candidates for the active election with their party logo
    public function getAllActive() {
        // First, find the active election
        $electionQuery = 'SELECT Election_ID FROM ' . $this->election_table . ' WHERE IsValid = 1 LIMIT 1';
        $electionStmt = $this->conn->prepare($electionQuery);
        $electionStmt->execute();
        
        $activeElectionRow = $electionStmt->fetch(PDO::FETCH_ASSOC);
        if(!$activeElectionRow) {
            return null; 
        }
        $activeElectionID = $activeElectionRow['Election_ID'];

        // Get all candidates for that election, joining with the party table to get the logo
        $query = 'SELECT
                    c.Candidate_ID,
                    c.Candidate_UserName_Sinhala AS Candidate_FullName,
                    c.Image AS photo,
                    p.Party_Logo AS icon
                 FROM
                    ' . $this->table . ' c
                 LEFT JOIN
                    party p ON c.Party_ID = p.Party_ID
                  WHERE
                    c.Election_ID = :election_id
                  ORDER BY
                    c.Candidate_Number ASC';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':election_id', $activeElectionID);
        $stmt->execute();

        return $stmt;
    }
}
?>