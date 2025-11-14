<?php
/**
 * Plugin Name: Custom User Registration
 * Description: Provides a custom endpoint for user registration via REST API
 * Version: 1.0
 * Author: Webkit Solutions
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Add custom REST API endpoint for user registration
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/register', array(
        'methods' => 'POST',
        'callback' => 'custom_register_user',
        'permission_callback' => '__return_true',
        'args' => array(
            'username' => array(
                'required' => true,
                'type' => 'string',
            ),
            'email' => array(
                'required' => true,
                'type' => 'string',
            ),
            'password' => array(
                'required' => true,
                'type' => 'string',
            ),
            'first_name' => array(
                'required' => false,
                'type' => 'string',
            ),
            'last_name' => array(
                'required' => false,
                'type' => 'string',
            ),
        ),
    ));
    
    // Add custom REST API endpoint for subscription creation
    register_rest_route('custom/v1', '/subscriptions', array(
        'methods' => 'POST',
        'callback' => 'custom_create_subscription',
        'permission_callback' => 'custom_subscription_permissions_check',
        'args' => array(
            'product' => array(
                'required' => true,
                'type' => 'string',
            ),
            'plan_id' => array(
                'required' => true,
                'type' => array('integer', 'string'), // Accept both integer and string
            ),
            'start_date' => array(
                'required' => true,
                'type' => 'string',
            ),
            'next_billing_date' => array(
                'required' => true,
                'type' => 'string',
            ),
        ),
    ));
    
    // Add custom REST API endpoint for fetching user subscriptions
    register_rest_route('custom/v1', '/subscriptions', array(
        'methods' => 'GET',
        'callback' => 'custom_fetch_subscriptions',
        'permission_callback' => 'custom_subscription_permissions_check',
        'args' => array(
            'user_id' => array(
                'required' => false,
                'type' => 'integer',
            ),
        ),
    ));
    
    // Add admin endpoint to fetch subscriptions for any user (for testing)
    register_rest_route('custom/v1', '/admin/subscriptions/(?P<user_id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'custom_admin_fetch_subscriptions',
        'permission_callback' => 'custom_admin_permissions_check',
    ));
    
    // Add a debug endpoint for testing (only in development)
    if (defined('WP_DEBUG') && WP_DEBUG) {
        register_rest_route('custom/v1', '/debug/subscriptions/(?P<user_id>\d+)', array(
            'methods' => 'GET',
            'callback' => 'custom_debug_fetch_subscriptions',
            'permission_callback' => '__return_true',
        ));
    }
});

// Custom user registration function
function custom_register_user($request) {
    $username = sanitize_user($request['username']);
    $email = sanitize_email($request['email']);
    $password = $request['password'];
    $first_name = sanitize_text_field($request['first_name'] ?? '');
    $last_name = sanitize_text_field($request['last_name'] ?? '');
    
    // Check if user already exists
    if (username_exists($username) || email_exists($email)) {
        return new WP_Error('user_exists', 'User already exists with this username or email', array('status' => 400));
    }
    
    // Create the user
    $user_id = wp_create_user($username, $password, $email);
    
    if (is_wp_error($user_id)) {
        return new WP_Error('registration_failed', $user_id->get_error_message(), array('status' => 400));
    }
    
    // Update user meta
    wp_update_user(array(
        'ID' => $user_id,
        'first_name' => $first_name,
        'last_name' => $last_name,
        'role' => 'subscriber' // Set default role to subscriber
    ));
    
    // Get the created user
    $user = get_user_by('id', $user_id);
    
    return array(
        'id' => $user->ID,
        'username' => $user->user_login,
        'email' => $user->user_email,
        'first_name' => $user->first_name,
        'last_name' => $user->last_name
    );
}

// Custom subscription creation function
function custom_create_subscription($request) {
    // Get the current user from the JWT token
    $current_user = wp_get_current_user();
    $user_id = $current_user->ID;
    
    // If we couldn't get a user, return an error
    if (!$user_id) {
        return new WP_Error('user_not_found', 'User not found or not authenticated', array('status' => 401));
    }
    
    $product = sanitize_text_field($request['product']);
    // Handle plan_id - could be integer or string
    $plan_id = $request['plan_id'];
    if (is_string($plan_id)) {
        // If it's a string, try to convert to integer, or keep as is
        $plan_id = is_numeric($plan_id) ? intval($plan_id) : $plan_id;
    } else {
        $plan_id = intval($plan_id);
    }
    $start_date = sanitize_text_field($request['start_date']);
    $next_billing_date = sanitize_text_field($request['next_billing_date']);
    
    // Validate dates
    if (empty($start_date) || $start_date === 'Invalid Date') {
        $start_date = date('Y-m-d');
    }
    
    if (empty($next_billing_date) || $next_billing_date === 'Invalid Date') {
        $next_billing_date = date('Y-m-d', strtotime('+1 month'));
    }
    
    // Handle product - could be a post ID or a product name
    $product_value = $request['product'];
    if (is_numeric($product_value)) {
        // It's a post ID
        $product = intval($product_value);
    } else {
        // It's a product name - try to find the post by title
        $product_posts = get_posts(array(
            'post_type' => 'products',
            'post_status' => 'publish',
            'title' => $product_value,
            'numberposts' => 1
        ));
        
        if (!empty($product_posts)) {
            $product = $product_posts[0]->ID;
        } else {
            // If we can't find by title, store the name as a string
            $product = $product_value;
        }
    }
    
    // Create the subscription post
    $post_id = wp_insert_post(array(
        'post_title' => 'Subscription for ' . (is_numeric($product) ? get_the_title($product) : $product),
        'post_type' => 'subscriptions',
        'post_status' => 'publish',
        'post_author' => $user_id,
    ));
    
    if (is_wp_error($post_id)) {
        return new WP_Error('subscription_creation_failed', $post_id->get_error_message(), array('status' => 400));
    }
    
    // Update ACF fields
    update_field('user_id', $user_id, $post_id);
    update_field('product', $product, $post_id);
    update_field('plan', $plan_id, $post_id);
    update_field('start_date', $start_date, $post_id);
    update_field('next_billing_date', $next_billing_date, $post_id);
    update_field('status', 'active', $post_id);
    
    // Get the created subscription
    $subscription = get_post($post_id);
    
    return array(
        'id' => $subscription->ID,
        'title' => $subscription->post_title,
        'user_id' => get_field('user_id', $post_id),
        'product' => get_field('product', $post_id),
        'plan' => get_field('plan', $post_id),
        'start_date' => get_field('start_date', $post_id),
        'next_billing_date' => get_field('next_billing_date', $post_id),
        'status' => get_field('status', $post_id)
    );
}

// Custom subscription fetching function
function custom_fetch_subscriptions($request) {
    // Get the current user from the JWT token
    $current_user = wp_get_current_user();
    $current_user_id = $current_user->ID;
    
    // If we couldn't get a user, return an error
    if (!$current_user_id) {
        return new WP_Error('user_not_found', 'User not found or not authenticated', array('status' => 401));
    }
    
    // Check if a specific user_id was requested and if the current user is an admin
    $requested_user_id = intval($request->get_param('user_id'));
    if ($requested_user_id && current_user_can('manage_options')) {
        // Admin can fetch subscriptions for any user
        $user_id = $requested_user_id;
    } else {
        // Regular user can only fetch their own subscriptions
        $user_id = $current_user_id;
    }
    
    // Query subscriptions for the user
    $args = array(
        'post_type' => 'subscriptions',
        'post_status' => 'publish',
        'meta_query' => array(
            array(
                'key' => 'user_id',
                'value' => $user_id,
                'compare' => '='
            )
        )
    );
    
    $subscriptions_query = new WP_Query($args);
    $subscriptions = array();
    
    if ($subscriptions_query->have_posts()) {
        while ($subscriptions_query->have_posts()) {
            $subscriptions_query->the_post();
            $post_id = get_the_ID();
            
            // Get the product field
            $product_field = get_field('product', $post_id);
            
            // Handle both post objects and strings
            $product_data = false;
            if (is_numeric($product_field)) {
                // It's a post ID
                $product_post = get_post($product_field);
                if ($product_post) {
                    $product_data = array(
                        'ID' => $product_post->ID,
                        'post_title' => $product_post->post_title
                    );
                }
            } else if (is_string($product_field)) {
                // It's a string (product name)
                $product_data = $product_field;
            }
            
            $subscriptions[] = array(
                'id' => get_the_ID(),
                'title' => get_the_title(),
                'user_id' => get_field('user_id', $post_id),
                'product' => $product_data,
                'plan' => get_field('plan', $post_id),
                'start_date' => get_field('start_date', $post_id),
                'next_billing_date' => get_field('next_billing_date', $post_id),
                'status' => get_field('status', $post_id)
            );
        }
        wp_reset_postdata();
    }
    
    return $subscriptions;
}

// Admin subscription fetching function (for testing)
function custom_admin_fetch_subscriptions($request) {
    $user_id = intval($request['user_id']);
    
    // Query subscriptions for the user
    $args = array(
        'post_type' => 'subscriptions',
        'post_status' => 'publish',
        'meta_query' => array(
            array(
                'key' => 'user_id',
                'value' => $user_id,
                'compare' => '='
            )
        )
    );
    
    $subscriptions_query = new WP_Query($args);
    $subscriptions = array();
    
    if ($subscriptions_query->have_posts()) {
        while ($subscriptions_query->have_posts()) {
            $subscriptions_query->the_post();
            $post_id = get_the_ID();
            
            $subscriptions[] = array(
                'id' => get_the_ID(),
                'title' => get_the_title(),
                'user_id' => get_field('user_id', $post_id),
                'product' => get_field('product', $post_id),
                'plan' => get_field('plan', $post_id),
                'start_date' => get_field('start_date', $post_id),
                'next_billing_date' => get_field('next_billing_date', $post_id),
                'status' => get_field('status', $post_id)
            );
        }
        wp_reset_postdata();
    }
    
    return $subscriptions;
}

// Debug subscription fetching function (for testing only)
function custom_debug_fetch_subscriptions($request) {
    $user_id = intval($request['user_id']);
    
    // Query subscriptions for the user
    $args = array(
        'post_type' => 'subscriptions',
        'post_status' => 'publish',
        'meta_query' => array(
            array(
                'key' => 'user_id',
                'value' => $user_id,
                'compare' => '='
            )
        )
    );
    
    $subscriptions_query = new WP_Query($args);
    $subscriptions = array();
    
    if ($subscriptions_query->have_posts()) {
        while ($subscriptions_query->have_posts()) {
            $subscriptions_query->the_post();
            $post_id = get_the_ID();
            
            $subscriptions[] = array(
                'id' => get_the_ID(),
                'title' => get_the_title(),
                'user_id' => get_field('user_id', $post_id),
                'product' => get_field('product', $post_id),
                'plan' => get_field('plan', $post_id),
                'start_date' => get_field('start_date', $post_id),
                'next_billing_date' => get_field('next_billing_date', $post_id),
                'status' => get_field('status', $post_id)
            );
        }
        wp_reset_postdata();
    }
    
    return $subscriptions;
}

// Permission check for subscription creation
function custom_subscription_permissions_check($request) {
    // Check if user is authenticated via JWT
    $current_user = wp_get_current_user();
    
    // Allow if user is logged in
    if ($current_user->ID) {
        return true;
    }
    
    return new WP_Error('rest_forbidden', 'You must be logged in to create subscriptions.', array('status' => 401));
}

// Permission check for admin functions
function custom_admin_permissions_check($request) {
    // Check if user is authenticated via JWT and is an admin
    $current_user = wp_get_current_user();
    
    // Allow if user is logged in and is an administrator
    if ($current_user->ID && current_user_can('manage_options')) {
        return true;
    }
    
    return new WP_Error('rest_forbidden', 'You must be an administrator to access this endpoint.', array('status' => 401));
}