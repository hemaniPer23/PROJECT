<?php
// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, OPTIONS');
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
    // Get NIC from URL parameter
    $nic = isset($_GET['nic']) ? trim($_GET['nic']) : null;
    
    if (!$nic) {
        throw new Exception("NIC parameter is required");
    }

    // Validate NIC format
    if (!preg_match('/^(\d{9}[vVxX]|\d{12})$/', $nic)) {
        throw new Exception("Invalid NIC format");
    }

    // Query to get voter by NIC
    $query = "SELECT 
        NIC,
        FullName_Sinhala,
        FullName_English,
        Gender,
        DOB,
        Address,
        Mobile_Number,
        Email,
        Electoral_Division,
        Polling_Division,
        Gramaniladhari_Division,
        STATUS
    FROM voter 
    WHERE NIC = :nic
    LIMIT 1";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':nic', $nic);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $voter_data = array(
            'nic' => $row['NIC'],
            'fullname_sinhala' => $row['FullName_Sinhala'],
            'fullname_english' => $row['FullName_English'],
            'gender' => $row['Gender'],
            'dob' => $row['DOB'],
            'address' => $row['Address'],
            'mobile_number' => $row['Mobile_Number'],
            'email' => $row['Email'],
            'electoral_division' => $row['Electoral_Division'],
            'polling_division' => $row['Polling_Division'],
            'gramaniladhari_division' => $row['Gramaniladhari_Division'],
            'status' => $row['STATUS']
        );

        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'message' => 'Voter found',
            'data' => $voter_data
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            'status' => 'error',
            'message' => 'Voter not found with the provided NIC'
        ]);
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>