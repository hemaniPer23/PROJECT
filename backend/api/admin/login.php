<?php
// CORS and Headers (as before)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    http_response_code(200);
    exit();
}
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../../config/Database.php';
include_once '../../models/Admin.php';

$database = new Database();
$db = $database->connect();
$admin = new Admin($db);

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->Admin_ID) || !isset($data->Admin_Password)) {
    http_response_code(400);
    echo json_encode(['status' => 'fail', 'message' => 'Admin ID or Password not provided.']);
    exit();
}

$admin->Admin_ID = $data->Admin_ID;
$admin->Admin_Password = $data->Admin_Password;

if ($admin->login()) {
    $role = $admin->Admin_Role;
    $isSuccess = false;
    $message = 'Access Denied for this role.'; // Default error message

    if ($role === 'Officer') {
        if ($admin->isElectionActive()) {
            $isSuccess = true;
        } else {
            $message = 'Officer login is only available during the election hours.';
        }
    } elseif ($role === 'Result') {
        if ($admin->hasElectionEnded()) {
            $isSuccess = true;
        } else {
            $message = 'Results can be accessed only after the election has ended.';
        }
    } elseif ($role === 'Presiding Officer') {
        if (!$admin->hasElectionEnded() OR $admin->preElection()) {
            $isSuccess = true;
        } else {
            $message = 'The election has ended.';
        }
    } elseif ($role === 'commission') {
        if ($admin->isCommissionLoginAllowed()) {
            $isSuccess = true;
        } else {
            $message = 'Commission login is disabled within 30 days of the election.';
        }
    } else { // For 'Presiding Officer' and any other roles without special time rules
        $isSuccess = true;
    }

    if ($isSuccess) {
        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => 'Login Successful.', 'role' => $role]);
    } else {
        http_response_code(403);
        echo json_encode(['status' => 'fail', 'message' => $message]);
    }
    
} else {
    http_response_code(401);
    echo json_encode(['status' => 'fail', 'message' => 'Login Failed. Invalid Credentials.']);
}
?>