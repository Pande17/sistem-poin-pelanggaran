<?php
require_once '../controllers/guruController.php';
require_once '../controllers/siswaController.php';
require_once '../controllers/pelanggaranController.php';
require_once '../controllers/suratController.php';
require_once '../helpers/responseHelper.php';

$guruController = new GuruController();
// $siswaController = new SiswaController();
// $pelanggaranController = new PelanggaranController();
// $suratController = new SuratController();

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Parse the URI and determine the endpoint
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$segments = explode('/', trim($path, '/'));
$endpoint = end($segments);

// Check if the last segment is numeric (for dynamic resource ids)
if (is_numeric($endpoint) && isset($segments[count($segments) - 2]) && $segments[count($segments) - 2] === 'guru') {
    $_GET['id'] = $endpoint;
    $endpoint = 'guru';
} elseif (is_numeric($endpoint) && isset($segments[count($segments) - 2]) && $segments[count($segments) - 2] === 'siswa') {
    $_GET['id'] = $endpoint;
    $endpoint = 'siswa';
} elseif (is_numeric($endpoint) && isset($segments[count($segments) - 2]) && $segments[count($segments) - 2] === 'pelanggaran') {
    $_GET['id'] = $endpoint;
    $endpoint = 'pelanggaran';
} elseif (is_numeric($endpoint) && isset($segments[count($segments) - 2]) && $segments[count($segments) - 2] === 'surat') {
    $_GET['id'] = $endpoint;
    $endpoint = 'surat';
}

// Route handling
switch ($endpoint) {
    case 'guru':
        switch ($_SERVER['REQUEST_METHOD']) {
            case 'GET':
                $guruController->getGuru();
                break;
            case 'POST':
                $guruController->createGuru();
                break;
            case 'PUT':
                $guruController->updateGuru();
                break;
            case 'DELETE':
                $guruController->deleteGuru();
                break;
            default:
                // Method Not Allowed
                BadRequest(null, 'Method Not Allowed');
        }
        break;

    case 'siswa':
        switch ($_SERVER['REQUEST_METHOD']) {
            case 'GET':
                $siswaController->getSiswa();
                break;
            case 'POST':
                $siswaController->createSiswa();
                break;
            case 'PUT':
                $siswaController->updateSiswa();
                break;
            case 'DELETE':
                $siswaController->deleteSiswa();
                break;
            default:
                // Method Not Allowed
                BadRequest(null, 'Method Not Allowed');
        }
        break;

    case 'pelanggaran':
        switch ($_SERVER['REQUEST_METHOD']) {
            case 'GET':
                $pelanggaranController->getPelanggaran();
                break;
            case 'POST':
                $pelanggaranController->createPelanggaran();
                break;
            case 'PUT':
                $pelanggaranController->updatePelanggaran();
                break;
            case 'DELETE':
                $pelanggaranController->deletePelanggaran();
                break;
            default:
                // Method Not Allowed
                BadRequest(null, 'Method Not Allowed');
        }
        break;

    case 'surat':
        switch ($_SERVER['REQUEST_METHOD']) {
            case 'GET':
                $suratController->getSurat();
                break;
            case 'POST':
                $suratController->createSurat();
                break;
            case 'PUT':
                $suratController->updateSurat();
                break;
            case 'DELETE':
                $suratController->deleteSurat();
                break;
            default:
                // Method Not Allowed
                BadRequest(null, 'Method Not Allowed');
        }
        break;

    default:
        // Route not found
        NotFound(null, 'Route not found');
}
