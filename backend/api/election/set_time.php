<?php
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: PUT, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    http_response_code(200);
    exit();
}

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../../config/Database.php';
include_once '../../models/Election.php';

$database = new Database();
$db = $database->connect();
$election = new Election($db);

$data = json_decode(file_get_contents("php://input"));

if(empty($data->Start_time) || empty($data->End_time)) {
    http_response_code(400);
    echo json_encode(['status' => 'fail', 'message' => 'Incomplete data provided.']);
    exit();
}
//set time
$election->Start_time = $data->Start_time;
$election->End_time = $data->End_time;

try {
    if($election->setTimeAndActivate()) {
        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => 'Election time set and activated for today.']);
    } else {
        // This error now means no election was found for today OR the update failed
        http_response_code(500);
        echo json_encode(['status' => 'fail', 'message' => 'Failed to activate election. Please ensure an election is scheduled for today and has not been activated yet.']);
    }
} catch (PDOException $e) {
    http_response_code(503);
    echo json_encode(['status' => 'fail', 'message' => 'Database Error: ' . $e->getMessage()]);
}
?>