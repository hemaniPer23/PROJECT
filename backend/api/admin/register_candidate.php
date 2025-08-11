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

// Sri Lankan NIC validation function
function validateSriLankanNIC($nic) {
    // Remove spaces and convert to uppercase
    $cleanNIC = strtoupper(str_replace(' ', '', $nic));
    
    // Old format: 9 digits + V/X
    if (preg_match('/^(\d{9})[VX]$/', $cleanNIC)) {
        return ['isValid' => true, 'format' => 'old', 'cleanNIC' => $cleanNIC];
    }
    
    // New format: 12 digits
    if (preg_match('/^\d{12}$/', $cleanNIC)) {
        return ['isValid' => true, 'format' => 'new', 'cleanNIC' => $cleanNIC];
    }
    
    return ['isValid' => false, 'cleanNIC' => $cleanNIC];
}

// Extract gender from NIC - NEW FUNCTION
function extractGenderFromNIC($nic) {
    $validation = validateSriLankanNIC($nic);
    if (!$validation['isValid']) return null;
    
    try {
        if ($validation['format'] === 'old') {
            // Old format: YYDDDXXXV
            $days = intval(substr($validation['cleanNIC'], 2, 3));
        } else {
            // New format: YYYYDDDXXXXX
            $days = intval(substr($validation['cleanNIC'], 4, 3));
        }
        
        // If days > 500, it's female, otherwise male
        return $days > 500 ? 'Female' : 'Male';
    } catch (Exception $e) {
        error_log('Error extracting gender from NIC: ' . $e->getMessage());
        return null;
    }
}

// Fixed extract date of birth from NIC
function extractDOBFromNIC($nic) {
    $validation = validateSriLankanNIC($nic);
    if (!$validation['isValid']) return null;
    
    try {
        if ($validation['format'] === 'old') {
            // Old format: YYDDDXXXV
            $year = intval(substr($validation['cleanNIC'], 0, 2));
            $days = intval(substr($validation['cleanNIC'], 2, 3));
            
            // Determine century (assuming birth years 1900-2099)
            $fullYear = $year < 50 ? 2000 + $year : 1900 + $year;
            
            // Calculate actual days (subtract 500 if female - days > 500)
            $actualDays = $days > 500 ? $days - 500 : $days;
            
            // Create date from January 1st + (days - 1)
            $date = new DateTime();
            $date->setDate($fullYear, 1, 1);
            $date->add(new DateInterval('P' . ($actualDays - 1) . 'D'));
            
            return $date->format('Y-m-d');
        } else {
            // New format: YYYYDDDXXXXX
            $year = intval(substr($validation['cleanNIC'], 0, 4));
            $days = intval(substr($validation['cleanNIC'], 4, 3));
            
            // Calculate actual days (subtract 500 if female - days > 500)
            $actualDays = $days > 500 ? $days - 500 : $days;
            
            // Validate day range (1-366 for leap years)
            if ($actualDays < 1 || $actualDays > 366) {
                error_log('Invalid day of year in NIC: ' . $actualDays);
                return null;
            }
            
            // Check if it's a leap year
            $isLeapYear = ($year % 4 == 0 && $year % 100 != 0) || ($year % 400 == 0);
            $maxDays = $isLeapYear ? 366 : 365;
            
            if ($actualDays > $maxDays) {
                error_log('Day of year exceeds maximum for year: ' . $actualDays . ' > ' . $maxDays);
                return null;
            }
            
            // Create date from January 1st + (days - 1)
            $date = new DateTime();
            $date->setDate($year, 1, 1);
            $date->add(new DateInterval('P' . ($actualDays - 1) . 'D'));
            
            return $date->format('Y-m-d');
        }
    } catch (Exception $e) {
        error_log('Error extracting DOB from NIC: ' . $e->getMessage());
        return null;
    }
}

// Validate age for presidential candidate
function validateAge($dob) {
    $birthDate = new DateTime($dob);
    $currentDate = new DateTime();
    $age = $currentDate->diff($birthDate)->y;
    return $age >= 35;
}

