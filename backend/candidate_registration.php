<?php
// candidate_registration.php
session_start();
include 'db.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Check if admin is logged in
if (!isset($_SESSION['admin_logged_in'])) {  // Fixed: Added missing closing parenthesis
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized access']);
    exit;
}

// Handle file uploads
function handleFileUpload($fileKey, $uploadDir) {
    if (!isset($_FILES[$fileKey])) {  // Fixed: Added missing closing parenthesis
        return ['status' => 'error', 'message' => 'No file uploaded'];
    }

    $file = $_FILES[$fileKey];
    $fileName = uniqid() . '_' . basename($file['name']);
    $targetPath = $uploadDir . $fileName;

    // Create upload directory if it doesn't exist
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        return ['status' => 'success', 'filePath' => $targetPath];
    } else {
        return ['status' => 'error', 'message' => 'File upload failed'];
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Handle image uploads
    $imageResult = handleFileUpload('candidateImage', 'uploads/candidate_images/');
    $symbolResult = handleFileUpload('candidateSymbol', 'uploads/candidate_symbols/');

    if ($imageResult['status'] === 'error' || $symbolResult['status'] === 'error') {
        echo json_encode(['status' => 'error', 'message' => 'File upload failed']);
        exit;
    }

    // Get form data
    $data = [
        'sinhalaName' => $_POST['sinhalaName'],
        'fullName' => $_POST['fullName'],
        'sinhalaUserName' => $_POST['sinhalaUserName'],
        'userName' => $_POST['userName'],
        'id' => $_POST['id'],
        'dob' => $_POST['dob'],
        'gender' => $_POST['gender'],
        'address' => $_POST['address'],
        'electionId' => $_POST['electionId'],
        'partyId' => $_POST['partyId'],
        'candidateId' => $_POST['candidateId'],
        'candidateNumber' => $_POST['candidateNumber'],
        'imagePath' => $imageResult['filePath'],
        'symbolPath' => $symbolResult['filePath']
    ];

    // Insert into database
    $stmt = $conn->prepare("INSERT INTO candidates (
        sinhala_name, full_name, sinhala_username, username, id_number, dob, gender, address,
        election_id, party_id, candidate_id, candidate_number, image_path, symbol_path
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $stmt->bind_param(
        "ssssssssssssss",
        $data['sinhalaName'],
        $data['fullName'],
        $data['sinhalaUserName'],
        $data['userName'],
        $data['id'],
        $data['dob'],
        $data['gender'],
        $data['address'],
        $data['electionId'],
        $data['partyId'],
        $data['candidateId'],
        $data['candidateNumber'],
        $data['imagePath'],
        $data['symbolPath']
    );

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Candidate registered successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
    }

    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}

$conn->close();
?>