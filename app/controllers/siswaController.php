<?php
require_once '../models/siswa.php';
require_once '../helpers/responseHelper.php';
require_once 'orangTuaController.php';

class SiswaController {
    private $model;

    public function __construct() {
        $this->model = new SiswaModel();
    }

    public function getSiswa() {
        if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            if ($id) {
                $siswa = $this->model->getSiswaById($id);
                if ($siswa) {
                    // Jika siswa dengan ID tersebut ditemukan
                    Success($siswa, "Data siswa dengan ID $id berhasil diambil");
                } else {
                    // Jika siswa dengan ID tersebut tidak ditemukan
                    NotFound(null, "Siswa dengan ID $id tidak ditemukan");
            } 
            } else {
                // Jika tidak ada ID, ambil semua siswa
                $siswa = $this->model->getAllSiswa();
                Success($siswa, "Data siswa berhasil diambil");
            }
        }
    }

    public function createSiswa() {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {

            // Insert Siswa Data
            $data = json_decode(file_get_contents("php://input"), true);
            $nama = $data['nama'];
            $nis = $data['nis'];
            $kelas = $data['kelas'];
            $jurusan = $data['jurusan'];
            $jenisKelamin = $data['jenis_kelamin'];
            $alamat = $data['alamat'];
            $email = $data['email'];
            $role = $data['role'];

            $result = $this->model->addSiswa($nama, $kodeGuru, $email, $jenisKelamin, $role);
            if ($result) {
                Created($data, 'Data Siswa berhasil ditambahkan');
            } else {
                Conflict(null, 'Gagal menambahkan data Siswa! Coba lagi.');
            }
        }
    }

    public function updateSiswa() {
        if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
            $data = json_decode(file_get_contents("php://input"), true);
            $id = isset($data['id']) ? $data['id'] : (isset($_GET['id']) ? $_GET['id'] : null);
            $nama = $data['nama'];
            $kodeGuru = $data['kode_guru'];
            $email = $data['email'];
            $jenisKelamin = $data['jenis_kelamin'];
            $role = $data['role'];

            $result = $this->model->updateSiswa($id, $nama, $kodeGuru, $email, $jenisKelamin, $role);
            if ($result) {
                Success($data, 'Data Siswa berhasil diupdate');
            } else {
                Conflict(null, 'Gagal mengupdate data Siswa! Coba lagi.');
            }
        }
    }

    public function deleteSiswa() {
        if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
            $data = json_decode(file_get_contents("php://input"), true);
            $id = isset($data['id']) ? $data['id'] : (isset($_GET['id']) ? $_GET['id'] : null);

            $result = $this->model->deleteSiswa($id);
            if ($result) {
                Success(null, 'Data Siswa berhasil dihapus');
            } else {
                Conflict(null, 'Gagal menghapus data Siswa! Coba lagi.');
            }
        }
    }
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <form action="siswaController.php?action=add" method="POST">
    <h3>Data Siswa</h3>
    <label for="username">Username:</label>
    <input type="text" name="username" required><br>

    <label for="password">Password:</label>
    <input type="password" name="password" required><br>

    <label for="nama">Nama Siswa:</label>
    <input type="text" name="nama" required><br>

    <label for="nis">NIS:</label>
    <input type="text" name="nis" required><br>

    <label for="kelas">Kelas:</label>
    <input type="text" name="kelas" required><br>

    <label for="jurusan">Jurusan:</label>
    <input type="text" name="jurusan" required><br>

    <label for="jenis_kelamin">Jenis Kelamin:</label>
    <select name="jenis_kelamin" required>
        <option value="Laki-laki">Laki-laki</option>
        <option value="Perempuan">Perempuan</option>
    </select><br>

    <label for="alamat">Alamat Siswa:</label>
    <input type="text" name="alamat" required><br>

    <label for="no_telp">No. Telp:</label>
    <input type="text" name="no_telp" required><br>

    <label for="email">Email:</label>
    <input type="email" name="email" required><br>

    <h3>Data Orang Tua</h3>
    <label for="nama_orangTua">Nama Orang Tua:</label>
    <input type="text" name="nama_orangTua" required><br>

    <label for="telp_orangTua">Telepon Orang Tua:</label>
    <input type="text" name="telp_orangTua" required><br>

    <label for="pekerjaan_orangTua">Pekerjaan Orang Tua:</label>
    <input type="text" name="pekerjaan_orangTua" required><br>

    <label for="alamat_orangTua">Alamat Orang Tua:</label>
    <input type="text" name="alamat_orangTua" required><br>

    <input type="submit" value="Submit">
</form>
</body>
</html>

