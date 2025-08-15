<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Include necessary class files
include_once '../../config/Database.php';
include_once '../../models/Voter.php';

// Instantiate Database and connect
$database = new Database();
$db = $database->connect();

$voter = new Voter($db); // Instantiate Voter object

//find a voter with 'verified' status
if ($voter->findVerifiedVoter()) {
    // If a verified voter is found, create an array with their details
    $voter_details = [
        'status' => 'success',
        'data' => [
            'nic' => $voter->NIC,
            'name' => $voter->FullName_English
            ]
    ];
    
    // Send a 200 OK response with the voter's data
    http_response_code(200);
    echo json_encode($voter_details);

} else {
    // If no voter with 'Verified' status is found
    // Send a 404 Not Found response
    http_response_code(404);
    echo json_encode([
        'status' => 'fail', 
        'message' => 'No pending voter found at the moment.'
    ]);
}
?>