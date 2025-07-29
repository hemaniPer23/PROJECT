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
    // Query to get all elections
    $query = "SELECT Election_ID, Election_Type, Date, Start_Time, End_Time, IsValid FROM election ORDER BY Date DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();

    $elections = array();
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $elections[] = array(
            'Election_ID' => $row['Election_ID'],
            'Election_Type' => $row['Election_Type'],
            'Date' => $row['Date'],
            'Start_Time' => $row['Start_Time'],
            'End_Time' => $row['End_Time'],
            'IsValid' => $row['IsValid']
        );
    }

    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Elections retrieved successfully',
        'data' => $elections,
        'count' => count($elections)
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to retrieve elections: ' . $e->getMessage()
    ]);
}
?>