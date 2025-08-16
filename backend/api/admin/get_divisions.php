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
    // Validate HTTP method
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        throw new Exception("Only GET method is allowed");
    }

    // Get query parameters
    $hierarchy = isset($_GET['hierarchy']) ? trim($_GET['hierarchy']) : '';
    $electoral_division = isset($_GET['electoral_division']) ? trim($_GET['electoral_division']) : '';
    $polling_division = isset($_GET['polling_division']) ? trim($_GET['polling_division']) : '';
    $active_only = isset($_GET['active_only']) ? filter_var($_GET['active_only'], FILTER_VALIDATE_BOOLEAN) : true;

    // Validate hierarchy parameter
    $allowed_hierarchies = ['electoral', 'polling', 'gn', 'all'];
    if (!in_array($hierarchy, $allowed_hierarchies)) {
        throw new Exception("Invalid hierarchy parameter. Allowed values: " . implode(', ', $allowed_hierarchies));
    }

    $data = [];
    $query = "";
    $params = [];

    switch ($hierarchy) {
        case 'electoral':
            // Get unique electoral divisions
            $query = "SELECT DISTINCT Electoral_Division FROM divisions";
            if ($active_only) {
                $query .= " WHERE IsActive = 1";
            }
            $query .= " ORDER BY Electoral_Division";
            break;

        case 'polling':
            // Get polling divisions for a specific electoral division
            if (empty($electoral_division)) {
                throw new Exception("electoral_division parameter is required for polling hierarchy");
            }
            
            $query = "SELECT DISTINCT Polling_Division FROM divisions WHERE Electoral_Division = :electoral";
            $params[':electoral'] = $electoral_division;
            
            if ($active_only) {
                $query .= " AND IsActive = 1";
            }
            $query .= " ORDER BY Polling_Division";
            break;

        case 'gn':
            // Get GN divisions for specific electoral and polling divisions
            if (empty($electoral_division) || empty($polling_division)) {
                throw new Exception("Both electoral_division and polling_division parameters are required for gn hierarchy");
            }
            
            $query = "SELECT DISTINCT Gramaniladhari_Division FROM divisions 
                      WHERE Electoral_Division = :electoral AND Polling_Division = :polling";
            $params[':electoral'] = $electoral_division;
            $params[':polling'] = $polling_division;
            
            if ($active_only) {
                $query .= " AND IsActive = 1";
            }
            $query .= " ORDER BY Gramaniladhari_Division";
            break;

        case 'all':
            // Get all division details with optional filtering
            $query = "SELECT Division_ID, Division_Code, Electoral_Division, Polling_Division, 
                             Gramaniladhari_Division, IsActive FROM divisions";
            $conditions = [];
            
            if (!empty($electoral_division)) {
                $conditions[] = "Electoral_Division = :electoral";
                $params[':electoral'] = $electoral_division;
            }
            
            if (!empty($polling_division)) {
                $conditions[] = "Polling_Division = :polling";
                $params[':polling'] = $polling_division;
            }
            
            if ($active_only) {
                $conditions[] = "IsActive = 1";
            }
            
            if (!empty($conditions)) {
                $query .= " WHERE " . implode(" AND ", $conditions);
            }
            
            $query .= " ORDER BY Electoral_Division, Polling_Division, Gramaniladhari_Division";
            break;
    }

    // Prepare and execute the query
    $stmt = $db->prepare($query);
    
    // Bind parameters if any
    foreach ($params as $param => $value) {
        $stmt->bindParam($param, $value);
    }
    
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Process results based on hierarchy
    if ($hierarchy === 'all') {
        $data = $results;
    } else {
        // Extract the specific column values
        $columnMap = [
            'electoral' => 'Electoral_Division',
            'polling' => 'Polling_Division',
            'gn' => 'Gramaniladhari_Division'
        ];
        
        $columnName = $columnMap[$hierarchy];
        $data = array_column($results, $columnName);
        
        // Remove any empty or null values and ensure uniqueness
        $data = array_values(array_unique(array_filter($data, function($value) {
            return !empty(trim($value));
        })));
    }

    // Return successful response
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Divisions retrieved successfully',
        'data' => $data,
        'count' => count($data),
        'filters' => [
            'hierarchy' => $hierarchy,
            'electoral_division' => $electoral_division ?: null,
            'polling_division' => $polling_division ?: null,
            'active_only' => $active_only
        ]
    ]);

} catch (Exception $e) {
    error_log('Divisions API error: ' . $e->getMessage());
    
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage(),
        'error_code' => 'DIVISIONS_FETCH_FAILED'
    ]);

} catch (PDOException $e) {
    error_log('Database error in divisions API: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed. Please try again later.',
        'error_code' => 'DATABASE_ERROR'
    ]);
}
?>