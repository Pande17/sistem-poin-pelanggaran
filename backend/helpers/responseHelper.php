<?php

function sendResponse($statusCode, $message = null, $data = null, $errLocate = null) {
    http_response_code($statusCode);
    echo json_encode([
        'status' => $statusCode,
        'message' => $message,
        'data' => $data,
        'errLocate' => $errLocate
    ]);
    exit();
}

// Fungsi untuk mengirimkan response dengan status 200 OK
function Success($data = null, $message = "Request berhasil") {
    sendResponse(200, $message, $data);
}

// Fungsi untuk mengirimkan response dengan status 201 Created
function Created($data = null, $message = "Data berhasil dibuat") {
    sendResponse(201, $message, $data);
}

// Fungsi untuk mengirimkan response dengan status 400 Bad Request
function BadRequest($data = null, $message = "Bad Request", $errLocate = null) {
    sendResponse(400, $message, $data, $errLocate);
}

// Fungsi untuk mengirimkan response dengan status 401 Unauthorized
function NotAuthorized($data = null, $message = "Unauthorized", $errLocate = null) {
    sendResponse(401, $message, $data, $errLocate);
}

// Fungsi untuk mengirimkan response dengan status 404 Not Found
function NotFound($data = null, $message = "Data tidak ditemukan", $errLocate = null) {
    sendResponse(404, $message, $data, $errLocate);
}

// Fungsi untuk mengirimkan response dengan status 409 Conflict
function Conflict($data = null, $message = "Conflict terjadi", $errLocate = null) {
    sendResponse(409, $message, $data, $errLocate);
}

// Fungsi untuk mengirimkan response dengan status 422 Unprocessable Entity (misalnya, validasi input)
function UnprocessableEntity($data = null, $message = "Data tidak dapat diproses", $errLocate = null) {
    sendResponse(422, $message, $data, $errLocate);
}

// Fungsi untuk mengirimkan response dengan status 415 Unsupported Media Type
function UnsupportedMediaType($data = null, $message = "Media Type tidak didukung") {
    sendResponse(415, $message, $data);
}

// Fungsi untuk mengirimkan response dengan status 500 Internal Server Error
function InternalServerError($data = null, $message = "Terjadi kesalahan pada server", $errLocate = null) {
    sendResponse(500, $message, $data, $errLocate);
}

// Fungsi untuk mengirimkan response dengan status 503 Service Unavailable
function ServiceUnavailable($data = null, $message = "Layanan tidak tersedia") {
    sendResponse(503, $message, $data);
}
