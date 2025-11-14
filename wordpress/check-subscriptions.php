<?php
// Script to check subscriptions in the WordPress database
require_once('wp-load.php');

global $wpdb;

echo "<pre>";

// Check the wp_posts table for subscriptions
echo "=== SUBSCRIPTIONS IN WP_POSTS TABLE ===\n";
$subscriptions = $wpdb->get_results("SELECT * FROM {$wpdb->posts} WHERE post_type = 'subscriptions' AND post_status = 'publish' ORDER BY post_date DESC");

foreach ($subscriptions as $subscription) {
    echo "ID: " . $subscription->ID . "\n";
    echo "Title: " . $subscription->post_title . "\n";
    echo "Date: " . $subscription->post_date . "\n";
    echo "Author: " . $subscription->post_author . "\n";
    echo "---\n";
}

echo "\n=== SUBSCRIPTION META DATA IN WP_POSTMETA TABLE ===\n";
foreach ($subscriptions as $subscription) {
    echo "Subscription ID: " . $subscription->ID . "\n";
    $meta_data = $wpdb->get_results($wpdb->prepare("SELECT * FROM {$wpdb->postmeta} WHERE post_id = %d", $subscription->ID));
    
    foreach ($meta_data as $meta) {
        echo "  " . $meta->meta_key . ": " . $meta->meta_value . "\n";
    }
    echo "---\n";
}

echo "\n=== USER INFORMATION ===\n";
// Get all users to show the relationship
$users = get_users();
foreach ($users as $user) {
    echo "User ID: " . $user->ID . " | Username: " . $user->user_login . " | Email: " . $user->user_email . "\n";
}

echo "</pre>";
?>