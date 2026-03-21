<?php
require_once 'models/jenisPelanggaran.php';
require_once 'helpers/responseHelper.php';

class JenisPelanggaranController
{
    private $model;

    public function __construct()
    {
        $this->model = new JenisPelanggaranModel();
    }

    public function getJenisPelanggaran()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            if ($id) {
                $jenis = $this->model->getJenisPelanggaranById($id);
                if ($jenis) {
                    Success($jenis, "Data jenis pelanggaran dengan ID $id berhasil diambil");
                }
                else {
                    NotFound(null, "Jenis pelanggaran dengan ID $id tidak ditemukan");
                }
            }
            else {
                $jenis = $this->model->getAllJenisPelanggaran();
                Success($jenis, "Data jenis pelanggaran berhasil diambil");
            }
        }
    }

    public function createJenisPelanggaran()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);

            if (!isset($data['kode_pelanggaran']) || !isset($data['nama_pelanggaran']) || !isset($data['poin'])) {
                BadRequest(null, 'Data tidak lengkap');
                return;
            }

            $kodePelanggaran = $data['kode_pelanggaran'];
            $namaPelanggaran = $data['nama_pelanggaran'];
            $poin = $data['poin'];

            $result = $this->model->addJenisPelanggaran($kodePelanggaran, $namaPelanggaran, $poin);

            if ($result) {
                Created($data, 'Data Jenis Pelanggaran berhasil ditambahkan');
            }
            else {
                Conflict(null, 'Gagal menambahkan data Jenis Pelanggaran! Coba lagi.');
            }
        }
    }

    public function updateJenisPelanggaran()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
            $data = json_decode(file_get_contents("php://input"), true);
            $id = isset($data['id']) ? $data['id'] : (isset($_GET['id']) ? $_GET['id'] : null);

            if (!$id) {
                BadRequest(null, 'ID tidak ditemukan');
                return;
            }

            $kodePelanggaran = isset($data['kode_pelanggaran']) ? $data['kode_pelanggaran'] : null;
            $namaPelanggaran = isset($data['nama_pelanggaran']) ? $data['nama_pelanggaran'] : null;
            $poin = isset($data['poin']) ? $data['poin'] : null;

            $result = $this->model->updateJenisPelanggaran($id, $kodePelanggaran, $namaPelanggaran, $poin);

            if ($result) {
                Success($data, 'Data Jenis Pelanggaran berhasil diupdate');
            }
            else {
                Conflict(null, 'Gagal mengupdate data Jenis Pelanggaran! Coba lagi.');
            }
        }
    }

    public function deleteJenisPelanggaran()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
            $data = json_decode(file_get_contents("php://input"), true);
            $id = isset($data['id']) ? $data['id'] : (isset($_GET['id']) ? $_GET['id'] : null);

            if (!$id) {
                BadRequest(null, 'ID tidak ditemukan');
                return;
            }

            $result = $this->model->deleteJenisPelanggaran($id);
            if ($result) {
                Success(null, 'Data Jenis Pelanggaran berhasil dihapus');
            }
            else {
                Conflict(null, 'Gagal menghapus data Jenis Pelanggaran! Coba lagi.');
            }
        }
    }
}