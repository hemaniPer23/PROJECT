<?php

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

// The login() method now returns true on success, false on failure.
if ($admin->login()) {
    // Credentials are correct. Now, check the role.
    
    if ($admin->Admin_Role === 'Officer') {
        // If the role is 'Officer', deny access from this login page.
        http_response_code(403); // Forbidden
        echo json_encode([
            'status' => 'fail', 
            'message' => 'Access Denied.'
        ]);
    } else {
        // For all other roles ('Presiding Officer', 'commission', etc.), allow login.
        http_response_code(200); // OK
        echo json_encode([
            'status' => 'success',
            'message' => 'Login Successful.',
            'admin_id' => $admin->Admin_ID,
            'role' => $admin->Admin_Role
        ]);
    }
} else {
    // If login() returned false, it means credentials were wrong.
    http_response_code(401); // Unauthorized
    echo json_encode(['status' => 'fail', 'message' => 'Login Failed. Invalid UserID or Password.']);
}
?>
