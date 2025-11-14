<?php
// Register ACF Field Groups Script
require_once('wordpress/wp-config.php');
require_once('wordpress/wp-content/plugins/advanced-custom-fields-pro-main/acf.php');

// Ensure ACF is loaded
if (!class_exists('ACF')) {
    echo "ACF plugin is not active.\n";
    exit(1);
}

// Register field groups for products
function register_products_acf_fields() {
    if (function_exists('acf_add_local_field_group')) {
        acf_add_local_field_group(array(
            'key' => 'group_products',
            'title' => 'Product Details',
            'fields' => array(
                array(
                    'key' => 'field_thumbnail',
                    'label' => 'Thumbnail',
                    'name' => 'thumbnail',
                    'type' => 'text',
                    'instructions' => 'Emoji or text representing the product thumbnail',
                    'required' => 0,
                ),
                array(
                    'key' => 'field_description',
                    'label' => 'Description',
                    'name' => 'description',
                    'type' => 'textarea',
                    'instructions' => 'Product description',
                    'required' => 0,
                ),
                array(
                    'key' => 'field_starting_price',
                    'label' => 'Starting Price',
                    'name' => 'starting_price',
                    'type' => 'number',
                    'instructions' => 'Starting price for the product',
                    'required' => 0,
                ),
                array(
                    'key' => 'field_features',
                    'label' => 'Features',
                    'name' => 'features',
                    'type' => 'repeater',
                    'instructions' => 'List of product features',
                    'required' => 0,
                    'sub_fields' => array(
                        array(
                            'key' => 'field_feature_item',
                            'label' => 'Feature',
                            'name' => 'feature',
                            'type' => 'text',
                        ),
                    ),
                ),
            ),
            'location' => array(
                array(
                    array(
                        'param' => 'post_type',
                        'operator' => '==',
                        'value' => 'products',
                    ),
                ),
            ),
            'menu_order' => 0,
            'position' => 'normal',
            'style' => 'default',
            'label_placement' => 'top',
            'instruction_placement' => 'label',
            'hide_on_screen' => '',
        ));
    }
}

// Register field groups for plans
function register_plans_acf_fields() {
    if (function_exists('acf_add_local_field_group')) {
        acf_add_local_field_group(array(
            'key' => 'group_plans',
            'title' => 'Plan Details',
            'fields' => array(
                array(
                    'key' => 'field_price',
                    'label' => 'Price',
                    'name' => 'price',
                    'type' => 'number',
                    'instructions' => 'Plan price',
                    'required' => 1,
                ),
                array(
                    'key' => 'field_period',
                    'label' => 'Period',
                    'name' => 'period',
                    'type' => 'select',
                    'choices' => array(
                        'monthly' => 'Monthly',
                        'quarterly' => 'Quarterly',
                        'yearly' => 'Yearly',
                    ),
                    'default_value' => 'monthly',
                    'instructions' => 'Billing period',
                    'required' => 1,
                ),
                array(
                    'key' => 'field_plan_features',
                    'label' => 'Plan Features',
                    'name' => 'plan_features',
                    'type' => 'repeater',
                    'instructions' => 'List of plan features',
                    'required' => 0,
                    'sub_fields' => array(
                        array(
                            'key' => 'field_plan_feature_item',
                            'label' => 'Feature',
                            'name' => 'feature',
                            'type' => 'text',
                        ),
                    ),
                ),
            ),
            'location' => array(
                array(
                    array(
                        'param' => 'post_type',
                        'operator' => '==',
                        'value' => 'plans',
                    ),
                ),
            ),
            'menu_order' => 0,
            'position' => 'normal',
            'style' => 'default',
            'label_placement' => 'top',
            'instruction_placement' => 'label',
            'hide_on_screen' => '',
        ));
    }
}

// Register the field groups
register_products_acf_fields();
register_plans_acf_fields();

echo "ACF field groups registered successfully.\n";

// Flush rewrite rules to ensure REST API works
flush_rewrite_rules();

echo "Rewrite rules flushed.\n";
?>