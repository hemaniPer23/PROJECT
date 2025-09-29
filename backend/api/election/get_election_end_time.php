<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../../config/Database.php';
include_once '../../models/Election.php';

// Instantiate DB & connect
$database = new Database();
$db = $database->connect();

// Instantiate election object
$election = new Election($db);

// Get election end time
$result = $election->getElectionEndTime();

if ($result) {
    // Create array
    $election_arr = array(
        'End_Time' => $election->End_Time
    );
    // Make JSON
    echo json_encode($election_arr);
} else {
    // No active election found
    echo json_encode(
        array('message' => 'No active election found')
    );
}
?>