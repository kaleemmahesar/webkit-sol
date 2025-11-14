<?php
// Reactivate ACF Field Groups Plugin
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
    
    // Remove our plugin from the active plugins list
    $plugin_name = 'acf-field-groups/acf-field-groups.php';
    $key = array_search($plugin_name, $active_plugins);
    
    if ($key !== false) {
        unset($active_plugins[$key]);
        $serialized_plugins = serialize(array_values($active_plugins));
        
        // Update the active plugins option
        $update_query = "UPDATE wp_options SET option_value = ? WHERE option_name = 'active_plugins'";
        $stmt = $mysqli->prepare($update_query);
        $stmt->bind_param('s', $serialized_plugins);
        
        if ($stmt->execute()) {
            echo "Plugin deactivated successfully.\n";
        } else {
            echo "Error deactivating plugin: " . $stmt->error . "\n";
        }
        
        $stmt->close();
        
        // Now reactivate the plugin
        $active_plugins[] = $plugin_name;
        $serialized_plugins = serialize($active_plugins);
        
        // Update the active plugins option
        $update_query = "UPDATE wp_options SET option_value = ? WHERE option_name = 'active_plugins'";
        $stmt = $mysqli->prepare($update_query);
        $stmt->bind_param('s', $serialized_plugins);
        
        if ($stmt->execute()) {
            echo "Plugin reactivated successfully.\n";
        } else {
            echo "Error reactivating plugin: " . $stmt->error . "\n";
        }
        
        $stmt->close();
    } else {
        echo "Plugin was not active.\n";
        
        // Activate the plugin
        $active_plugins[] = $plugin_name;
        $serialized_plugins = serialize($active_plugins);
        
        // Update the active plugins option
        $update_query = "UPDATE wp_options SET option_value = ? WHERE option_name = 'active_plugins'";
        $stmt = $mysqli->prepare($update_query);
        $stmt->bind_param('s', $serialized_plugins);
        
        if ($stmt->execute()) {
            echo "Plugin activated successfully.\n";
        } else {
            echo "Error activating plugin: " . $stmt->error . "\n";
        }
        
        $stmt->close();
    }
} else {
    echo "Could not retrieve active plugins.\n";
}

$mysqli->close();
?>