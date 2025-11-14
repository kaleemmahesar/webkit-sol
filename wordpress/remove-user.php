<?php
// Script to remove the user keven.mavs@gmail.com
require_once('wp-load.php');

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

// Remove the user
$result = wp_delete_user($user->ID);

if ($result) {
    echo "User successfully removed.\n";
} else {
    echo "Failed to remove user.\n";
}
?>