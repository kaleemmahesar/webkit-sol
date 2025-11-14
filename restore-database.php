<?php
/**
 * Database restoration script for WordPress
 * This script will create the database and import data from the XML export
 */

// Database configuration
$servername = "localhost";
$username = "root";
$password = ""; // Default XAMPP password is empty
$dbname = "webkit-sol";

echo "Starting database restoration process...\n";

try {
    // Connect to MySQL server
    $pdo = new PDO("mysql:host=$servername", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Connected to MySQL server successfully.\n";
    
    // Check if database exists
    $stmt = $pdo->query("SHOW DATABASES LIKE '$dbname'");
    $databaseExists = $stmt->fetch();
    
    if (!$databaseExists) {
        // Create database
        $pdo->exec("CREATE DATABASE `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        echo "Database '$dbname' created successfully.\n";
    } else {
        echo "Database '$dbname' already exists.\n";
    }
    
    // Connect to the specific database
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if WordPress tables exist
    $stmt = $pdo->query("SHOW TABLES LIKE 'wp_%'");
    $tables = $stmt->fetchAll();
    
    if (count($tables) == 0) {
        echo "No WordPress tables found. You'll need to install WordPress first.\n";
        echo "Please visit http://localhost/webkit-sol/wordpress/wp-admin/install.php to install WordPress.\n";
    } else {
        echo "WordPress tables found. Database seems to be set up correctly.\n";
        echo "If you're still experiencing issues, try importing the XML data through WordPress:\n";
        echo "1. Log in to WordPress admin\n";
        echo "2. Go to Tools > Import\n";
        echo "3. Install the WordPress importer plugin if not already installed\n";
        echo "4. Import the subscription-data.xml file\n";
    }
    
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
    
    if (strpos($e->getMessage(), 'Access denied') !== false) {
        echo "Access denied. Please check your MySQL username and password.\n";
    } else if (strpos($e->getMessage(), 'Connection refused') !== false) {
        echo "Connection refused. Please make sure MySQL is running.\n";
        echo "Start XAMPP Control Panel and ensure MySQL service is running.\n";
    }
}

echo "\nDatabase restoration process completed.\n";
?>