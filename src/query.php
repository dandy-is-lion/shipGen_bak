<?php
$query = $_GET['query'];

// Connect to the database
$mysqli = new mysqli('localhost', 'redout', 'redout', 'ship_modules');

// Prepare the statement
$stmt = $mysqli->prepare($query);

// Execute the statement
$stmt->execute();

// Fetch the results
$result = $stmt->get_result();

// Convert the results to an array
$data = array();
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

// Get the column names
$columns = array_keys($data[0]);
foreach ($columns as $key => $val) {
    $columns[ltrim($key, '_')] = $val;
}

// Return the results as JSON
$response = array('columns' => $columns, 'data' => $data);
header('Content-Type: application/json');
echo json_encode($response);
?>