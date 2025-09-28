<?php
// api/vote/record_votes.php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: *');
    header('Access-Control-Allow-Headers: Content-Type');
    exit();
}

include_once '../../config/Database.php';
include_once '../../models/Voter.php';

$input = json_decode(file_get_contents("php://input"));

if (empty($input->nic) || empty($input->votes) || !is_array($input->votes)) {
    http_response_code(400);
    echo json_encode(['status' => 'fail', 'message' => 'nic and votes array required']);
    exit();
}

$database = new Database();
$db = $database->connect();
$voter = new Voter($db);
$voter->NIC = $input->nic;

if (!$voter->findByNIC()) {
    http_response_code(404);
    echo json_encode(['status' => 'fail', 'message' => 'Voter not found']);
    exit();
}

if ($voter->STATUS === 'Voted') {
    http_response_code(403);
    echo json_encode(['status' => 'fail', 'message' => 'Voter already voted']);
    exit();
}

// Attempt to record votes inside transaction
try {
    $db->beginTransaction();

    // Expect exactly 3 preferences; but allow backend to accept fewer in the array,
    // we will ensure preferences 1..3 are processed (missing => null)
    $prefsMap = [1 => null, 2 => null, 3 => null];
    foreach ($input->votes as $v) {
        if (isset($v->preference)) {
            $p = intval($v->preference);
            if ($p >= 1 && $p <= 3) {
                // if candidate_id not provided or null -> null, else numeric
                $prefsMap[$p] = isset($v->candidate_id) ? ($v->candidate_id === null ? null : intval($v->candidate_id)) : null;
            }
        }
    }

    // For each preference, call recordVote
    foreach ($prefsMap as $pref => $candidate_id) {
        // if recordVote fails (e.g. no pending row), still continue to try others
        $ok = $voter->recordVote($pref, $candidate_id);
        // Optionally: if you want strict behavior, you can check $ok and rollback if missing
    }

    // After writing all preferences mark voter as Voted
    $voter->updateStatusToVoted();

    $db->commit();
    echo json_encode(['status' => 'success', 'message' => 'Votes recorded']);
} catch (PDOException $e) {
    $db->rollBack();
    http_response_code(500);
    echo json_encode(['status' => 'fail', 'message' => 'Database error: ' . $e->getMessage()]);
}
