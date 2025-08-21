<?php
// Headers and CORS
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../../config/Database.php';
include_once '../../models/Candidate.php';

$database = new Database();
$db = $database->connect();
$candidate = new Candidate($db);

$result = $candidate->getAllActive();

if($result) {
    $num = $result->rowCount();
    if($num > 0) {
        $candidates_arr = [];
        $candidates_arr['data'] = [];

        // Base path of your project on the server
        $server_base_path = 'C:\\wamp64\\www\\PROJECT\\backend\\';
        // The corresponding base URL for your project
        $web_base_url = 'http://localhost/PROJECT/backend/';

        while($row = $result->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            // Convert local file path to a web-accessible URL
            $photo_url = str_replace('\\', '/', str_replace($server_base_path, $web_base_url, $photo));
            $icon_url = str_replace('\\', '/', str_replace($server_base_path, $web_base_url, $icon));

            $candidate_item = [
                'id' => $Candidate_ID,
                'name' => $Candidate_FullName,
                'photo' => $photo_url,  // Use 'photo' key for candidate image
                'icon' => $icon_url    // Use 'icon' key for party logo
              ];
            array_push($candidates_arr['data'], $candidate_item);
        }
        echo json_encode($candidates_arr);
    } else {
        http_response_code(404);
        echo json_encode(['message' => 'No candidates found for the active election.']);
    }
} else {
    http_response_code(404);
    echo json_encode(['message' => 'No active election found.']);
}
?>