// Function to ensure directory exists
function ensureDirectoryExists($path) {
    if (!file_exists($path)) {
        if (!mkdir($path, 0755, true)) {
            throw new Exception("Failed to create directory: $path");
        }
    }
}

// Function to validate date of birth matches NIC with strict tolerance
function validateDOBMatchesNIC($nic, $dob) {
    $nicDOB = extractDOBFromNIC($nic);
    if (!$nicDOB) {
        error_log('Could not extract DOB from NIC: ' . $nic);
        return false; // Changed to false - if we can't extract, consider it invalid
    }
    
    $nicDate = new DateTime($nicDOB);
    $formDate = new DateTime($dob);
    $daysDiff = abs($nicDate->diff($formDate)->days);
    
    // Strict validation - dates must match exactly
    if ($daysDiff > 0) {
        error_log('DOB mismatch: NIC suggests ' . $nicDOB . ' but form has ' . $dob . ' (difference: ' . $daysDiff . ' days)');
        return false;
    }
    
    return true;
}

// Function to validate gender matches NIC - NEW FUNCTION
function validateGenderMatchesNIC($nic, $gender) {
    $nicGender = extractGenderFromNIC($nic);
    if (!$nicGender) {
        error_log('Could not extract gender from NIC: ' . $nic);
        return false;
    }
    
    // Allow "Other" as a valid option even if NIC suggests Male/Female
    if ($gender === 'Other') {
        return true;
    }
    
    if ($nicGender !== $gender) {
        error_log('Gender mismatch: NIC suggests ' . $nicGender . ' but form has ' . $gender);
        return false;
    }
    
    return true;
}

