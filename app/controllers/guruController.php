<?php
require_once '../models/guru.php';

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
                echo json_encode($guru);
            } else {
                $guru = $this->model->getAllGuru();
                echo json_encode($guru);
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
                echo json_encode(['message' => 'Guru added successfully']);
            } else {
                echo json_encode(['message' => 'Failed to add guru']);
            }
        }
    }

    public function updateGuru() {
        if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
            $data = json_decode(file_get_contents("php://input"), true);
            $id = isset($data['id']) ? $data['id'] : (isset($_GET['id']) ? $_GET['id'] : null);
            $nama = $data['nama'];
            $alamat = $data['alamat'];
            $email = $data['email'];

            $result = $this->model->updateGuru($id, $nama, $alamat, $email);
            if ($result) {
                echo json_encode(['message' => 'Guru updated successfully']);
            } else {
                echo json_encode(['message' => 'Failed to update guru']);
            }
        }
    }

    public function deleteGuru() {
        if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
            $data = json_decode(file_get_contents("php://input"), true);
            $id = isset($data['id']) ? $data['id'] : (isset($_GET['id']) ? $_GET['id'] : null);

            $result = $this->model->deleteGuru($id);
            if ($result) {
                echo json_encode(['message' => 'Guru deleted successfully']);
            } else {
                echo json_encode(['message' => 'Failed to delete guru']);
            }
        }
    }
}
