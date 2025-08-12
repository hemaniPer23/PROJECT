<?php
// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: PUT, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    http_response_code(200);
    exit();
}

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../../config/Database.php';

// Create database connection
$database = new Database();
$db = $database->connect();

try {
    // Get JSON input
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data) {
        throw new Exception("Invalid JSON data received");
    }

    // Validate required fields
    if (!isset($data['nic']) || empty(trim($data['nic']))) {
        throw new Exception("NIC is required");
    }

    if (!isset($data['status']) || empty(trim($data['status']))) {
        throw new Exception("Status is required");
    }

    $nic = trim($data['nic']);
    $status = trim($data['status']);

    // Validate NIC format
    if (!preg_match('/^(\d{9}[vVxX]|\d{12})$/', $nic)) {
        throw new Exception("Invalid NIC format");
    }

    // Validate status value
    $valid_statuses = ['Pending', 'Voted'];
    if (!in_array($status, $valid_statuses)) {
        throw new Exception("Invalid status. Must be 'Pending' or 'Voted'");
    }

    // Check if voter exists
    $check_query = "SELECT NIC, STATUS FROM voter WHERE NIC = :nic LIMIT 1";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(':nic', $nic);
    $check_stmt->execute();

    if ($check_stmt->rowCount() == 0) {
        throw new Exception("Voter not found with the provided NIC");
    }

    $current_voter = $check_stmt->fetch(PDO::FETCH_ASSOC);
    
    // Check if status is already the same
    if ($current_voter['STATUS'] === $status) {
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'message' => 'Voter status is already ' . $status,
            'data' => [
                'nic' => $nic,
                'status' => $status
            ]
        ]);
        exit();
    }

    // Start transaction
    $db->beginTransaction();

    // Update voter status
    $update_query = "UPDATE voter SET STATUS = :status WHERE NIC = :nic";
    $update_stmt = $db->prepare($update_query);
    $update_stmt->bindParam(':status', $status);
    $update_stmt->bindParam(':nic', $nic);

    if ($update_stmt->execute()) {
        // Commit transaction
        $db->commit();
        
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'message' => 'Voter status updated successfully',
            'data' => [
                'nic' => $nic,
                'previous_status' => $current_voter['STATUS'],
                'new_status' => $status,
                'updated_at' => date('Y-m-d H:i:s')
            ]
        ]);
    } else {
        throw new Exception("Failed to update voter status");
    }

} catch (Exception $e) {
    // Rollback transaction if it was started
    if ($db->inTransaction()) {
        $db->rollback();
    }

    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>