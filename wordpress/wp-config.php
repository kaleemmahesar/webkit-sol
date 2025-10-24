<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'webkit-sol' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', 'Larkana22' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '?h%epe; bH^aLeGgD9*6a#q_1,g1KSxN)DKz8Qfm[&/U2A-UYQz$6.9@&2bBeTk`' );
define( 'SECURE_AUTH_KEY',  '{Cwp~^9*N<=)N?<AQr<Q2EU#uD4mrUPy aIk~ky]%g8tO)6h]^z1cRX6lK>W;1p6' );
define( 'LOGGED_IN_KEY',    'ZI^k]G)p,9oAg9R<Az,NhIv(so=;(?fzqze/yP:0yt@VT@OsUc^Imta/y9G~|tM:' );
define( 'NONCE_KEY',        'dn+2(oRZNmx%5|dH1;,=Yx~%u*?#Cw{C1U6IipKp):IJN_T_E^7q19n_|IBE)BL6' );
define( 'AUTH_SALT',        '[n:62ohSP;gl)?c?5bx2^0u~`nU9Xd=k!p@nG5lH_wdW[Mju@!KN:Tf4VW.ic(9i' );
define( 'SECURE_AUTH_SALT', 'e.7iaG_g3xV-YZ?x/hTP1+`Hdmh[o7SQ,{{LCum>{nV%ex+q<co&pXc4G4D&crhI' );
define( 'LOGGED_IN_SALT',   'oG+zTP0fYP9=R6pGWlu+ ?[Z(MjEt}]u]i.Y1D?>cx 3=ty5;k<V2>dAvC+%E>Dx' );
define( 'NONCE_SALT',       'HF?`m%<B;DzfirM!s=vC#&R6n7`+r0/1:mUwX+WK/;yf-n3;)TR|{8bZN< G@3rv' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 *
 * At the installation time, database tables are created with the specified prefix.
 * Changing this value after WordPress is installed will make your site think
 * it has not been installed.
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/#table-prefix
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
