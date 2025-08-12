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
    $hierarchy = isset($_GET['hierarchy']) ? $_GET['hierarchy'] : null; // 'electoral', 'polling', 'gn'
    $active_only = isset($_GET['active_only']) ? filter_var($_GET['active_only'], FILTER_VALIDATE_BOOLEAN) : true;

    if ($hierarchy === 'electoral') {
        // Get all electoral divisions
        $query = "SELECT DISTINCT Electoral_Division FROM divisions";
        if ($active_only) {
            $query .= " WHERE IsActive = 1";
        }
        $query .= " ORDER BY Electoral_Division";
        
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        $divisions = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $divisions[] = $row['Electoral_Division'];
        }
        
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'message' => 'Electoral divisions retrieved successfully',
            'data' => $divisions,
            'type' => 'electoral_divisions'
        ]);
        
    } elseif ($hierarchy === 'polling') {
        // Get polling divisions for specific electoral division
        if (!$electoral_division) {
            throw new Exception("Electoral division parameter is required for polling divisions");
        }
        
        $query = "SELECT DISTINCT Polling_Division FROM divisions WHERE Electoral_Division = :electoral_division";
        if ($active_only) {
            $query .= " AND IsActive = 1";
        }
        $query .= " ORDER BY Polling_Division";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':electoral_division', $electoral_division);
        $stmt->execute();
        
        $divisions = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $divisions[] = $row['Polling_Division'];
        }
        
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'message' => 'Polling divisions retrieved successfully',
            'data' => $divisions,
            'type' => 'polling_divisions',
            'electoral_division' => $electoral_division
        ]);
        
    } elseif ($hierarchy === 'gn') {
        // Get GN divisions for specific electoral and polling division
        if (!$electoral_division || !$polling_division) {
            throw new Exception("Electoral division and polling division parameters are required for GN divisions");
        }
        
        $query = "SELECT DISTINCT Gramaniladhari_Division FROM divisions 
                  WHERE Electoral_Division = :electoral_division 
                  AND Polling_Division = :polling_division";
        if ($active_only) {
            $query .= " AND IsActive = 1";
        }
        $query .= " ORDER BY Gramaniladhari_Division";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':electoral_division', $electoral_division);
        $stmt->bindParam(':polling_division', $polling_division);
        $stmt->execute();
        
        $divisions = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $divisions[] = $row['Gramaniladhari_Division'];
        }
        
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'message' => 'GN divisions retrieved successfully',
            'data' => $divisions,
            'type' => 'gn_divisions',
            'electoral_division' => $electoral_division,
            'polling_division' => $polling_division
        ]);
        
    } else {
        // Get all divisions with complete information
        $query = "SELECT 
            Division_ID,
            Division_Code,
            Electoral_Division,
            Polling_Division,
            Gramaniladhari_Division,
            IsActive
        FROM divisions";
        
        $params = array();
        $conditions = array();
        
        if ($electoral_division) {
            $conditions[] = "Electoral_Division = :electoral_division";
            $params[':electoral_division'] = $electoral_division;
        }
        
        if ($polling_division) {
            $conditions[] = "Polling_Division = :polling_division";
            $params[':polling_division'] = $polling_division;
        }
        
        if ($active_only) {
            $conditions[] = "IsActive = 1";
        }
        
        if (!empty($conditions)) {
            $query .= " WHERE " . implode(" AND ", $conditions);
        }
        
        $query .= " ORDER BY Electoral_Division, Polling_Division, Gramaniladhari_Division";
        
        $stmt = $db->prepare($query);
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->execute();
        
        $divisions = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $divisions[] = array(
                'division_id' => $row['Division_ID'],
                'division_code' => $row['Division_Code'],
                'electoral_division' => $row['Electoral_Division'],
                'polling_division' => $row['Polling_Division'],
                'gramaniladhari_division' => $row['Gramaniladhari_Division'],
                'is_active' => $row['IsActive']
            );
        }
        
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'message' => 'Divisions retrieved successfully',
            'data' => $divisions,
            'count' => count($divisions),
            'type' => 'all_divisions'
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