<?php
// Test script to check user and subscriptions
require_once('wordpress/wp-load.php');

// Check if user exists
$user = get_user_by('email', 'keven.mavs@gmail.com');
if ($user) {
    echo "User found:\n";
    echo "ID: " . $user->ID . "\n";
    echo "Username: " . $user->user_login . "\n";
    echo "Email: " . $user->user_email . "\n";
    
    // Check subscriptions for this user
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
        echo "\nSubscriptions found:\n";
        while ($subscriptions_query->have_posts()) {
            $subscriptions_query->the_post();
            $post_id = get_the_ID();
            
            echo "Subscription ID: " . $post_id . "\n";
            echo "Title: " . get_the_title() . "\n";
            echo "User ID: " . get_field('user_id', $post_id) . "\n";
            echo "Product: " . get_field('product', $post_id) . "\n";
            echo "Plan: " . get_field('plan', $post_id) . "\n";
            echo "Start Date: " . get_field('start_date', $post_id) . "\n";
            echo "Next Billing Date: " . get_field('next_billing_date', $post_id) . "\n";
            echo "Status: " . get_field('status', $post_id) . "\n";
            echo "---\n";
        }
    } else {
        echo "\nNo subscriptions found for this user.\n";
    }
    wp_reset_postdata();
} else {
    echo "User not found.\n";
}
?>