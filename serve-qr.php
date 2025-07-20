<?php
session_start();

// ✅ Optionally check session or token here
// if (!isset($_SESSION['user'])) { http_response_code(403); exit('Forbidden'); }

// ✅ Restrict referrers (anti-hotlinking)
$allowed_referer = 'https://www.jambhekarmaharaj.org';
if (!isset($_SERVER['HTTP_REFERER']) || strpos($_SERVER['HTTP_REFERER'], $allowed_referer) !== 0) {
    http_response_code(403);
    exit('Access Denied');
}

// ✅ Set secure headers
header('Content-Type: image/jpeg');
header('Content-Disposition: inline; filename="qr.jpeg"');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Cache-Control: no-store');

// ✅ Serve the image from secure path
readfile('/resterict/qr.jpeg');
exit;
?>
