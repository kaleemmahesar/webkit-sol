<?php
// Import XML Data Script
require_once('wordpress/wp-config.php');
require_once('wordpress/wp-load.php');
require_once('wordpress/wp-admin/includes/admin.php');
require_once('wordpress/wp-admin/includes/import.php');
require_once('wordpress/wp-content/plugins/wordpress-importer/wordpress-importer.php');

// Check if WordPress Importer is available
if (!class_exists('WP_Import')) {
    echo "WordPress Importer plugin is not available.\n";
    exit(1);
}

// Initialize the importer
$importer = new WP_Import();

// Path to the XML file
$xml_file = 'subscription-data.xml';

if (!file_exists($xml_file)) {
    echo "XML file not found: " . $xml_file . "\n";
    exit(1);
}

// Read the XML file
$xml_data = file_get_contents($xml_file);

if (!$xml_data) {
    echo "Failed to read XML file.\n";
    exit(1);
}

// Import the data
echo "Starting import...\n";

// Suppress output buffering issues
ob_start();
$result = $importer->import($xml_file);
ob_end_clean();

echo "Import completed.\n";

// Check if products and plans were imported
$products_count = wp_count_posts('products');
$plans_count = wp_count_posts('plans');

echo "Products imported: " . $products_count->publish . "\n";
echo "Plans imported: " . $plans_count->publish . "\n";

echo "Import process finished.\n";
?>