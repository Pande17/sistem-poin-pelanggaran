<?php
require_once 'models/siswa.php';
require_once 'helpers/responseHelper.php';
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

            // $result = $this->model->addSiswa($nama, $kodeGuru, $email, $jenisKelamin, $role);
            // if ($result) {
            //     Created($data, 'Data Siswa berhasil ditambahkan');
            // } else {
            //     Conflict(null, 'Gagal menambahkan data Siswa! Coba lagi.');
            // }
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
