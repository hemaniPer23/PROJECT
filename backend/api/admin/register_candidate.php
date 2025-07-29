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
    // Validate required fields
    $required_fields = ['sinhalaName', 'fullName', 'sinhalaUserName', 'userName', 'id', 'dob', 'gender', 'address', 'electionId', 'partyId', 'candidateId', 'candidateNumber'];
    
    foreach ($required_fields as $field) {
        if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
            throw new Exception("Missing required field: $field");
        }
    }

    // Validate NIC format (Sri Lankan NIC)
    $nic = trim($_POST['id']);
    if (!preg_match('/^(\d{9}[vVxX]|\d{12})$/', $nic)) {
        throw new Exception("Invalid NIC format");
    }

    // Validate candidate number is numeric
    if (!is_numeric($_POST['candidateNumber'])) {
        throw new Exception("Candidate number must be numeric");
    }

    // Check if candidate ID already exists
    $check_query = "SELECT Candidate_ID FROM candidate WHERE Candidate_ID = :candidate_id OR Candidate_NIC = :nic";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(':candidate_id', $_POST['candidateId']);
    $check_stmt->bindParam(':nic', $nic);
    $check_stmt->execute();

    if ($check_stmt->rowCount() > 0) {
        throw new Exception("Candidate ID or NIC already exists");
    }

    // Check if candidate number already exists for this election
    $number_check = "SELECT Candidate_Number FROM candidate WHERE Candidate_Number = :candidate_number AND Election_ID = :election_id";
    $number_stmt = $db->prepare($number_check);
    $number_stmt->bindParam(':candidate_number', $_POST['candidateNumber']);
    $number_stmt->bindParam(':election_id', $_POST['electionId']);
    $number_stmt->execute();

    if ($number_stmt->rowCount() > 0) {
        throw new Exception("Candidate number already exists for this election");
    }

    // Check if Election ID exists
    $election_check = "SELECT Election_ID FROM election WHERE Election_ID = :election_id";
    $election_stmt = $db->prepare($election_check);
    $election_stmt->bindParam(':election_id', $_POST['electionId']);
    $election_stmt->execute();

    if ($election_stmt->rowCount() == 0) {
        throw new Exception("Invalid Election ID");
    }

    // Check if Party ID exists
    $party_check = "SELECT Party_ID FROM party WHERE Party_ID = :party_id";
    $party_stmt = $db->prepare($party_check);
    $party_stmt->bindParam(':party_id', $_POST['partyId']);
    $party_stmt->execute();

    if ($party_stmt->rowCount() == 0) {
        throw new Exception("Invalid Party ID");
    }

    // Handle file uploads
    $image_path = null;
    
    // Handle candidate image upload
    if (isset($_FILES['candidateImage']) && $_FILES['candidateImage']['error'] == 0) {
        $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        $file_info = finfo_open(FILEINFO_MIME_TYPE);
        $file_type = finfo_file($file_info, $_FILES['candidateImage']['tmp_name']);
        finfo_close($file_info);
        
        if (!in_array($file_type, $allowed_types)) {
            throw new Exception("Invalid image type. Only JPEG, PNG, and GIF are allowed.");
        }

        if ($_FILES['candidateImage']['size'] > 5000000) { // 5MB limit
            throw new Exception("Image file size too large. Maximum 5MB allowed.");
        }

        $upload_dir = '../../uploads/candidate_images/';
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        $file_extension = pathinfo($_FILES['candidateImage']['name'], PATHINFO_EXTENSION);
        $new_filename = $_POST['candidateId'] . '_image_' . time() . '.' . $file_extension;
        $image_path = $upload_dir . $new_filename;

        if (!move_uploaded_file($_FILES['candidateImage']['tmp_name'], $image_path)) {
            throw new Exception("Failed to upload candidate image");
        }
    }

    // Start transaction
    $db->beginTransaction();

    // Insert candidate data
    $query = "INSERT INTO candidate (
        Candidate_ID,
        Candidate_FullName,
        Candidate_UserName_Sinhala,
        Candidate_UserName_English,
        Candidate_NIC,
        Candidate_Gender,
        Candidate_DOB,
        Image,
        Candidate_Number,
        Party_ID,
        Election_ID
    ) VALUES (
        :candidate_id,
        :full_name,
        :sinhala_username,
        :english_username,
        :nic,
        :gender,
        :dob,
        :image,
        :candidate_number,
        :party_id,
        :election_id
    )";

    $stmt = $db->prepare($query);
    
    // Bind parameters
    $stmt->bindParam(':candidate_id', $_POST['candidateId']);
    $stmt->bindParam(':full_name', $_POST['fullName']);
    $stmt->bindParam(':sinhala_username', $_POST['sinhalaUserName']);
    $stmt->bindParam(':english_username', $_POST['userName']);
    $stmt->bindParam(':nic', $nic);
    $stmt->bindParam(':gender', $_POST['gender']);
    $stmt->bindParam(':dob', $_POST['dob']);
    $stmt->bindParam(':image', $image_path);
    $stmt->bindParam(':candidate_number', $_POST['candidateNumber']);
    $stmt->bindParam(':party_id', $_POST['partyId']);
    $stmt->bindParam(':election_id', $_POST['electionId']);

    if ($stmt->execute()) {
        // Commit transaction
        $db->commit();
        
        http_response_code(201);
        echo json_encode([
            'status' => 'success',
            'message' => 'Candidate registered successfully',
            'candidate_id' => $_POST['candidateId'],
            'data' => [
                'candidate_id' => $_POST['candidateId'],
                'full_name' => $_POST['fullName'],
                'candidate_number' => $_POST['candidateNumber'],
                'party_id' => $_POST['partyId'],
                'election_id' => $_POST['electionId']
            ]
        ]);
    } else {
        throw new Exception("Failed to register candidate");
    }

} catch (Exception $e) {
    // Rollback transaction if it was started
    if ($db->inTransaction()) {
        $db->rollback();
    }
    
    // Clean up uploaded files if database insertion fails
    if (isset($image_path) && file_exists($image_path)) {
        unlink($image_path);
    }

    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>