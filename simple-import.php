<?php
// Simple Import Script
require_once('wordpress/wp-config.php');
require_once('wordpress/wp-load.php');

// Check if required post types exist
$post_types = get_post_types();
echo "Available post types: " . implode(', ', $post_types) . "\n";

if (!in_array('products', $post_types)) {
    echo "Products post type not registered.\n";
    exit(1);
}

if (!in_array('plans', $post_types)) {
    echo "Plans post type not registered.\n";
    exit(1);
}

echo "Required post types are available.\n";

// Parse the XML file
$xml_file = 'subscription-data.xml';
if (!file_exists($xml_file)) {
    echo "XML file not found: " . $xml_file . "\n";
    exit(1);
}

$xml = simplexml_load_file($xml_file);
if (!$xml) {
    echo "Failed to parse XML file.\n";
    exit(1);
}

// Add namespace handling
$namespaces = $xml->getNamespaces(true);
echo "XML Namespaces: " . print_r($namespaces, true) . "\n";

// Process items
$products_imported = 0;
$plans_imported = 0;

foreach ($xml->channel->item as $item) {
    $post_type = (string)$item->children($namespaces['wp'])->post_type;
    
    // Prepare post data
    $post_data = array(
        'post_title' => (string)$item->title,
        'post_content' => (string)$item->children('http://purl.org/rss/1.0/modules/content/')->encoded,
        'post_excerpt' => (string)$item->children('http://wordpress.org/export/1.2/excerpt/')->encoded,
        'post_status' => (string)$item->children($namespaces['wp'])->status,
        'post_type' => $post_type,
        'post_name' => (string)$item->children($namespaces['wp'])->post_name,
        'post_date' => (string)$item->children($namespaces['wp'])->post_date,
    );
    
    // Insert the post
    $post_id = wp_insert_post($post_data);
    
    if (is_wp_error($post_id)) {
        echo "Error importing " . $post_data['post_title'] . ": " . $post_id->get_error_message() . "\n";
        continue;
    }
    
    echo "Imported " . $post_data['post_title'] . " (ID: " . $post_id . ", Type: " . $post_type . ")\n";
    
    // Import post meta
    foreach ($item->children($namespaces['wp'])->postmeta as $meta) {
        $meta_key = (string)$meta->meta_key;
        $meta_value = (string)$meta->meta_value;
        
        // Handle serialized data
        if (strpos($meta_value, 'a:') === 0) {
            $meta_value = unserialize($meta_value);
        }
        
        update_post_meta($post_id, $meta_key, $meta_value);
        echo "  - Added meta: " . $meta_key . "\n";
    }
    
    // Update counters
    if ($post_type === 'products') {
        $products_imported++;
    } elseif ($post_type === 'plans') {
        $plans_imported++;
    }
}

echo "Import completed.\n";
echo "Products imported: " . $products_imported . "\n";
echo "Plans imported: " . $plans_imported . "\n";
?>