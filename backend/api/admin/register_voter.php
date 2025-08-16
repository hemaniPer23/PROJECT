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

// Extract gender from NIC
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

// Extract date of birth from NIC
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
            
            // Validate day range
            if ($actualDays < 1 || $actualDays > 366) {
                error_log('Invalid day of year in NIC: ' . $actualDays);
                return null;
            }
            
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

// Validate age for voter (minimum 18 years)
function validateAge($dob) {
    $birthDate = new DateTime($dob);
    $currentDate = new DateTime();
    $age = $currentDate->diff($birthDate)->y;
    return $age >= 18;
}

// Validate DOB matches NIC with strict tolerance
function validateDOBMatchesNIC($nic, $dob) {
    $nicDOB = extractDOBFromNIC($nic);
    if (!$nicDOB) {
        error_log('Could not extract DOB from NIC: ' . $nic);
        return false;
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

// Validate gender matches NIC
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

// Get division ID from hierarchical division names
function getDivisionID($db, $electoral, $polling, $gramaniladhari) {
    try {
        $query = "SELECT Division_ID FROM divisions 
                  WHERE Electoral_Division = :electoral 
                  AND Polling_Division = :polling 
                  AND Gramaniladhari_Division = :gramaniladhari 
                  AND IsActive = 1 
                  LIMIT 1";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':electoral', $electoral);
        $stmt->bindParam(':polling', $polling);
        $stmt->bindParam(':gramaniladhari', $gramaniladhari);
        $stmt->execute();
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ? $result['Division_ID'] : null;
    } catch (Exception $e) {
        error_log('Error getting division ID: ' . $e->getMessage());
        return null;
    }
}

// Check for duplicate NIC, Mobile, or Email
function checkDuplicates($db, $nic, $mobile, $email) {
    try {
        $duplicates = [];
        
        // Check NIC (always required)
        $nicQuery = "SELECT NIC FROM voter WHERE NIC = :nic LIMIT 1";
        $nicStmt = $db->prepare($nicQuery);
        $nicStmt->bindParam(':nic', $nic);
        $nicStmt->execute();
        
        if ($nicStmt->rowCount() > 0) {
            $duplicates['nic'] = 'A voter with this NIC is already registered';
        }
        
        // Check Mobile (only if provided)
        if (!empty($mobile)) {
            $mobileQuery = "SELECT NIC FROM voter WHERE Mobile_Number = :mobile LIMIT 1";
            $mobileStmt = $db->prepare($mobileQuery);
            $mobileStmt->bindParam(':mobile', $mobile);
            $mobileStmt->execute();
            
            if ($mobileStmt->rowCount() > 0) {
                $duplicates['mobile'] = 'This mobile number is already registered with another voter';
            }
        }
        
        // Check Email (only if provided)
        if (!empty($email)) {
            $emailQuery = "SELECT NIC FROM voter WHERE Email = :email LIMIT 1";
            $emailStmt = $db->prepare($emailQuery);
            $emailStmt->bindParam(':email', $email);
            $emailStmt->execute();
            
            if ($emailStmt->rowCount() > 0) {
                $duplicates['email'] = 'This email address is already registered with another voter';
            }
        }
        
        return $duplicates;
    } catch (Exception $e) {
        error_log('Error checking duplicates: ' . $e->getMessage());
        throw new Exception('Error validating voter data');
    }
}

try {
    // Add error logging
    error_log('Voter registration request received: ' . print_r($_POST, true));
    
    // Validate HTTP method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Only POST method is allowed");
    }

    // Get JSON data if sent as JSON
    $input = json_decode(file_get_contents('php://input'), true);
    $data = $input ?? $_POST;

    // Validate required fields
    $required_fields = ['sinhalaFullName', 'englishFullName', 'nic', 'gender', 'dob', 'address', 'electoralDivision', 'pollingDivision', 'gramaniladhariDivision'];
    
    foreach ($required_fields as $field) {
        if (!isset($data[$field]) || (is_string($data[$field]) && empty(trim($data[$field])))) {
            throw new Exception("Missing required field: $field");
        }
    }

    // Validate and clean NIC
    $nic = trim($data['nic']);
    $nicValidation = validateSriLankanNIC($nic);
    if (!$nicValidation['isValid']) {
        throw new Exception("Invalid Sri Lankan NIC format. Please use format like 123456789V or 200012345678");
    }
    $cleanNIC = $nicValidation['cleanNIC'];

    // Validate Sinhala Full Name (Sinhala characters and spaces only)
    $sinhalaFullName = trim($data['sinhalaFullName']);
    if (!preg_match('/^[\x{0D80}-\x{0DFF}\s]+$/u', $sinhalaFullName)) {
        throw new Exception("Sinhala full name should contain only Sinhala characters and spaces");
    }
    if (strlen($sinhalaFullName) < 2) {
        throw new Exception("Sinhala full name must be at least 2 characters long");
    }

    // Validate English Full Name
    $englishFullName = trim($data['englishFullName']);
    if (!preg_match('/^[A-Za-z\s.\'-]+$/', $englishFullName)) {
        throw new Exception("English full name should contain only English letters, spaces, periods, hyphens, and apostrophes");
    }
    if (strlen($englishFullName) < 2) {
        throw new Exception("English full name must be at least 2 characters long");
    }

    // Validate Date of Birth
    $dob = $data['dob'];
    $dobDate = DateTime::createFromFormat('Y-m-d', $dob);
    if (!$dobDate || $dobDate->format('Y-m-d') !== $dob) {
        throw new Exception("Invalid date of birth format. Please use YYYY-MM-DD format");
    }
    
    // Check if date is in the future
    if ($dobDate > new DateTime()) {
        throw new Exception("Date of birth cannot be in the future");
    }
    
    // Validate minimum age (18 years)
    if (!validateAge($dob)) {
        throw new Exception("Voter must be at least 18 years old");
    }

    // Validate DOB matches NIC - strict validation
    if (!validateDOBMatchesNIC($cleanNIC, $dob)) {
        $nicDOB = extractDOBFromNIC($cleanNIC);
        throw new Exception("Date of birth must exactly match with NIC. NIC indicates: " . ($nicDOB ?: 'Unable to extract valid date'));
    }

    // Validate Gender
    $allowedGenders = ['Male', 'Female', 'Other'];
    if (!in_array($data['gender'], $allowedGenders)) {
        throw new Exception("Invalid gender value");
    }

    // Validate gender matches NIC (allow override for "Other")
    if (!validateGenderMatchesNIC($cleanNIC, $data['gender'])) {
        $nicGender = extractGenderFromNIC($cleanNIC);
        if ($data['gender'] !== 'Other') {
            throw new Exception("Gender must match with NIC. NIC indicates: " . ($nicGender ?: 'Unable to extract gender') . ". You can select 'Other' if needed.");
        }
    }

    // Validate Address
    $address = trim($data['address']);
    if (strlen($address) < 10) {
        throw new Exception("Please provide a complete address (minimum 10 characters)");
    }

    // Validate Mobile Number (optional but validate if provided)
    $mobileNumber = isset($data['mobileNumber']) ? trim($data['mobileNumber']) : '';
    if (!empty($mobileNumber) && !preg_match('/^07\d{8}$/', $mobileNumber)) {
        throw new Exception("Invalid mobile number format (should be 07xxxxxxxx)");
    }

    // Validate Email (optional but validate if provided)
    $email = isset($data['email']) ? trim($data['email']) : '';
    if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Invalid email format");
    }

    // Get Division ID from hierarchical divisions
    $divisionID = getDivisionID($db, $data['electoralDivision'], $data['pollingDivision'], $data['gramaniladhariDivision']);
    if (!$divisionID) {
        throw new Exception("Invalid division combination. Please check your division selections.");
    }

    // Check for duplicates (NIC, Mobile, Email)
    $duplicates = checkDuplicates($db, $cleanNIC, $mobileNumber, $email);
    if (!empty($duplicates)) {
        // Return first duplicate error found
        $firstError = reset($duplicates);
        throw new Exception($firstError);
    }

    // Start transaction
    $db->beginTransaction();

    try {
        // Insert voter data
        $query = "INSERT INTO voter (
            NIC,
            FullName_Sinhala,
            FullName_English,
            Gender,
            DOB,
            Address,
            Mobile_Number,
            Email,
            Division_ID,
            STATUS
        ) VALUES (
            :nic,
            :sinhala_fullname,
            :english_fullname,
            :gender,
            :dob,
            :address,
            :mobile_number,
            :email,
            :division_id,
            'Pending'
        )";

        $stmt = $db->prepare($query);
        
        // Bind parameters
        $stmt->bindParam(':nic', $cleanNIC);
        $stmt->bindParam(':sinhala_fullname', $sinhalaFullName);
        $stmt->bindParam(':english_fullname', $englishFullName);
        $stmt->bindParam(':gender', $data['gender']);
        $stmt->bindParam(':dob', $dob);
        $stmt->bindParam(':address', $address);
        
        // Handle optional fields - use null for empty values to avoid duplicates
        $mobileParam = !empty($mobileNumber) ? $mobileNumber : null;
        $emailParam = !empty($email) ? $email : null;
        $stmt->bindParam(':mobile_number', $mobileParam);
        $stmt->bindParam(':email', $emailParam);
        
        $stmt->bindParam(':division_id', $divisionID);

        if (!$stmt->execute()) {
            throw new Exception("Failed to register voter in database");
        }

        // Commit transaction
        $db->commit();
        
        error_log('Voter registered successfully: ' . $cleanNIC);
        
        http_response_code(201);
        echo json_encode([
            'status' => 'success',
            'message' => 'Voter registered successfully',
            'data' => [
                'nic' => $cleanNIC,
                'fullname_sinhala' => $sinhalaFullName,
                'fullname_english' => $englishFullName,
                'gender' => $data['gender'],
                'dob' => $dob,
                'address' => $address,
                'mobile_number' => $mobileParam,
                'email' => $emailParam,
                'electoral_division' => $data['electoralDivision'],
                'polling_division' => $data['pollingDivision'],
                'gramaniladhari_division' => $data['gramaniladhariDivision'],
                'division_id' => $divisionID,
                'extracted_dob' => extractDOBFromNIC($cleanNIC),
                'extracted_gender' => extractGenderFromNIC($cleanNIC),
                'status' => 'Pending',
                'registration_time' => date('Y-m-d H:i:s')
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

    error_log('Voter registration error: ' . $e->getMessage());

    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage(),
        'error_code' => 'VOTER_REGISTRATION_FAILED'
    ]);

} catch (PDOException $e) {
    // Handle database connection errors
    if ($db && $db->inTransaction()) {
        $db->rollback();
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