<?php
// Check ACF Field Groups Script
require_once('wordpress/wp-config.php');

// Connect to database
$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

if ($mysqli->connect_error) {
    die('Connection failed: ' . $mysqli->connect_error);
}

echo "Connected to database: " . DB_NAME . "\n";

// Check if ACF field groups exist
$query = "SELECT option_name, option_value FROM wp_options WHERE option_name LIKE 'acf-field-group%'";
$result = $mysqli->query($query);

if ($result && $result->num_rows > 0) {
    echo "Existing ACF field groups found:\n";
    while ($row = $result->fetch_assoc()) {
        echo "- " . $row['option_name'] . "\n";
    }
} else {
    echo "No ACF field groups found in database.\n";
}

// Check if ACF fields exist for products and plans
$query = "SELECT post_id, meta_key, meta_value FROM wp_postmeta WHERE meta_key LIKE 'acf_%' LIMIT 10";
$result = $mysqli->query($query);

if ($result && $result->num_rows > 0) {
    echo "\nExisting ACF fields found:\n";
    while ($row = $result->fetch_assoc()) {
        echo "- Post ID: " . $row['post_id'] . ", Meta Key: " . $row['meta_key'] . "\n";
    }
} else {
    echo "\nNo ACF fields found in database.\n";
}

$mysqli->close();
?>