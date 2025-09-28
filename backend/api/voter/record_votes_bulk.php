<?php
// api/voter/record_votes_bulk.php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    exit();
}

include_once '../../config/Database.php';
include_once '../../models/Voter.php';

$input = json_decode(file_get_contents("php://input"));

if (empty($input->nic)) {
    http_response_code(400);
    echo json_encode(['status' => 'fail', 'message' => 'NIC is required']);
    exit();
}

$database = new Database();
$db = $database->connect();
$voter = new Voter($db);
$voter->NIC = $input->nic;

// Validate preferences
$preferences = isset($input->preferences) ? (array)$input->preferences : [];
foreach ($preferences as $pref => $candidate_id) {
    if (!in_array($pref, ['1', '2', '3'])) {
        http_response_code(400);
        echo json_encode(['status' => 'fail', 'message' => 'Invalid preference number: ' . $pref]);
        exit();
    }
}

$result = $voter->recordVotesBulk($preferences);

if ($result === 'SUCCESS') {
    http_response_code(200);
    echo json_encode(['status' => 'success', 'message' => 'Votes recorded successfully']);
} elseif ($result === 'ALREADY_VOTED') {
    http_response_code(403);
    echo json_encode(['status' => 'fail', 'message' => 'Voter already voted']);
} elseif ($result === 'NO_VOTER') {
    http_response_code(404);
    echo json_encode(['status' => 'fail', 'message' => 'Voter not found']);
} elseif ($result === 'NO_ACTIVE_ELECTION') {
    http_response_code(404);
    echo json_encode(['status' => 'fail', 'message' => 'No active election']);
} elseif ($result === 'NOT_VERIFIED') {
    http_response_code(403);
    echo json_encode(['status' => 'fail', 'message' => 'Voter not verified']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'fail', 'message' => 'Database error or unknown error']);
}
?>