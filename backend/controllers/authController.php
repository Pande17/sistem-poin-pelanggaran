<?php
require_once '/../helpers/responHelper.php';
require_once '/../helpers/token.php';

class authController {
    public static function login() {
    $input = json_decode(file_get_contents("php://input"), true);

        if (!$input) {
            BadRequest(null, "Input tidak valid");
        }

        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';

        if (!$username || !$password) {
            BadRequest(null, "Username dan password wajib diisi");
        }

        global $pdo;

        // CEK KE TABEL GURU
        $stmt = $pdo->prepare("SELECT * FROM guru WHERE username=? AND deleted_at IS NULL");
        $stmt->execute([$username]);
        $guru = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($guru && $guru['password'] === $password) {
            $token = Token::generate([
                "id"   => $guru['id'],
                "role" => $guru['role'], // admin | guru | bk
                "type" => "guru"
            ]);

            Success([
                "status" => true,
                "message" => "Login berhasil",
                "token" => $token,
                "user" => [
                    "id" => $guru['id'],
                    "nama" => $guru['nama'],
                    "username" => $guru['username'],
                    "email" => $guru['email'],
                    "role" => $guru['role'], // admin | guru | bk
                    "type" => "guru"
                ]
            ]);
        }

        // CEK KE TABEL SISWA
        $stmt = $pdo->prepare("SELECT * FROM siswa WHERE username=? AND deleted_at IS NULL");
        $stmt->execute([$username]);
        $siswa = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($siswa && $siswa['password'] === $password) {
            $token = Token::generate([
                "id"   => $siswa['id'],
                "role" => "siswa",
                "type" => "siswa"
            ]);

            Success([
                "status" => true,
                "message" => "Login berhasil",
                "token" => $token,
                "user" => [
                    "id" => $siswa['id'],
                    "nama" => $siswa['nama'],
                    "username" => $siswa['username'],
                    "email" => $siswa['email'],
                    "role" => "siswa",
                    "type" => "siswa"
                ]
            ]);
        }

        NotAuthorized(null, "Username atau password salah");
    }

    public static function logout() {
        // stateless JWT → FE cukup hapus token
        Success(null, "Logout berhasil");
    }
}

?>