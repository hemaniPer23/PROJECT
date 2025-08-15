<?php
// Headers and CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    http_response_code(200);
    exit();
}
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');

include_once '../../config/Database.php';
include_once '../../models/Voter.php';

$database = new Database();
$db = $database->connect();
$voter = new Voter($db);

$data = json_decode(file_get_contents("php://input"));

if(empty($data->nic)) {
    http_response_code(400);
    echo json_encode(['status' => 'fail', 'message' => 'NIC not provided.']);
    exit();
}

$voter->NIC = $data->nic;

try {
    if($voter->initiateVote()) {
        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => 'Vote initiated successfully. Status is Pending.']);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'fail', 'message' => 'Failed to initiate vote. There might be another vote pending.']);
    }
} catch (PDOException $e) {
    http_response_code(503);
    echo json_encode(['status' => 'fail', 'message' => 'Database Error: ' . $e->getMessage()]);
}
?>