<?php
/*
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); 

$servername = "localhost";
$username = "root"; // change if needed
$password = ""; // change if needed
$dbname = "electiondb"; // change to your DB

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Read request params
$district = isset($_GET['district']) ? $_GET['district'] : '';
$division = isset($_GET['division']) ? $_GET['division'] : '';

if (empty($district)) {
    echo json_encode(["error" => "District required"]);
    exit;
}

// Case 1: User selected a polling division
if (!empty($division) && strtolower($division) !== strtolower($district)) {
    $sql = "SELECT 
    d.Polling_Division,
    c.Candidate_UserName_Sinhala, 
    c.Party_Id, 
    c.Image, 
    COUNT(v.Candidate_ID) AS total_votes,
    ROUND(
        COUNT(v.Candidate_ID) * 100.0 / 
        SUM(COUNT(v.Candidate_ID)) OVER (PARTITION BY d.Polling_Division), 
        2
    ) AS vote_percentage
FROM vote v
JOIN candidate c ON v.Candidate_ID = c.Candidate_ID
JOIN divisions d ON v.Division_ID = d.Division_ID
WHERE d.Polling_Division = 'Minuwangoda'
  AND v.STATUS = 'Voted'
  AND v.preference = 1
GROUP BY d.Polling_Division, c.Candidate_ID
ORDER BY total_votes DESC";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $district, $division);

// Case 2: User selected district
} else {
    $sql = "SELECT 
    c.Candidate_UserName_Sinhala, 
    c.Party_Id, 
    c.Image, 
    COUNT(v.Candidate_ID) AS total_votes,
    ROUND(
        COUNT(v.Candidate_ID) * 100.0 / 
        (SELECT COUNT(*) 
         FROM vote v2
         WHERE v2.Division_ID IN (
                 SELECT Division_ID 
                 FROM divisions 
                 WHERE Electoral_Division = ?
               )
           AND v2.STATUS = 'Voted'
           AND v2.preference = 1
        ), 2
    ) AS vote_percentage
FROM vote v
JOIN candidate c ON v.Candidate_ID = c.Candidate_ID
WHERE v.Division_ID IN (
        SELECT Division_ID 
        FROM divisions 
        WHERE Electoral_Division = 'GAMPAHA'
      )
  AND v.STATUS = 'Voted'
  AND v.preference = 1
GROUP BY c.Candidate_ID
ORDER BY total_votes DESC;"
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $district);
}

$stmt->execute();
$result = $stmt->get_result();

$data = [];
$totalVotes = 0;

while ($row = $result->fetch_assoc()) {
    $totalVotes += $row['total_votes'];
    $data[] = $row;
}

// calculate percentages
foreach ($data as &$candidate) {
    $candidate['percentage'] = $totalVotes > 0 ? round(($candidate['total_votes'] / $totalVotes) * 100, 2) . "%" : "0%";
    $candidate['Candidate_image'] = "http://localhost/PROJECT/backend/uploads/candidate_images/" . $candidate['Image'];
   
}

echo json_encode($data);
*/

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

$database = new Database();
$db = $database->connect(); // This is PDO

$electoralDivision = $_GET['electoralDivision'] ?? '';
$pollingDivision   = $_GET['pollingDivision'] ?? '';

if (!$electoralDivision || !$pollingDivision) {
    http_response_code(400);
    echo json_encode(["error" => "Missing parameters"]);
    exit();
}

$sql = "
     SELECT c.Candidate_UserName_Sinhala, 
           c.Party_Id, 
           c.Image,
           COUNT(v.Candidate_ID) AS total_votes
    FROM candidate c
    JOIN vote v ON c.Candidate_Id = v.Candidate_ID
    JOIN divisions d ON v.Division_ID = d.Division_ID
    WHERE d.Electoral_Division = :electoralDivision
      AND d.Polling_Division = :pollingDivision
      AND d.IsActive = 1
      AND v.Preference = 1
    GROUP BY c.Candidate_UserName_Sinhala, c.Party_Id, c.Image
    ORDER BY total_votes DESC
";

$stmt = $db->prepare($sql);

// Bind parameters (PDO syntax)
$stmt->bindValue(':electoralDivision', $electoralDivision);
$stmt->bindValue(':pollingDivision', $pollingDivision);

$stmt->execute();

$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($data);
?>