try {
    // Add error logging
    error_log('Registration request received: ' . print_r($_POST, true));
    
    // Validate HTTP method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Only POST method is allowed");
    }

    // Validate required fields
    $required_fields = ['fullName', 'userNameSinhala', 'userNameEnglish', 'nic', 'dob', 'gender', 'electionId', 'partyId', 'candidateId'];
    
    foreach ($required_fields as $field) {
        if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
            throw new Exception("Missing required field: $field");
        }
    }

    // Validate and clean NIC
    $nic = trim($_POST['nic']);
    $nicValidation = validateSriLankanNIC($nic);
    if (!$nicValidation['isValid']) {
        throw new Exception("Invalid Sri Lankan NIC format. Please use format like 123456789V or 200012345678");
    }
    $cleanNIC = $nicValidation['cleanNIC'];

    // Validate Full Name (English letters, spaces, periods, apostrophes, hyphens)
    $fullName = trim($_POST['fullName']);
    if (!preg_match('/^[A-Za-z\s.\'-]+$/', $fullName)) {
        throw new Exception("Full name should contain only English letters, spaces, periods, hyphens, and apostrophes");
    }

    // Validate Sinhala User Name (Sinhala characters only) - improved validation
    $userNameSinhala = trim($_POST['userNameSinhala']);
    if (!preg_match('/^[\x{0D80}-\x{0DFF}\s]+$/u', $userNameSinhala)) {
        throw new Exception("Sinhala user name should contain only Sinhala characters and spaces");
    }

    // Validate English User Name (English letters, spaces, periods, apostrophes, hyphens)
    $userNameEnglish = trim($_POST['userNameEnglish']);
    if (!preg_match('/^[A-Za-z\s.\'-]+$/', $userNameEnglish)) {
        throw new Exception("English user name should contain only English letters, spaces, periods, hyphens, and apostrophes");
    }

    // Validate Date of Birth
    $dob = $_POST['dob'];
    $dobDate = DateTime::createFromFormat('Y-m-d', $dob);
    if (!$dobDate || $dobDate->format('Y-m-d') !== $dob) {
        throw new Exception("Invalid date of birth format. Please use YYYY-MM-DD format");
    }
    
    // Check if date is in the future
    if ($dobDate > new DateTime()) {
        throw new Exception("Date of birth cannot be in the future");
    }
    
    if (!validateAge($dob)) {
        throw new Exception("Candidate must be at least 35 years old for presidential election");
    }

    // Validate DOB matches NIC - strict validation
    if (!validateDOBMatchesNIC($cleanNIC, $dob)) {
        $nicDOB = extractDOBFromNIC($cleanNIC);
        throw new Exception("Date of birth must exactly match with NIC. NIC indicates: " . ($nicDOB ?: 'Unable to extract valid date'));
    }

    // Validate Gender - NEW VALIDATION
    $allowedGenders = ['Male', 'Female', 'Other'];
    if (!in_array($_POST['gender'], $allowedGenders)) {
        throw new Exception("Invalid gender value");
    }

    // Validate gender matches NIC (allow override for "Other")
    if (!validateGenderMatchesNIC($cleanNIC, $_POST['gender'])) {
        $nicGender = extractGenderFromNIC($cleanNIC);
        if ($_POST['gender'] !== 'Other') {
            throw new Exception("Gender must match with NIC. NIC indicates: " . ($nicGender ?: 'Unable to extract gender') . ". You can select 'Other' if needed.");
        }
    }

    // Validate Candidate ID format - more flexible
    $candidateId = trim($_POST['candidateId']);
    if (!preg_match('/^CANDIDATE\d{1,10}$/', $candidateId)) {
        throw new Exception("Candidate ID must be in format CANDIDATE followed by numbers (e.g., CANDIDATE1, CANDIDATE123456)");
    }

    // Check if candidate ID already exists
    $check_query = "SELECT Candidate_ID FROM candidate WHERE Candidate_ID = :candidate_id OR Candidate_NIC = :nic";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(':candidate_id', $candidateId);
    $check_stmt->bindParam(':nic', $cleanNIC);
    $check_stmt->execute();

    if ($check_stmt->rowCount() > 0) {
        throw new Exception("Candidate ID or NIC already exists in the system");
    }

    // Check if Election ID exists and is valid
    $election_check = "SELECT Election_ID, Election_Type, IsValid FROM election WHERE Election_ID = :election_id";
    $election_stmt = $db->prepare($election_check);
    $election_stmt->bindParam(':election_id', $_POST['electionId']);
    $election_stmt->execute();

    $election = $election_stmt->fetch(PDO::FETCH_ASSOC);
    if (!$election) {
        throw new Exception("Invalid Election ID");
    }

    if (!$election['IsValid']) {
        throw new Exception("Selected election is not active");
    }

    // Check if Party ID exists and get party details
    $party_check = "SELECT Party_ID, PartyName_English, PartyName_Sinhala, Party_Logo FROM party WHERE Party_ID = :party_id";
    $party_stmt = $db->prepare($party_check);
    $party_stmt->bindParam(':party_id', $_POST['partyId']);
    $party_stmt->execute();

    $party = $party_stmt->fetch(PDO::FETCH_ASSOC);
    if (!$party) {
        throw new Exception("Invalid Party ID");
    }

    // Handle candidate image upload (required)
    $image_path = null;
    
    if (!isset($_FILES['candidateImage']) || $_FILES['candidateImage']['error'] !== UPLOAD_ERR_OK) {
        if (!isset($_FILES['candidateImage'])) {
            throw new Exception("Candidate image is required");
        }
        
        $upload_errors = [
            UPLOAD_ERR_INI_SIZE => 'File size exceeds the maximum allowed size',
            UPLOAD_ERR_FORM_SIZE => 'File size exceeds the form maximum size',
            UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
            UPLOAD_ERR_NO_FILE => 'No file was uploaded',
            UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
            UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
            UPLOAD_ERR_EXTENSION => 'File upload stopped by extension'
        ];
        
        $error_message = isset($upload_errors[$_FILES['candidateImage']['error']]) 
            ? $upload_errors[$_FILES['candidateImage']['error']] 
            : 'Unknown upload error';
            
        throw new Exception("Image upload failed: " . $error_message);
    }

    // Validate file type using both MIME type and file extension
    $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    $allowed_extensions = ['jpg', 'jpeg', 'png', 'gif'];
    
    // Get file info safely
    $file_info = finfo_open(FILEINFO_MIME_TYPE);
    $file_type = finfo_file($file_info, $_FILES['candidateImage']['tmp_name']);
    finfo_close($file_info);
    
    $file_extension = strtolower(pathinfo($_FILES['candidateImage']['name'], PATHINFO_EXTENSION));
    
    if (!in_array($file_type, $allowed_types) || !in_array($file_extension, $allowed_extensions)) {
        throw new Exception("Invalid image type. Only JPEG, PNG, and GIF are allowed");
    }

    if ($_FILES['candidateImage']['size'] > 5000000) { // 5MB limit
        throw new Exception("Image file size too large. Maximum 5MB allowed");
    }

    // Create upload directory if it doesn't exist
    $upload_dir = '../../uploads/candidate_images/';
    ensureDirectoryExists($upload_dir);

    // Generate unique filename for candidate image
    $candidate_file_extension = pathinfo($_FILES['candidateImage']['name'], PATHINFO_EXTENSION);
    $new_filename = $candidateId . '_' . time() . '_' . uniqid() . '.' . $candidate_file_extension;
    $image_path = $upload_dir . $new_filename;

    if (!move_uploaded_file($_FILES['candidateImage']['tmp_name'], $image_path)) {
        throw new Exception("Failed to upload candidate image");
    }

    // Start transaction
    $db->beginTransaction();

    try {
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
            NULL,
            :party_id,
            :election_id
        )";

        $stmt = $db->prepare($query);
        
        // Bind parameters
        $stmt->bindParam(':candidate_id', $candidateId);
        $stmt->bindParam(':full_name', $fullName);
        $stmt->bindParam(':sinhala_username', $userNameSinhala);
        $stmt->bindParam(':english_username', $userNameEnglish);
        $stmt->bindParam(':nic', $cleanNIC);
        $stmt->bindParam(':gender', $_POST['gender']);
        $stmt->bindParam(':dob', $dob);
        $stmt->bindParam(':image', $image_path);
        $stmt->bindParam(':party_id', $_POST['partyId']);
        $stmt->bindParam(':election_id', $_POST['electionId']);

        if (!$stmt->execute()) {
            throw new Exception("Failed to register candidate in database");
        }

        // Commit transaction
        $db->commit();
        
        error_log('Candidate registered successfully: ' . $candidateId);
        
        http_response_code(201);
        echo json_encode([
            'status' => 'success',
            'message' => 'Candidate registered successfully for ' . $election['Election_Type'],
            'data' => [
                'candidate_id' => $candidateId,
                'full_name' => $fullName,
                'sinhala_username' => $userNameSinhala,
                'english_username' => $userNameEnglish,
                'party_name' => $party['PartyName_English'],
                'party_name_sinhala' => $party['PartyName_Sinhala'],
                'party_logo' => $party['Party_Logo'],
                'election_type' => $election['Election_Type'],
                'nic' => $cleanNIC,
                'extracted_dob' => extractDOBFromNIC($cleanNIC),
                'submitted_dob' => $dob,
                'extracted_gender' => extractGenderFromNIC($cleanNIC),
                'submitted_gender' => $_POST['gender'],
                'registration_time' => date('Y-m-d H:i:s'),
                'image_path' => $image_path
            ]
        ]);

    } catch (Exception $e) {
        // Rollback transaction
        $db->rollback();
        throw $e;
    }

} catch (Exception $e) {
    // Rollback transaction if it was started
    if ($db && $db->inTransaction()) {
        $db->rollback();
    }
    
    // Clean up uploaded files if database insertion fails
    if (isset($image_path) && file_exists($image_path)) {
        unlink($image_path);
    }

    error_log('Registration error: ' . $e->getMessage());

    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage(),
        'error_code' => 'REGISTRATION_FAILED'
    ]);

} catch (PDOException $e) {
    // Handle database connection errors
    if ($db && $db->inTransaction()) {
        $db->rollback();
    }
    
    if (isset($image_path) && file_exists($image_path)) {
        unlink($image_path);
    }

    error_log('Database error: ' . $e->getMessage());

    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed. Please try again later.',
        'error_code' => 'DATABASE_ERROR'
    ]);
}
?>