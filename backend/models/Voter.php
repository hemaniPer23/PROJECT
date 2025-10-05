<?php
// models/Voter.php
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
    public $Division_ID;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Find voter by NIC
    public function findByNIC() {
        $query = 'SELECT NIC, FullName_English, Address, STATUS, Division_ID 
                  FROM ' . $this->table . ' WHERE NIC = :nic LIMIT 1';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':nic', $this->NIC);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->NIC = $row['NIC'];
            $this->FullName_English = $row['FullName_English'];
            $this->Address = $row['Address'];
            $this->STATUS = $row['STATUS'] ?: 'Pending';
            $this->Division_ID = $row['Division_ID'];
            return true;
        }
        return false;
    }

    // Update voter status
    public function updateStatus($status) {
        $query = 'UPDATE ' . $this->table . ' SET STATUS = :status WHERE NIC = :nic';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':nic', $this->NIC);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function updateStatusToVerified() {
        return $this->updateStatus('Verified');
    }

    public function updateStatusToVoted() {
        return $this->updateStatus('Voted');
    }

    // Get active election
    public function getActiveElection() {
        $query = 'SELECT Election_ID FROM ' . $this->election_table . ' WHERE IsValid = 1 LIMIT 1';
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? $row['Election_ID'] : null;
    }

    // Initiate 3 pending votes with same Ballot_ID
    public function initiateVote() {
        if (!$this->findByNIC()) {
            return 'NO_VOTER';
        }

        if ($this->STATUS === 'Voted') {
            return 'ALREADY_VOTED';
        }

        if ($this->STATUS !== 'Verified') {
            return 'NOT_VERIFIED';
        }

        $electionID = $this->getActiveElection();
        if (!$electionID) {
            return 'NO_ACTIVE_ELECTION';
        }

        if (!$this->Division_ID) {
            return 'NO_DIVISION';
        }

        // Check for existing pending votes for THIS voter & election
        $query = 'SELECT COUNT(*) as count, Ballot_ID FROM ' . $this->vote_table . ' 
                  WHERE STATUS = "Pending" AND Election_ID = :eid AND Division_ID = :did';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':eid', $electionID);
        $stmt->bindParam(':did', $this->Division_ID);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row && $row['count'] > 0) {
            return 'VOTE_ALREADY_PENDING';
        }

        // Get next Ballot_ID
        $max_query = 'SELECT COALESCE(MAX(Ballot_ID), 0) + 1 AS next_id FROM ' . $this->vote_table;
        $stmt = $this->conn->prepare($max_query);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $ballot_id = $row['next_id'] ?? 1;

        try {
            $this->conn->beginTransaction();
            for ($i = 1; $i <= 3; $i++) {
                $query = 'INSERT INTO ' . $this->vote_table . ' 
                          (Ballot_ID, Preference, Candidate_ID, Election_ID, Division_ID, STATUS, Timestamp)
                          VALUES (:bid, :pref, NULL, :eid, :did, "Pending", NOW())';
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':bid', $ballot_id, PDO::PARAM_INT);
                $stmt->bindParam(':pref', $i);
                $stmt->bindParam(':eid', $electionID);
                $stmt->bindParam(':did', $this->Division_ID);
                if (!$stmt->execute()) {
                    throw new Exception('Insert failed for preference ' . $i);
                }
            }
            $this->conn->commit();
            return 'SUCCESS';
        } catch (Exception $e) {
            $this->conn->rollBack();
            error_log('Initiate vote error: ' . $e->getMessage());
            return 'DB_ERROR';
        }
    }

    // Record votes bulk (update preferences, set remaining to null and Voted)
    public function recordVotesBulk($preferences) {
        if (!$this->findByNIC()) {
            return 'NO_VOTER';
        }

        if ($this->STATUS === 'Voted') {
            return 'ALREADY_VOTED';
        }

        if ($this->STATUS !== 'Verified') {
            return 'NOT_VERIFIED';
        }

        $electionID = $this->getActiveElection();
        if (!$electionID) {
            return 'NO_ACTIVE_ELECTION';
        }

        // Check if pending votes exist, if not initiate
        $query = 'SELECT COUNT(*) as count, Ballot_ID FROM ' . $this->vote_table . ' 
                  WHERE Election_ID = :eid AND Division_ID = :did AND STATUS = "Pending"';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':eid', $electionID);
        $stmt->bindParam(':did', $this->Division_ID);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row['count'] == 0) {
            $init_result = $this->initiateVote();
            if ($init_result !== 'SUCCESS') {
                error_log('Initiate vote failed: ' . $init_result);
                return $init_result;
            }
        }

        try {
            $this->conn->beginTransaction();
            for ($pref = 1; $pref <= 3; $pref++) {
                $candidate_id = isset($preferences[$pref]) ? $preferences[$pref] : null;

                // Validate Candidate_ID exists if provided
                if ($candidate_id !== null) {
                    $query = 'SELECT COUNT(*) as count FROM candidate WHERE Candidate_ID = :cid';
                    $stmt = $this->conn->prepare($query);
                    $stmt->bindParam(':cid', $candidate_id);
                    $stmt->execute();
                    $row = $stmt->fetch(PDO::FETCH_ASSOC);
                    if ($row['count'] == 0) {
                        throw new Exception('Invalid Candidate_ID: ' . $candidate_id);
                    }
                }

                $query = 'UPDATE ' . $this->vote_table . ' 
                          SET Candidate_ID = :candidate_id, STATUS = "Voted"
                          WHERE Preference = :pref AND Election_ID = :eid AND Division_ID = :did AND STATUS = "Pending"
                          LIMIT 1';
                $stmt = $this->conn->prepare($query);
                if ($candidate_id === null) {
                    $stmt->bindValue(':candidate_id', null, PDO::PARAM_NULL);
                } else {
                    $stmt->bindParam(':candidate_id', $candidate_id);
                }
                $stmt->bindParam(':pref', $pref);
                $stmt->bindParam(':eid', $electionID);
                $stmt->bindParam(':did', $this->Division_ID);
                if (!$stmt->execute()) {
                    throw new Exception('Update failed for preference ' . $pref);
                }
            }
            $this->updateStatusToVoted();
            $this->conn->commit();
            return 'SUCCESS';
        } catch (Exception $e) {
            $this->conn->rollBack();
            error_log('Record votes bulk error: ' . $e->getMessage());
            return 'DB_ERROR';
        }
    }

    // Get vote status for the voter
    public function getVoteStatus() {
        $electionID = $this->getActiveElection();
        if (!$electionID) {
            return null;
        }

        $query = 'SELECT STATUS FROM ' . $this->vote_table . ' 
                  WHERE Election_ID = :eid ORDER BY Timestamp DESC LIMIT 1';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':eid', $electionID);
        //$stmt->bindParam(':did', $this->Division_ID);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? $row['STATUS'] : null;
    }

    // Find verified voter
    public function findVerifiedVoter() {
        $query = 'SELECT NIC, FullName_English, Address FROM ' . $this->table . ' 
                  WHERE STATUS = "Verified" LIMIT 1';
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            $this->NIC = $row['NIC'];
            $this->FullName_English = $row['FullName_English'];
            $this->Address = $row['Address'];
            return true;
        }
        return false;
    }
// Get Voter Stats by Electoral Division
    public function getVoterStatsByElectoralDivision() {
        // Create query
        $query = 'SELECT
            d.Electoral_Division,
            COUNT(CASE WHEN v.STATUS = "Voted" THEN 1 END) as voted,
            COUNT(CASE WHEN v.STATUS = "Pending" THEN 1 END) as non_voted
          FROM
            divisions d
          LEFT JOIN
            ' . $this->table . ' v ON d.Division_ID = v.Division_ID
          GROUP BY
            d.Electoral_Division';

      // Prepare statement
      $stmt = $this->conn->prepare($query);

      // Execute query
      $stmt->execute();

      return $stmt;
    }
  
}
?>