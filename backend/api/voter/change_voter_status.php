<?php
// Headers and CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: PUT, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    http_response_code(200);
    exit();
}
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: PUT');

include_once '../../config/Database.php';
include_once '../../models/Voter.php';

$database = new Database();
$db = $database->connect();
$voter = new Voter($db);

// Get raw posted data
$data = json_decode(file_get_contents("php://input"));

if(empty($data->nic)) {
    http_response_code(400);
    echo json_encode(['status' => 'fail', 'message' => 'NIC not provided.']);
    exit();
}

$voter->NIC = $data->nic;

// Fetch current voter status from the database
if ($voter->findByNIC()) { 
    if ($voter->STATUS == 'Pending') {
        try {
            if ($voter->updateStatusToVerified()) {
                http_response_code(200);
                echo json_encode(['status' => 'success', 'message' => 'Voter status updated to Verified.']);
            } else {
                http_response_code(500);
                echo json_encode(['status' => 'fail', 'message' => 'Failed to update voter status. NIC might be incorrect.']);
            }
        } catch (PDOException $e) {
            http_response_code(503);
            echo json_encode(['status' => 'fail', 'message' => 'Database Error: ' . $e->getMessage()]);
        }
    } else {
        try {
            if ($voter->updateStatusToVoted()) {
                http_response_code(200);
                echo json_encode(['status' => 'success', 'message' => 'Voter status updated to Voted.']);
            } else {
                http_response_code(500);
                echo json_encode(['status' => 'fail', 'message' => 'Failed to update voter status. NIC might be incorrect.']);
            }
        } catch (PDOException $e) {
            http_response_code(503);
            echo json_encode(['status' => 'fail', 'message' => 'Database Error: ' . $e->getMessage()]);
        }
    }
} else {
    http_response_code(404);
    echo json_encode(['status' => 'fail', 'message' => 'Voter not found.']);
}
?>