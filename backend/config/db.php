<?php
// Membuat koneksi
function getDBConnection()
{
    try {
        $host = 'db';
        $dbName = 'poin_pelanggaran_siswa';
        $username = 'root';
        $password = 'root';

        $dsn = "mysql:host=$host;dbname=$dbName;charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];

        $pdo = new PDO($dsn, $username, $password, $options);
        return $pdo;
    }
    catch (PDOException $e) {
        // Jika koneksi gagal, tampilkan pesan error
        echo "Connection failed: " . $e->getMessage();
        exit();
    }
}
?>