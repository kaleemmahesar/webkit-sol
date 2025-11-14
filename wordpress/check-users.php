<?php
require_once('wp-load.php');

echo "=== USERS IN WORDPRESS ===\n";
$users = get_users();
foreach ($users as $user) {
    echo "ID: " . $user->ID . " | Login: " . $user->user_login . " | Email: " . $user->user_email . "\n";
}

echo "\n=== ADMIN USER ===\n";
$user = get_user_by('login', 'admin');
if ($user) {
    echo "Admin user exists. ID: " . $user->ID . "\n";
} else {
    echo "Admin user not found\n";
}
?>