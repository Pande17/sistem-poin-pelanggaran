<?php
require_once 'models/siswa.php';
require_once 'helpers/responseHelper.php';

class SiswaController
{
    private $model;

    public function __construct()
    {
        $this->model = new SiswaModel();
    }

    public function getSiswa()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            if ($id) {
                $siswa = $this->model->getSiswaById($id);
                if ($siswa) {
                    Success($siswa, "Data siswa dengan ID $id berhasil diambil");
                }
                else {
                    NotFound(null, "Siswa dengan ID $id tidak ditemukan");
                }
            }
            else {
                $siswa = $this->model->getAllSiswa();
                Success($siswa, "Data siswa berhasil diambil");
            }
        }
    }

    public function createSiswa()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);

            $nama = isset($data['nama']) ? $data['nama'] : '';
            $nis = isset($data['nis']) ? $data['nis'] : '';
            $kelas = isset($data['kelas']) ? $data['kelas'] : '';
            $jurusan = isset($data['jurusan']) ? $data['jurusan'] : '';
            $jenisKelamin = isset($data['jenis_kelamin']) ? $data['jenis_kelamin'] : '';
            $alamat = isset($data['alamat']) ? $data['alamat'] : '';
            $email = isset($data['email']) ? $data['email'] : '';
            $username = isset($data['username']) ? $data['username'] : '';
            $password = isset($data['password']) ? password_hash($data['password'], PASSWORD_DEFAULT) : '';
            $no_telp = isset($data['no_telp']) ? $data['no_telp'] : '';
            $status = isset($data['status']) ? $data['status'] : 'Aktif';
            $ortuData = [
                'nama' => isset($data['ortu_nama']) ? $data['ortu_nama'] : '',
                'hubungan' => isset($data['ortu_hubungan']) ? $data['ortu_hubungan'] : '',
                'no_telp' => isset($data['ortu_no_telp']) ? $data['ortu_no_telp'] : '',
                'pekerjaan' => isset($data['ortu_pekerjaan']) ? $data['ortu_pekerjaan'] : '',
                'alamat' => isset($data['ortu_alamat']) ? $data['ortu_alamat'] : '',
            ];

            if (empty($nama) || empty($nis) || empty($username) || empty($password)) {
                BadRequest(null, 'Data penting belum lengkap (nama, nis, username, password)!');
                return;
            }

            try {
                $result = $this->model->addSiswa($nama, $nis, $kelas, $jurusan, $jenisKelamin, $alamat, $email, $username, $password, $no_telp, $status, $ortuData);
                if ($result) {
                    Created($data, 'Data Siswa berhasil ditambahkan');
                }
                else {
                    Conflict(null, 'Gagal menambahkan data Siswa! Coba lagi.');
                }
            }
            catch (Exception $e) {
                Conflict(null, 'Error: ' . $e->getMessage());
            }
        }
    }

    public function updateSiswa()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
            $data = json_decode(file_get_contents("php://input"), true);
            $id = isset($data['id']) ? $data['id'] : (isset($_GET['id']) ? $_GET['id'] : null);

            $nama = isset($data['nama']) ? $data['nama'] : '';
            $nis = isset($data['nis']) ? $data['nis'] : '';
            $kelas = isset($data['kelas']) ? $data['kelas'] : '';
            $jurusan = isset($data['jurusan']) ? $data['jurusan'] : '';
            $jenisKelamin = isset($data['jenis_kelamin']) ? $data['jenis_kelamin'] : '';
            $alamat = isset($data['alamat']) ? $data['alamat'] : '';
            $email = isset($data['email']) ? $data['email'] : '';
            $username = isset($data['username']) ? $data['username'] : '';
            $password = isset($data['password']) && !empty($data['password']) ? password_hash($data['password'], PASSWORD_DEFAULT) : '';

            $no_telp = isset($data['no_telp']) ? $data['no_telp'] : '';
            $status = isset($data['status']) ? $data['status'] : 'Aktif';
            $id_ortuWali = isset($data['id_ortuWali']) ? $data['id_ortuWali'] : null;
            $ortuData = [
                'nama' => isset($data['ortu_nama']) ? $data['ortu_nama'] : '',
                'hubungan' => isset($data['ortu_hubungan']) ? $data['ortu_hubungan'] : '',
                'no_telp' => isset($data['ortu_no_telp']) ? $data['ortu_no_telp'] : '',
                'pekerjaan' => isset($data['ortu_pekerjaan']) ? $data['ortu_pekerjaan'] : '',
                'alamat' => isset($data['ortu_alamat']) ? $data['ortu_alamat'] : '',
            ];

            if (!$id) {
                BadRequest(null, 'ID Siswa diperlukan');
                return;
            }

            try {
                $result = $this->model->updateSiswa($id, $nama, $nis, $kelas, $jurusan, $jenisKelamin, $alamat, $email, $username, $password, $no_telp, $status, $ortuData, $id_ortuWali);
                if ($result) {
                    Success($data, 'Data Siswa berhasil diupdate');
                }
                else {
                    Conflict(null, 'Gagal mengupdate data Siswa! Coba lagi.');
                }
            }
            catch (Exception $e) {
                Conflict(null, 'Error: ' . $e->getMessage());
            }
        }
    }

    public function deleteSiswa()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
            $data = json_decode(file_get_contents("php://input"), true);
            $id = isset($data['id']) ? $data['id'] : (isset($_GET['id']) ? $_GET['id'] : null);

            if (!$id) {
                BadRequest(null, 'ID Siswa diperlukan');
                return;
            }

            $result = $this->model->deleteSiswa($id);
            if ($result) {
                Success(null, 'Data Siswa berhasil dihapus');
            }
            else {
                Conflict(null, 'Gagal menghapus data Siswa! Coba lagi.');
            }
        }
    }
}
