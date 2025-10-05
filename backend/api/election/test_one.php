<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../../config/Database.php';
$database = new Database();
$db = $database->connect();

// The query to delete up to 3 rows where Ballot_ID is 1
$query = "DELETE FROM vote WHERE `vote`.`Ballot_ID` = 1 LIMIT 3";

try {
    $stmt = $db->prepare($query);
    
    // Execute the statement
    if ($stmt->execute()) {
        // Check how many rows were actually deleted
        $rowCount = $stmt->rowCount();

        if ($rowCount > 0) {
            // Success: one or more rows were deleted
            echo json_encode([
                "status" => "success",
                "message" => "$rowCount row(s) deleted successfully."
            ]);
        } else {
            // Execution was successful, but no rows matched the criteria
            echo json_encode([
                "status" => "error",
                "message" => "No rows found with Ballot_ID = 1 to delete."
            ]);
        }
    } else {
        // The query execution failed
        echo json_encode([
            "status" => "error",
            "message" => "Query execution failed."
        ]);
    }
} catch (PDOException $e) {
    // Catch any database connection or query errors
    echo json_encode([
        "status" => "error",
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>