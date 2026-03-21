<?php
require_once 'models/kelas.php';
require_once 'helpers/responseHelper.php';

class KelasController
{
    private $model;

    public function __construct()
    {
        $this->model = new KelasModel();
    }

    public function getKelas()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            if ($id) {
                $kelas = $this->model->getKelasById($id);
                if ($kelas) {
                    $kelas['nama_kelas'] = $kelas['tingkat'] . ' ' . $kelas['jurusan'] . ' ' . $kelas['kelas'];
                    Success($kelas, "Data kelas dengan ID $id berhasil diambil");
                }
                else {
                    NotFound(null, "Kelas dengan ID $id tidak ditemukan");
                }
            }
            else {
                $kelas = $this->model->getAllKelas();
                foreach ($kelas as &$k) {
                    $k['nama_kelas'] = $k['tingkat'] . ' ' . $k['jurusan'] . ' ' . $k['kelas'];
                }
                Success($kelas, "Data kelas berhasil diambil");
            }
        }
    }

    public function createKelas()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);

            $tingkat = isset($data['tingkat']) ? $data['tingkat'] : '';
            $jurusan = isset($data['jurusan']) ? $data['jurusan'] : '';
            $kelas = isset($data['kelas']) ? $data['kelas'] : '';
            $wali_kelas = isset($data['wali_kelas']) ? $data['wali_kelas'] : null;

            if (empty($tingkat) || empty($jurusan) || empty($kelas)) {
                BadRequest(null, 'Data penting belum lengkap (tingkat, jurusan, kelas)!');
                return;
            }

            try {
                $result = $this->model->addKelas($tingkat, $jurusan, $kelas, $wali_kelas);
                if ($result) {
                    Created($data, 'Data Kelas berhasil ditambahkan');
                }
                else {
                    Conflict(null, 'Gagal menambahkan data Kelas! Coba lagi.');
                }
            }
            catch (Exception $e) {
                Conflict(null, 'Error: ' . $e->getMessage());
            }
        }
    }

    public function updateKelas()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
            $data = json_decode(file_get_contents("php://input"), true);
            $id = isset($data['id']) ? $data['id'] : (isset($_GET['id']) ? $_GET['id'] : null);

            $tingkat = isset($data['tingkat']) ? $data['tingkat'] : '';
            $jurusan = isset($data['jurusan']) ? $data['jurusan'] : '';
            $kelas = isset($data['kelas']) ? $data['kelas'] : '';
            $wali_kelas = isset($data['wali_kelas']) ? $data['wali_kelas'] : null;

            if (!$id) {
                BadRequest(null, 'ID Kelas diperlukan');
                return;
            }

            try {
                $result = $this->model->updateKelas($id, $tingkat, $jurusan, $kelas, $wali_kelas);
                if ($result) {
                    Success($data, 'Data Kelas berhasil diupdate');
                }
                else {
                    Conflict(null, 'Gagal mengupdate data Kelas! Coba lagi.');
                }
            }
            catch (Exception $e) {
                Conflict(null, 'Error: ' . $e->getMessage());
            }
        }
    }

    public function deleteKelas()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
            $data = json_decode(file_get_contents("php://input"), true);
            $id = isset($data['id']) ? $data['id'] : (isset($_GET['id']) ? $_GET['id'] : null);

            if (!$id) {
                BadRequest(null, 'ID Kelas diperlukan');
                return;
            }

            $result = $this->model->deleteKelas($id);
            if ($result) {
                Success(null, 'Data Kelas berhasil dihapus');
            }
            else {
                Conflict(null, 'Gagal menghapus data Kelas! Coba lagi.');
            }
        }
    }
}
