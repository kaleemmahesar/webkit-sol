<?php
// Test REST API Script
require_once('wordpress/wp-config.php');
require_once('wordpress/wp-load.php');

// Test products endpoint
echo "Testing products REST API endpoint...\n";
$products_request = new WP_REST_Request('GET', '/wp/v2/products');
$products_response = rest_do_request($products_request);
$products_server = rest_get_server();
$products_data = $products_server->response_to_data($products_response, true);

echo "Products count: " . count($products_data) . "\n";
if (count($products_data) > 0) {
    echo "First product title: " . $products_data[0]['title']['rendered'] . "\n";
    echo "First product meta: " . print_r($products_data[0]['meta'], true) . "\n";
}

// Test plans endpoint
echo "\nTesting plans REST API endpoint...\n";
$plans_request = new WP_REST_Request('GET', '/wp/v2/plans');
$plans_response = rest_do_request($plans_request);
$plans_server = rest_get_server();
$plans_data = $plans_server->response_to_data($plans_response, true);

echo "Plans count: " . count($plans_data) . "\n";
if (count($plans_data) > 0) {
    echo "First plan title: " . $plans_data[0]['title']['rendered'] . "\n";
    echo "First plan meta: " . print_r($plans_data[0]['meta'], true) . "\n";
}

echo "\nAPI test completed.\n";
?>