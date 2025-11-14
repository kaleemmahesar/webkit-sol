# WordPress Database Fix Instructions

## Issue
You're experiencing a 302 redirect when accessing `http://localhost/webkit-sol/wordpress/wp-json/wp/v2/products`, which is likely caused by a corrupted or missing WordPress database.

## Solution

### Step 1: Verify MySQL is Running
1. Open XAMPP Control Panel
2. Ensure the MySQL service is running (green highlight)
3. If not running, click the "Start" button next to MySQL

### Step 2: Create and Restore Database
1. Run the restore script:
   ```
   php restore-database.php
   ```

2. If the script runs successfully, it will create the database if needed

### Step 3: Install WordPress (if database was empty)
1. Visit: http://localhost/webkit-sol/wordpress/wp-admin/install.php
2. Follow the installation wizard:
   - Database Name: webkit-sol
   - Username: root
   - Password: (leave empty)
   - Database Host: localhost
   - Table Prefix: wp_

### Step 4: Import Data from XML Export
1. Log in to WordPress admin: http://localhost/webkit-sol/wordpress/wp-login.php
2. Go to Tools > Import
3. Click "Install Now" next to WordPress importer (if not already installed)
4. After installation, click "Run Importer"
5. Select the `subscription-data.xml` file
6. Choose to import author data or assign to existing user
7. Click "Submit"

### Step 5: Verify REST API Endpoints
After completing the above steps, test the REST API endpoint:
```
curl http://localhost/webkit-sol/wordpress/wp-json/wp/v2/products
```

### Alternative: Manual Database Restoration
If the above steps don't work:

1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Create a new database named `webkit-sol`
3. Select the database
4. Go to the "Import" tab
5. Choose the XML file (you may need to convert it to SQL format first)
6. Execute the import

### Troubleshooting
- If you get permission errors, make sure you're running XAMPP as Administrator
- If MySQL won't start, check if another application is using port 3306
- If WordPress shows database connection errors, verify the settings in `wp-config.php`

## Additional Notes
The `subscription-data.xml` file contains:
- 3 Products (Inventory Manager Pro, Customer Relations Hub, Payroll Plus)
- 9 Plans (3 for each product)
- 1 Test User

After importing, your WordPress installation should have all the necessary data for the subscription system to work correctly.