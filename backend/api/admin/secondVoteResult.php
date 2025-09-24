<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../../config/Database.php';

// Create database connection
$database = new Database();
$db = $database->connect();

try {
    // 1️⃣ Get the same results as overallResults.php
    $query = "
    SELECT  
        c.Candidate_ID AS candidate_id,
        c.Candidate_UserName_Sinhala AS candidate_name,  
        c.Image AS candidate_image,
        p.Party_ID,
        p.PartyName_Sinhala AS party_name,
        p.Party_logo AS party_logo,
        p.Party_Colour AS party_colour,
        COUNT(v.Ballot_ID) AS vote_count
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
    $candidates = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($candidates) === 0) {
        echo json_encode([
            'status' => 'success',
            'message' => 'No first-preference votes found',
            'need_second_vote' => false
        ]);
        exit;
    }

    // Calculate total votes & check 50% threshold
    $totalVotes = array_sum(array_column($candidates, 'vote_count'));
    $topCandidate = $candidates[0];
    $needSecondVote = ($topCandidate['vote_count'] <= ($totalVotes / 2));

    $secondVoteResult = null;

    // 2️⃣ If top candidate fails to surpass 50%, calculate second votes of top two
    if ($needSecondVote && count($candidates) >= 2) {
        $topTwoIds = [$candidates[0]['candidate_id'], $candidates[1]['candidate_id']];
        $query2 = "
        SELECT 
            v.Candidate_ID AS candidate_id,
            COUNT(v.Ballot_ID) AS second_vote_count
        FROM vote v
        WHERE v.Election_ID = 'election1'
          AND v.Preference = '2'
          AND v.Candidate_ID IN (?, ?)
        GROUP BY v.Candidate_ID
        ";

        $stmt2 = $db->prepare($query2);
        $stmt2->execute($topTwoIds);
        $secondVotes = $stmt2->fetchAll(PDO::FETCH_KEY_PAIR); // [candidate_id => second_vote_count]

        $secondVoteResult = [
            'top_two' => [
                [
                    'candidate_id' => $candidates[0]['candidate_id'],
                    'candidate_name' => $candidates[0]['candidate_name'],
                    'second_vote_count' => (int)($secondVotes[$candidates[0]['candidate_id']] ?? 0)
                ],
                [
                    'candidate_id' => $candidates[1]['candidate_id'],
                    'candidate_name' => $candidates[1]['candidate_name'],
                    'second_vote_count' => (int)($secondVotes[$candidates[1]['candidate_id']] ?? 0)
                ]
            ],
            'second_vote_total' =>
                array_sum($secondVotes)
        ];
    }

    echo json_encode([
        'status' => 'success',
        'need_second_vote' => $needSecondVote,
        'total_votes' => (int)$totalVotes,
        'top_candidate' => [
            'candidate_id' => $topCandidate['candidate_id'],
            'candidate_name' => $topCandidate['candidate_name'],
            'vote_count' => (int)$topCandidate['vote_count']
        ],
        'second_vote_result' => $secondVoteResult
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to calculate second vote results: ' . $e->getMessage()
    ]);
}