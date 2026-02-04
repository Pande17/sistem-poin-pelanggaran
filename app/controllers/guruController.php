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
                Success($guru, "Data guru dengan ID $id berhasil diambil");
            } else {
                $guru = $this->model->getAllGuru();
                Success($guru, "Data guru berhasil diambil");
            }
        }
    }

    public function createGuru() {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $nama = $data['nama'];
            $kodeGuru = $data['kode_guru'];
            $email = $data['email'];
            $jenisKelamin = $data['jenis_kelamin'];
            $role = $data['role'];

            $result = $this->model->addGuru($nama, $kodeGuru, $email, $jenisKelamin, $role);
            if ($result) {
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
            $nama = $data['nama'];
            $kodeGuru = $data['kode_guru'];
            $email = $data['email'];
            $jenisKelamin = $data['jenis_kelamin'];
            $role = $data['role'];

            $result = $this->model->updateGuru($id, $nama, $kodeGuru, $email, $jenisKelamin, $role);
            if ($result) {
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
