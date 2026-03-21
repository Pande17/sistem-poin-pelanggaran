<?php
require_once 'models/pelanggaran.php';
require_once 'models/jenisPelanggaran.php';
require_once 'helpers/responseHelper.php';

class PelanggaranController
{
    private $model;

    public function __construct()
    {
        $this->model = new PelanggaranModel();
    }

    public function getPelanggaran()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            if ($id) {
                $pelanggaran = $this->model->getPelanggaranById($id);
                if ($pelanggaran) {
                    Success($pelanggaran, "Data pelanggaran dengan ID $id berhasil diambil");
                }
                else {
                    NotFound(null, "Pelanggaran dengan ID $id tidak ditemukan");
                }
            }
            else {
                $pelanggaran = $this->model->getAllPelanggaran();
                Success($pelanggaran, "Data pelanggaran berhasil diambil");
            }
        }
    }

    public function createPelanggaran()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);

            if (!isset($data['id_jenis_pelanggaran']) || !isset($data['id_siswa']) || !isset($data['poin'])) {
                BadRequest(null, 'Data tidak lengkap');
                return;
            }

            $id_jenis_pelanggaran = $data['id_jenis_pelanggaran'];
            $id_siswa = $data['id_siswa'];
            $poin = $data['poin'];
            $keterangan = isset($data['keterangan']) ? trim($data['keterangan']) : '';
            $created_by = isset($data['created_by']) ? $data['created_by'] : 1;

            if (empty($keterangan)) {
                $jpModel = new JenisPelanggaranModel();
                $jp = $jpModel->getJenisPelanggaranById($id_jenis_pelanggaran);
                if ($jp) {
                    $keterangan = $jp['nama_pelanggaran'];
                }
            }

            $result = $this->model->addPelanggaran($id_jenis_pelanggaran, $id_siswa, $poin, $keterangan, $created_by);

            if ($result) {
                Created($data, 'Data Pelanggaran berhasil ditambahkan');
            }
            else {
                Conflict(null, 'Gagal menambahkan data Pelanggaran! Coba lagi.');
            }
        }
    }

    public function updatePelanggaran()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
            $data = json_decode(file_get_contents("php://input"), true);
            $id = isset($data['id']) ? $data['id'] : (isset($_GET['id']) ? $_GET['id'] : null);

            if (!$id) {
                BadRequest(null, 'ID tidak ditemukan');
                return;
            }

            $id_jenis_pelanggaran = isset($data['id_jenis_pelanggaran']) ? $data['id_jenis_pelanggaran'] : null;
            $id_siswa = isset($data['id_siswa']) ? $data['id_siswa'] : null;
            $poin = isset($data['poin']) ? $data['poin'] : null;
            $keterangan = isset($data['keterangan']) ? trim($data['keterangan']) : '';

            if (empty($keterangan) && $id_jenis_pelanggaran) {
                $jpModel = new JenisPelanggaranModel();
                $jp = $jpModel->getJenisPelanggaranById($id_jenis_pelanggaran);
                if ($jp) {
                    $keterangan = $jp['nama_pelanggaran'];
                }
            }

            $result = $this->model->updatePelanggaran($id, $id_jenis_pelanggaran, $id_siswa, $poin, $keterangan);

            if ($result) {
                Success($data, 'Data Pelanggaran berhasil diupdate');
            }
            else {
                Conflict(null, 'Gagal mengupdate data Pelanggaran! Coba lagi.');
            }
        }
    }

    public function deletePelanggaran()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
            $data = json_decode(file_get_contents("php://input"), true);
            $id = isset($data['id']) ? $data['id'] : (isset($_GET['id']) ? $_GET['id'] : null);

            if (!$id) {
                BadRequest(null, 'ID tidak ditemukan');
                return;
            }

            $result = $this->model->deletePelanggaran($id);
            if ($result) {
                Success(null, 'Data Pelanggaran berhasil dihapus');
            }
            else {
                Conflict(null, 'Gagal menghapus data Pelanggaran! Coba lagi.');
            }
        }
    }
}
