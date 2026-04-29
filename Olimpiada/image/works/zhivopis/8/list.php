<?php
$folder = __DIR__;
$files = [];
$allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'];
foreach (scandir($folder) as $file) {
    $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    if (in_array($ext, $allowed)) {
        $files[] = $file;
    }
}
header('Content-Type: application/json');
echo json_encode($files);