<?php
// Headers and CORS
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../../config/Database.php';
include_once '../../models/Voter.php';

$database = new Database();
$db = $database->connect();
$voter = new voter($db);

$status = $voter->getVoteStatus();

if ($status) {
    http_response_code(200);
    echo json_encode(['status' => 'success', 'vote_status' => $status]);
} else {
    http_response_code(404);
    echo json_encode(['status' => 'fail', 'message' => 'Vote record not found for this NIC.']);
}
?>