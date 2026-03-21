<?php
require_once 'config/db.php';

class SiswaModel
{
    private $db;

    public function __construct()
    {
        $this->db = getDBConnection();
    }

    public function getAllSiswa()
    {
        $stmt = $this->db->prepare("
            SELECT s.*, 
                   o.nama as ortu_nama, o.hubungan as ortu_hubungan, o.no_telp as ortu_no_telp, o.pekerjaan as ortu_pekerjaan, o.alamat as ortu_alamat,
                   (SELECT IFNULL(SUM(poin), 0) FROM pelanggaran WHERE id_siswa = s.id AND deleted_at IS NULL) as total_poin 
            FROM siswa s 
            LEFT JOIN ortu_wali o ON s.id_ortuWali = o.id
            WHERE s.deleted_at IS NULL
        ");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getSiswaById($id)
    {
        $stmt = $this->db->prepare("
            SELECT s.*, 
                   o.nama as ortu_nama, o.hubungan as ortu_hubungan, o.no_telp as ortu_no_telp, o.pekerjaan as ortu_pekerjaan, o.alamat as ortu_alamat,
                   (SELECT IFNULL(SUM(poin), 0) FROM pelanggaran WHERE id_siswa = s.id AND deleted_at IS NULL) as total_poin 
            FROM siswa s 
            LEFT JOIN ortu_wali o ON s.id_ortuWali = o.id
            WHERE s.id = :id AND s.deleted_at IS NULL
        ");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function addSiswa($nama, $nis, $kelas, $jurusan, $jenisKelamin, $alamat, $email, $username, $password, $no_telp, $status, $ortuData)
    {
        try {
            $this->db->beginTransaction();
            $idOrtuWali = null;
            if (!empty($ortuData['nama'])) {
                $stmtOrtu = $this->db->prepare("INSERT INTO ortu_wali (nama, hubungan, no_telp, pekerjaan, alamat) VALUES (:nama, :hubungan, :no_telp, :pekerjaan, :alamat)");
                $stmtOrtu->execute([
                    ':nama' => $ortuData['nama'],
                    ':hubungan' => $ortuData['hubungan'] ?? '',
                    ':no_telp' => $ortuData['no_telp'] ?? '',
                    ':pekerjaan' => $ortuData['pekerjaan'] ?? '',
                    ':alamat' => $ortuData['alamat'] ?? ''
                ]);
                $idOrtuWali = $this->db->lastInsertId();
            }

            $stmt = $this->db->prepare("INSERT INTO siswa (nama, nis, kelas, jurusan, jenis_kelamin, alamat, email, username, password, no_telp, status, id_ortuWali, poin) VALUES (:nama, :nis, :kelas, :jurusan, :jenis_kelamin, :alamat, :email, :username, :password, :no_telp, :status, :id_ortuWali, 0)");
            $stmt->bindParam(':nama', $nama);
            $stmt->bindParam(':nis', $nis);
            $stmt->bindParam(':kelas', $kelas);
            $stmt->bindParam(':jurusan', $jurusan);
            $stmt->bindParam(':jenis_kelamin', $jenisKelamin);
            $stmt->bindParam(':alamat', $alamat);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':password', $password);
            $stmt->bindParam(':no_telp', $no_telp);
            $stmt->bindParam(':status', $status);
            $stmt->bindParam(':id_ortuWali', $idOrtuWali);
            $stmt->execute();

            $this->db->commit();
            return true;
        }
        catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    public function updateSiswa($id, $nama, $nis, $kelas, $jurusan, $jenisKelamin, $alamat, $email, $username, $password, $no_telp, $status, $ortuData, $id_ortuWali)
    {
        try {
            $this->db->beginTransaction();

            if (!empty($id_ortuWali)) {
                $stmtOrtu = $this->db->prepare("UPDATE ortu_wali SET nama = :nama, hubungan = :hubungan, no_telp = :no_telp, pekerjaan = :pekerjaan, alamat = :alamat, updated_at = NOW() WHERE id = :id");
                $stmtOrtu->execute([
                    ':nama' => $ortuData['nama'] ?? '',
                    ':hubungan' => $ortuData['hubungan'] ?? '',
                    ':no_telp' => $ortuData['no_telp'] ?? '',
                    ':pekerjaan' => $ortuData['pekerjaan'] ?? '',
                    ':alamat' => $ortuData['alamat'] ?? '',
                    ':id' => $id_ortuWali
                ]);
            }
            else if (!empty($ortuData['nama'])) {
                $stmtOrtu = $this->db->prepare("INSERT INTO ortu_wali (nama, hubungan, no_telp, pekerjaan, alamat) VALUES (:nama, :hubungan, :no_telp, :pekerjaan, :alamat)");
                $stmtOrtu->execute([
                    ':nama' => $ortuData['nama'],
                    ':hubungan' => $ortuData['hubungan'] ?? '',
                    ':no_telp' => $ortuData['no_telp'] ?? '',
                    ':pekerjaan' => $ortuData['pekerjaan'] ?? '',
                    ':alamat' => $ortuData['alamat'] ?? ''
                ]);
                $id_ortuWali = $this->db->lastInsertId();
            }

            // Build query dynamically based on whether password is provided
            if (!empty($password)) {
                $stmt = $this->db->prepare("UPDATE siswa SET nama = :nama, nis = :nis, kelas = :kelas, jurusan = :jurusan, jenis_kelamin = :jenis_kelamin, alamat = :alamat, email = :email, username = :username, password = :password, no_telp = :no_telp, status = :status, id_ortuWali = :id_ortuWali, updated_at = NOW() WHERE id = :id");
                $stmt->bindParam(':password', $password);
            }
            else {
                $stmt = $this->db->prepare("UPDATE siswa SET nama = :nama, nis = :nis, kelas = :kelas, jurusan = :jurusan, jenis_kelamin = :jenis_kelamin, alamat = :alamat, email = :email, username = :username, no_telp = :no_telp, status = :status, id_ortuWali = :id_ortuWali, updated_at = NOW() WHERE id = :id");
            }
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':nama', $nama);
            $stmt->bindParam(':nis', $nis);
            $stmt->bindParam(':kelas', $kelas);
            $stmt->bindParam(':jurusan', $jurusan);
            $stmt->bindParam(':jenis_kelamin', $jenisKelamin);
            $stmt->bindParam(':alamat', $alamat);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':no_telp', $no_telp);
            $stmt->bindParam(':status', $status);
            $stmt->bindParam(':id_ortuWali', $id_ortuWali);
            $stmt->execute();

            $this->db->commit();
            return true;
        }
        catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    public function deleteSiswa($id)
    {
        $stmt = $this->db->prepare("UPDATE siswa SET deleted_at = NOW() WHERE id = :id");
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
