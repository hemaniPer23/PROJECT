<?php
// Handle preflight OPTIONS request (CORS)
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
    $query = "
    SELECT  
        c.Candidate_ID AS candidate_id,
        c.Candidate_UserName_Sinhala AS candidate_name,  
        c.Image AS candidate_image,
        p.Party_ID,
        p.PartyName_Sinhala AS party_name,
        p.Party_logo AS party_logo,
        p.Party_Colour AS party_colour,
        COUNT(v.Ballot_ID) AS vote_count,  
        ROUND(
            100.0 * COUNT(v.Ballot_ID) / SUM(COUNT(v.Ballot_ID)) OVER (), 
            2
        ) AS percentage  
    FROM vote v  
    JOIN candidate c ON v.Candidate_ID = c.Candidate_ID  
    LEFT JOIN party p ON c.Party_ID = p.Party_ID
    JOIN divisions d ON v.Division_ID = d.Division_ID
    WHERE v.Election_ID = 'election1'  
      AND v.Preference = '1'
    GROUP BY c.Candidate_ID, c.Candidate_UserName_Sinhala, c.Image, p.Party_ID, p.PartyName_Sinhala, p.Party_logo, p.Party_Colour  
    ORDER BY vote_count DESC
    ";

    $stmt = $db->prepare($query);
    $stmt->execute();

    $results = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $results[] = [
            'Candidate_Id' => $row['candidate_id'],
            'Candidate_name' => $row['candidate_name'],
            'Vote_count' => (int)$row['vote_count'],
            'Percentage' => (float)$row['percentage'],
            // Fix candidate image path
            'Candidate_image' => $row['candidate_image'],
            // Fix party logo path
            'Party_logo' => $row['party_logo'],
            'Party_Id' => $row['Party_ID'],
            'Party_name' => $row['party_name'],
            'Party_Colour' => $row['party_colour']
        ];
    }

    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Overall results retrieved successfully',
        'data' => $results,
        'count' => count($results)
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to retrieve results: ' . $e->getMessage()
    ]);
}