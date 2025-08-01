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
    // Get query parameters
    $electoral_division = isset($_GET['electoral_division']) ? $_GET['electoral_division'] : null;
    $polling_division = isset($_GET['polling_division']) ? $_GET['polling_division'] : null;
    $gramaniladhari_division = isset($_GET['gramaniladhari_division']) ? $_GET['gramaniladhari_division'] : null;
    $status = isset($_GET['status']) ? $_GET['status'] : null;
    $search = isset($_GET['search']) ? $_GET['search'] : null;
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
    $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

    // Build base query
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
    FROM voter WHERE 1=1";

    $params = array();

    // Add filters
    if ($electoral_division) {
        $query .= " AND Electoral_Division = :electoral_division";
        $params[':electoral_division'] = $electoral_division;
    }

    if ($polling_division) {
        $query .= " AND Polling_Division = :polling_division";
        $params[':polling_division'] = $polling_division;
    }

    if ($gramaniladhari_division) {
        $query .= " AND Gramaniladhari_Division = :gramaniladhari_division";
        $params[':gramaniladhari_division'] = $gramaniladhari_division;
    }

    if ($status) {
        $query .= " AND STATUS = :status";
        $params[':status'] = $status;
    }

    if ($search) {
        $query .= " AND (FullName_English LIKE :search OR FullName_Sinhala LIKE :search OR NIC LIKE :search)";
        $params[':search'] = '%' . $search . '%';
    }

    // Add ordering and pagination
    $query .= " ORDER BY FullName_English ASC LIMIT :limit OFFSET :offset";

    $stmt = $db->prepare($query);
    
    // Bind parameters
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);

    $stmt->execute();

    $voters = array();
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $voters[] = array(
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
    }

    // Get total count for pagination
    $count_query = "SELECT COUNT(*) as total FROM voter WHERE 1=1";
    $count_params = array();

    if ($electoral_division) {
        $count_query .= " AND Electoral_Division = :electoral_division";
        $count_params[':electoral_division'] = $electoral_division;
    }

    if ($polling_division) {
        $count_query .= " AND Polling_Division = :polling_division";
        $count_params[':polling_division'] = $polling_division;
    }

    if ($gramaniladhari_division) {
        $count_query .= " AND Gramaniladhari_Division = :gramaniladhari_division";
        $count_params[':gramaniladhari_division'] = $gramaniladhari_division;
    }

    if ($status) {
        $count_query .= " AND STATUS = :status";
        $count_params[':status'] = $status;
    }

    if ($search) {
        $count_query .= " AND (FullName_English LIKE :search OR FullName_Sinhala LIKE :search OR NIC LIKE :search)";
        $count_params[':search'] = '%' . $search . '%';
    }

    $count_stmt = $db->prepare($count_query);
    foreach ($count_params as $key => $value) {
        $count_stmt->bindValue($key, $value);
    }
    $count_stmt->execute();
    $total_count = $count_stmt->fetch(PDO::FETCH_ASSOC)['total'];

    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Voters retrieved successfully',
        'data' => $voters,
        'pagination' => [
            'total' => intval($total_count),
            'limit' => $limit,
            'offset' => $offset,
            'returned' => count($voters)
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to retrieve voters: ' . $e->getMessage()
    ]);
}
?>