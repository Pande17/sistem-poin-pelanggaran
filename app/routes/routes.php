<?php
require_once '../controllers/guruController.php';

$controller = new GuruController();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Preflight CORS request
    http_response_code(200);
    exit;
}

$requestMethod = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$segments = explode('/', trim($path, '/'));

// Support URIs like /guru, /guru/123, or when app is in a subfolder
$endpoint = end($segments);

// If last segment is numeric and previous is 'guru', treat as id
if (is_numeric($endpoint)) {
    $lastIndex = count($segments) - 1;
    $prev = $segments[$lastIndex - 1] ?? '';
    if ($prev === 'guru') {
        // map ID into query param so controller can read it
        $_GET['id'] = $endpoint;
        $endpoint = 'guru';
    }
}

if ($endpoint === 'guru') {
    if ($requestMethod === 'GET') {
        $controller->getGuru();
        exit;
    }
    if ($requestMethod === 'POST') {
        $controller->createGuru();
        exit;
    }
    if ($requestMethod === 'PUT') {
        $controller->updateGuru();
        exit;
    }
    if ($requestMethod === 'DELETE') {
        $controller->deleteGuru();
        exit;
    }
}

http_response_code(404);
echo json_encode(['message' => 'Route not found']);
