<?php

function sendResponse($statusCode, $data = null, $message = null) {
    http_response_code($statusCode);
    echo json_encode([
        'status' => $statusCode,
        'message' => $message,
        'data' => $data
    ]);
    exit();
}

// Fungsi untuk mengirimkan response dengan status 200 OK
function Success($data = null, $message = "Request berhasil") {
    sendResponse(200, $data, $message);
}

// Fungsi untuk mengirimkan response dengan status 201 Created
function Created($data = null, $message = "Data berhasil dibuat") {
    sendResponse(201, $data, $message);
}

// Fungsi untuk mengirimkan response dengan status 400 Bad Request
function BadRequest($data = null, $message = "Bad Request") {
    sendResponse(400, $data, $message);
}

// Fungsi untuk mengirimkan response dengan status 401 Unauthorized
function NotAuthorized($data = null, $message = "Unauthorized") {
    sendResponse(401, $data, $message);
}

// Fungsi untuk mengirimkan response dengan status 404 Not Found
function NotFound($data = null, $message = "Data tidak ditemukan") {
    sendResponse(404, $data, $message);
}

// Fungsi untuk mengirimkan response dengan status 500 Internal Server Error
function InternalServerError($data = null, $message = "Terjadi kesalahan pada server") {
    sendResponse(500, $data, $message);
}

// Fungsi untuk mengirimkan response dengan status 422 Unprocessable Entity (misalnya, validasi input)
function UnprocessableEntity($data = null, $message = "Data tidak dapat diproses") {
    sendResponse(422, $data, $message);
}

// Fungsi untuk mengirimkan response dengan status 415 Unsupported Media Type
function UnsupportedMediaType($data = null, $message = "Media Type tidak didukung") {
    sendResponse(415, $data, $message);
}

// Fungsi untuk mengirimkan response dengan status 503 Service Unavailable
function ServiceUnavailable($data = null, $message = "Layanan tidak tersedia") {
    sendResponse(503, $data, $message);
}
