<?php
// Check ACF Field Groups Registration
require_once('wordpress/wp-config.php');
require_once('wordpress/wp-load.php');

// Check if ACF functions exist
if (!function_exists('acf_get_field_groups')) {
    echo "ACF is not loaded or activated.\n";
    exit(1);
}

// Get all field groups
$field_groups = acf_get_field_groups();

echo "Registered ACF Field Groups:\n";
if (!empty($field_groups)) {
    foreach ($field_groups as $group) {
        echo "- " . $group['title'] . " (Key: " . $group['key'] . ")\n";
        
        // Get fields for this group
        $fields = acf_get_fields($group['key']);
        if (!empty($fields)) {
            echo "  Fields:\n";
            foreach ($fields as $field) {
                echo "    - " . $field['label'] . " (" . $field['name'] . ")\n";
            }
        }
    }
} else {
    echo "No ACF field groups found.\n";
}

// Check if our specific field groups exist
$products_group = acf_get_field_group('group_products');
$plans_group = acf_get_field_group('group_plans');

echo "\nSpecific Field Group Check:\n";
echo "Products Group: " . ($products_group ? "Found" : "Not Found") . "\n";
echo "Plans Group: " . ($plans_group ? "Found" : "Not Found") . "\n";

// Check active plugins
echo "\nActive Plugins:\n";
$active_plugins = get_option('active_plugins');
foreach ($active_plugins as $plugin) {
    if (strpos($plugin, 'acf') !== false || strpos($plugin, 'field-group') !== false) {
        echo "- " . $plugin . "\n";
    }
}
?>