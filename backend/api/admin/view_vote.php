<?php
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once '../../config/Database.php';
  include_once '../../models/Voter.php';

  // Instantiate DB & connect
  $database = new Database();
  $db = $database->connect();

  // Instantiate voter object
  $voter = new Voter($db);

  // Get voter stats
  $result = $voter->getVoterStatsByElectoralDivision();

  // Get row count
  $num = $result->rowCount();

  // Check if any stats
  if($num > 0) {
    // Stats array
    $stats_arr = array();
    $stats_arr['data'] = array();

    while($row = $result->fetch(PDO::FETCH_ASSOC)) {
      extract($row);

      $stat_item = array(
        'Electoral_Division' => $Electoral_Division,
        'voted' => $voted,
        'non_voted' => $non_voted,
        'voted_percentage' => ($voted > 0) ? ($voted / ($voted + $non_voted)) * 100 : 0,
      );

      // Push to "data"
      array_push($stats_arr['data'], $stat_item);
    }

    // Turn to JSON & output
    echo json_encode($stats_arr);

  } else {
    // No Stats
    echo json_encode(
      array('message' => 'No Stats Found')
    );
  }