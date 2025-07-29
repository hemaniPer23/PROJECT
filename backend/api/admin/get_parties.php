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
    // Query to get all parties
    $query = "SELECT Party_ID, PartyName_Sinhala, PartyName_English, Party_Logo FROM party ORDER BY PartyName_English";
    $stmt = $db->prepare($query);
    $stmt->execute();

    $parties = array();
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $parties[] = array(
            'Party_ID' => $row['Party_ID'],
            'PartyName_Sinhala' => $row['PartyName_Sinhala'],
            'PartyName_English' => $row['PartyName_English'],
            'Party_Logo' => $row['Party_Logo']
        );
    }

    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Parties retrieved successfully',
        'data' => $parties,
        'count' => count($parties)
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to retrieve parties: ' . $e->getMessage()
    ]);
}
?>