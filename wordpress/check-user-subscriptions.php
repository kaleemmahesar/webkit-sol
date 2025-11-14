<?php
// Script to check subscriptions for a specific user
require_once('wp-load.php');

global $wpdb;

// Get the user by email
$user = get_user_by('email', 'keven.mavs@gmail.com');

if (!$user) {
    echo "User keven.mavs@gmail.com not found in the database.\n";
    exit;
}

echo "User found:\n";
echo "ID: " . $user->ID . "\n";
echo "Username: " . $user->user_login . "\n";
echo "Email: " . $user->user_email . "\n";
echo "Role: " . implode(', ', $user->roles) . "\n\n";

// Check for subscriptions associated with this user
echo "=== SUBSCRIPTIONS FOR THIS USER ===\n";

// Method 1: Using WP_Query (recommended WordPress way)
$args = array(
    'post_type' => 'subscriptions',
    'post_status' => 'publish',
    'meta_query' => array(
        array(
            'key' => 'user_id',
            'value' => $user->ID,
            'compare' => '='
        )
    )
);

$subscriptions_query = new WP_Query($args);

if ($subscriptions_query->have_posts()) {
    while ($subscriptions_query->have_posts()) {
        $subscriptions_query->the_post();
        $post_id = get_the_ID();
        
        echo "Subscription ID: " . $post_id . "\n";
        echo "Title: " . get_the_title() . "\n";
        echo "Date: " . get_the_date() . "\n";
        
        // Get ACF fields
        echo "User ID: " . get_field('user_id', $post_id) . "\n";
        echo "Product: " . (get_field('product', $post_id) ? get_field('product', $post_id) : 'N/A') . "\n";
        echo "Plan: " . (get_field('plan', $post_id) ? print_r(get_field('plan', $post_id), true) : 'N/A') . "\n";
        echo "Start Date: " . get_field('start_date', $post_id) . "\n";
        echo "Next Billing Date: " . get_field('next_billing_date', $post_id) . "\n";
        echo "Status: " . get_field('status', $post_id) . "\n";
        echo "---\n";
    }
} else {
    echo "No subscriptions found for this user.\n";
}

// Method 2: Direct database query (alternative approach)
echo "\n=== DIRECT DATABASE QUERY ===\n";
$subscriptions = $wpdb->get_results($wpdb->prepare("
    SELECT p.*, pm.meta_value as user_id_meta 
    FROM {$wpdb->posts} p 
    JOIN {$wpdb->postmeta} pm ON p.ID = pm.post_id 
    WHERE p.post_type = 'subscriptions' 
    AND p.post_status = 'publish' 
    AND pm.meta_key = 'user_id' 
    AND pm.meta_value = %d
", $user->ID));

if ($subscriptions) {
    foreach ($subscriptions as $subscription) {
        echo "Subscription ID: " . $subscription->ID . "\n";
        echo "Title: " . $subscription->post_title . "\n";
        echo "Date: " . $subscription->post_date . "\n";
        echo "User ID (from meta): " . $subscription->user_id_meta . "\n";
        
        // Get all meta data for this subscription
        $meta_data = $wpdb->get_results($wpdb->prepare("SELECT * FROM {$wpdb->postmeta} WHERE post_id = %d", $subscription->ID));
        echo "Meta Data:\n";
        foreach ($meta_data as $meta) {
            echo "  " . $meta->meta_key . ": " . $meta->meta_value . "\n";
        }
        echo "---\n";
    }
} else {
    echo "No subscriptions found for this user in direct database query.\n";
}

wp_reset_postdata();
?>