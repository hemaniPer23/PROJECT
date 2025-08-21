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
$result = $voter->initiateVote();

switch ($result) {
    case 'SUCCESS':
        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => 'Vote initiated successfully.']);
        break;
    case 'NO_ACTIVE_ELECTION':
        http_response_code(404);
        echo json_encode(['status' => 'fail', 'message' => 'Could not find an active election to assign this vote to.']);
        break;
    case 'VOTE_ALREADY_PENDING':
        http_response_code(409);
        echo json_encode(['status' => 'fail', 'message' => 'Another voter is currently voting. Please wait.']);
        break;
    case 'NO_DIVISION':
        http_response_code(404);
        echo json_encode(['status' => 'fail', 'message' => 'Division for provided NIC not found.']);
        break;
    case 'DB_ERROR':
    default:
        http_response_code(500);
        echo json_encode(['status' => 'fail', 'message' => 'Failed to initiate vote due to a server/database error.']);
        break;
}
?>