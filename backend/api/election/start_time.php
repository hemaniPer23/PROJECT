<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../../config/Database.php';
$database = new Database();
$db = $database->connect();

$query = "SELECT Date, Start_Time FROM election WHERE IsValid=1 LIMIT 1";

// Use PDO methods to prepare and execute the query
$stmt = $db->prepare($query);
$stmt->execute();

// Check if a row was found
if ($stmt->rowCount() > 0) {
    // Fetch the results using the PDO::FETCH_ASSOC method
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode([
        "status" => "success",
        "date" => $row['Date'],
        "start_time" => $row['Start_Time']
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "No valid election found."
    ]);
}
?>