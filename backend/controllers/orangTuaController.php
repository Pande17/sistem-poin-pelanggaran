<?php
require_once '../models/orangTua.php';
require_once '../helpers/responseHelper.php';

class OrangTuaController {
    private $model;

    public function __construct() {
        $this->model = new OrangTuaModel();
    }

    public function getOrangTua() {
        if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            if ($id) {
                $orangTua = $this->model->getOrangTuaById($id);
                if ($orangTua) {
                    // Jika orang tua dengan ID tersebut ditemukan
                    Success($orangTua, "Data orang tua dengan ID $id berhasil diambil");
                } else {
                    NotFound(null, "Orang tua dengan ID $id tidak ditemukan");
                }
            } else {
                $orangTua = $this->model->getAllOrangTua();
                Success($orangTua, "Data orang tua berhasil diambil");
            }
        }
    }

    public function createOrangTua() {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $nama = $data['nama'];
            $email = $data['email'];
            $telepon = $data['telepon'];
            $alamat = $data['alamat'];

            // Simpan data orang tua menggunakan model
            $result = $this->model->addOrangTua($nama, $email, $telepon, $alamat);

            if ($result) {
                Created($data, 'Data Orang Tua berhasil ditambahkan');
            } else {
                Conflict(null, 'Gagal menambahkan data Orang Tua! Coba lagi.');
            }
        }
    }

    public function updateOrangTua() {
        if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
            $data = json_decode(file_get_contents("php://input"), true);
            $id = isset($data['id']) ? $data['id'] : (isset($_GET['id']) ? $_GET['id'] : null);
            $nama = $data['nama'];
            $email = $data['email'];
            $telepon = $data['telepon'];
            $alamat = $data['alamat'];

            $result = $this->model->updateOrangTua($id, $nama, $email, $telepon, $alamat);

            if ($result) {
                Success($data, "Data Orang Tua dengan ID $id berhasil diupdate");
            } else {
                NotFound(null, "Gagal mengupdate data Orang Tua! Coba lagi.");
            }
        }
    }

    public function deleteOrangTua() {
        if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
            $id = isset($_GET['id']) ? $_GET['id'] : null;

            $result = $this->model->deleteOrangTua($id);

            if ($result) {
                Success(null, "Data Orang Tua dengan ID $id berhasil dihapus");
            } else {
                NotFound(null, "Gagal menghapus data Orang Tua! Coba lagi.");
            }
        }
    }
}
?>