<?php
// Check Active Plugins Script
require_once('wordpress/wp-config.php');

// Connect to database
$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

if ($mysqli->connect_error) {
    die('Connection failed: ' . $mysqli->connect_error);
}

echo "Connected to database: " . DB_NAME . "\n";

// Get current active plugins
$query = "SELECT option_value FROM wp_options WHERE option_name = 'active_plugins'";
$result = $mysqli->query($query);

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $active_plugins = unserialize($row['option_value']);
    
    echo "Active plugins:\n";
    foreach ($active_plugins as $plugin) {
        echo "- " . $plugin . "\n";
    }
} else {
    echo "Could not retrieve active plugins.\n";
}

$mysqli->close();
?>