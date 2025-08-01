<?php
// Handle preflight OPTIONS request
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
    $required_fields = [
        'sinhalaName', 'fullName', 'nic', 'gender', 'dob', 'address', 
        'electoralDivision', 'pollingDivision', 'gramaniladhariDivision'
    ];
    
    foreach ($required_fields as $field) {
        if (!isset($data[$field]) || empty(trim($data[$field]))) {
            throw new Exception("Missing required field: $field");
        }
    }

    // Validate NIC format (Sri Lankan NIC)
    $nic = trim($data['nic']);
    if (!preg_match('/^(\d{9}[vVxX]|\d{12})$/', $nic)) {
        throw new Exception("Invalid NIC format");
    }

    // Validate gender
    $valid_genders = ['Male', 'Female', 'Other'];
    if (!in_array($data['gender'], $valid_genders)) {
        throw new Exception("Invalid gender value");
    }

    // Validate date of birth
    $dob = $data['dob'];
    if (!DateTime::createFromFormat('Y-m-d', $dob)) {
        throw new Exception("Invalid date of birth format");
    }

    // Check age (must be at least 18)
    $birth_date = new DateTime($dob);
    $today = new DateTime();
    $age = $today->diff($birth_date)->y;
    
    if ($age < 18) {
        throw new Exception("Voter must be at least 18 years old");
    }

    // Validate mobile number if provided
    if (!empty($data['mobileNumber'])) {
        if (!preg_match('/^07\d{8}$/', $data['mobileNumber'])) {
            throw new Exception("Invalid mobile number format");
        }
    }

    // Validate email if provided
    if (!empty($data['email'])) {
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception("Invalid email format");
        }
    }

    // Validate electoral division hierarchy
    $valid_divisions = [
        'Galle' => [
            'Balapitiya' => ['Balapitiya', 'Madurawela', 'Gonapinuwala', 'Pahala Balapitiya', 'Udawalawe'],
            'Akmeemana' => ['Akmeemana', 'Tawalama', 'Bataduwa', 'Mahamodara', 'Kataluwa'],
            'Galle' => ['Galle Four Gravets', 'Hirimbura', 'Dadalla', 'Unawatuna', 'Poddala'],
            'Hiniduma' => ['Hiniduma', 'Neluwa', 'Nagoda', 'Thawalama', 'Bope-Poddala']
        ],
        'Matara' => [
            'Hakmana' => ['Hakmana', 'Urubokka', 'Pitabeddara', 'Malimbada', 'Thihagoda'],
            'Matara' => ['Matara Four Gravets', 'Kotuwegoda', 'Kekanadurra', 'Kirinda', 'Weherahena'],
            'Weligama' => ['Weligama', 'Mirissa', 'Kamburugamuwa', 'Kapparatota', 'Bandarawela'],
            'Akuressa' => ['Akuressa', 'Malimbada', 'Athuraliya', 'Morawaka', 'Pasgoda']
        ],
        'Colombo' => [
            'Colombo Central' => ['Colombo 01', 'Colombo 02', 'Colombo 11', 'Colombo 13', 'Colombo 14'],
            'Colombo East' => ['Colombo 04', 'Colombo 05', 'Colombo 06', 'Battaramulla', 'Thalawathugoda'],
            'Colombo West' => ['Colombo 15', 'Kelaniya', 'Peliyagoda', 'Wattala', 'Hendala'],
            'Kaduwela' => ['Kaduwela', 'Malabe', 'Athurugiriya', 'Koswatta', 'Nawala']
        ],
        'Kandy' => [
            'Kandy' => ['Kandy Four Gravets', 'Mahaiyawa', 'Kundasale', 'Tennekumbura', 'Madawala Bazaar'],
            'Gampola' => ['Gampola', 'Nawalapitiya', 'Pusselawa', 'Kotmale', 'Ramboda'],
            'Dambulla' => ['Dambulla', 'Galewela', 'Ukuwela', 'Naula', 'Laggala'],
            'Teldeniya' => ['Teldeniya', 'Kundasale', 'Wattegama', 'Panvila', 'Madugoda']
        ]
    ];

    $electoral_division = $data['electoralDivision'];
    $polling_division = $data['pollingDivision'];
    $gn_division = $data['gramaniladhariDivision'];

    // Validate division hierarchy
    if (!isset($valid_divisions[$electoral_division])) {
        throw new Exception("Invalid electoral division");
    }

    if (!isset($valid_divisions[$electoral_division][$polling_division])) {
        throw new Exception("Invalid polling division for selected electoral division");
    }

    if (!in_array($gn_division, $valid_divisions[$electoral_division][$polling_division])) {
        throw new Exception("Invalid Gramaniladhari division for selected polling division");
    }

    // Check if NIC already exists
    $check_query = "SELECT NIC FROM voter WHERE NIC = :nic";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(':nic', $nic);
    $check_stmt->execute();

    if ($check_stmt->rowCount() > 0) {
        throw new Exception("A voter with this NIC already exists");
    }

    // Check if email already exists (if provided)
    if (!empty($data['email'])) {
        $email_check = "SELECT NIC FROM voter WHERE Email = :email";
        $email_stmt = $db->prepare($email_check);
        $email_stmt->bindParam(':email', $data['email']);
        $email_stmt->execute();

        if ($email_stmt->rowCount() > 0) {
            throw new Exception("A voter with this email already exists");
        }
    }

    // Start transaction
    $db->beginTransaction();

    // Prepare insert query
    $query = "INSERT INTO voter (
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
    ) VALUES (
        :nic,
        :fullname_sinhala,
        :fullname_english,
        :gender,
        :dob,
        :address,
        :mobile_number,
        :email,
        :electoral_division,
        :polling_division,
        :gramaniladhari_division,
        'Pending'
    )";

    $stmt = $db->prepare($query);
    
    // Bind parameters
    $stmt->bindParam(':nic', $nic);
    $stmt->bindParam(':fullname_sinhala', $data['sinhalaName']);
    $stmt->bindParam(':fullname_english', $data['fullName']);
    $stmt->bindParam(':gender', $data['gender']);
    $stmt->bindParam(':dob', $data['dob']);
    $stmt->bindParam(':address', $data['address']);
    
    // Handle optional fields
    $mobile_number = !empty($data['mobileNumber']) ? $data['mobileNumber'] : null;
    $email = !empty($data['email']) ? $data['email'] : null;
    
    $stmt->bindParam(':mobile_number', $mobile_number);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':electoral_division', $data['electoralDivision']);
    $stmt->bindParam(':polling_division', $data['pollingDivision']);
    $stmt->bindParam(':gramaniladhari_division', $data['gramaniladhariDivision']);

    if ($stmt->execute()) {
        // Commit transaction
        $db->commit();
        
        http_response_code(201);
        echo json_encode([
            'status' => 'success',
            'message' => 'Voter registered successfully',
            'data' => [
                'nic' => $nic,
                'fullname_english' => $data['fullName'],
                'electoral_division' => $data['electoralDivision'],
                'polling_division' => $data['pollingDivision'],
                'gramaniladhari_division' => $data['gramaniladhariDivision']
            ]
        ]);
    } else {
        throw new Exception("Failed to register voter");
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