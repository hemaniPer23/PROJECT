<?php
// Headers and CORS
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../../config/Database.php';
include_once '../../models/Voter.php';

$database = new Database();
$db = $database->connect();
$voter = new Voter($db);

$voter->NIC = isset($_GET['nic']) ? $_GET['nic'] : die();

if ($voter->findByNIC()) {
    // Check if the voter's status is 'Voted'
    if ($voter->STATUS === 'Voted') {
        http_response_code(403); // Forbidden
        echo json_encode(['status' => 'fail', 'message' => 'This person has already voted. Access denied.']);
        exit();
    }
    
    // If status is NULL or 'Pending', send success response with all data
    $voter_arr = [
        'status' => 'success',
        'data' => [
            'nic' => $voter->NIC,
            'name' => $voter->FullName_English,
            'address' => $voter->Address
        ]
    ];
    
    http_response_code(200); // OK
    echo json_encode($voter_arr);

} else {
    // If no voter is found
    http_response_code(404); // Not Found
    echo json_encode(['status' => 'fail', 'message' => 'Voter not found with the provided NIC.']);
}
?>