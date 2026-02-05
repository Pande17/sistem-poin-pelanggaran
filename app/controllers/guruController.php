<?php
require_once '../models/guru.php';
require_once '../helpers/responseHelper.php';

class GuruController {
    private $model;

    public function __construct() {
        $this->model = new GuruModel();
    }

    public function getGuru() {
        if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            if ($id) {
                $guru = $this->model->getGuruById($id);
                if ($guru) {
                    // Jika guru dengan ID tersebut ditemukan
                    Success($guru, "Data guru dengan ID $id berhasil diambil");
                } else {
                    NotFound(null, "Guru dengan ID $id tidak ditemukan");
                }
            } else {
                $guru = $this->model->getAllGuru();
                Success($guru, "Data guru berhasil diambil");
            }
        }
    }

    public function createGuru() {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $username = $data['username'];
            $password = $data['password'];
            $nama = $data['nama'];
            $kodeGuru = $data['kode_guru'];
            $email = $data['email'];
            $jenisKelamin = $data['jenis_kelamin'];
            $role = $data['role'];

            // Hash password sebelum disimpan
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            // Simpan data guru menggunakan model
            $result = $this->model->addGuru($username, $hashedPassword, $nama, $kodeGuru, $email, $jenisKelamin, $role);

            if ($result) {
                // Return data dengan password yang sudah di-hash
                $data['password'] = $hashedPassword;
                Created($data, 'Data Guru berhasil ditambahkan');
            } else {
                Conflict(null, 'Gagal menambahkan data Guru! Coba lagi.');
            }
        }
    }

    public function updateGuru() {
        if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
            $data = json_decode(file_get_contents("php://input"), true);
            $id = isset($data['id']) ? $data['id'] : (isset($_GET['id']) ? $_GET['id'] : null);
            $username = $data['username'];
            $password = $data['password'];
            $nama = $data['nama'];
            $kodeGuru = $data['kode_guru'];
            $email = $data['email'];
            $jenisKelamin = $data['jenis_kelamin'];
            $role = $data['role'];

            // Hash password sebelum disimpan
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            // Simpan data guru menggunakan model
            $result = $this->model->updateGuru($id, $username, $password, $nama, $kodeGuru, $email, $jenisKelamin, $role);

            if ($result) {
                // Return data dengan password yang sudah di-hash
                $data['password'] = $hashedPassword;
                Success($data, 'Data Guru berhasil diupdate');
            } else {
                Conflict(null, 'Gagal mengupdate data Guru! Coba lagi.');
            }
        }
    }

    public function deleteGuru() {
        if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
            $data = json_decode(file_get_contents("php://input"), true);
            $id = isset($data['id']) ? $data['id'] : (isset($_GET['id']) ? $_GET['id'] : null);

            $result = $this->model->deleteGuru($id);
            if ($result) {
                Success(null, 'Data Guru berhasil dihapus');
            } else {
                Conflict(null, 'Gagal menghapus data Guru! Coba lagi.');
            }
        }
    }
}
