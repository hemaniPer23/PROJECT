<?php
session_start();
include 'db.php';

// this url is the frontend URL that will be allowed to access this API
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, Another-Allowed-Header");

$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'];
$password = $data['password'];

$result = $conn->query("SELECT * FROM admin WHERE Admin_UserName = '$username'");
if ($row = $result->fetch_assoc()) {
    if ($password === $row['Admin_Password']) {
        $_SESSION['admin_logged_in'] = true;
        if($row['Admin_Role']==='commission'){
            echo json_encode(['role' => 'commission','status' => 'success']);
        }else {
            echo json_encode(['message' => 'fail']);
        }
        
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid password']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Admin not found']);
}
?>