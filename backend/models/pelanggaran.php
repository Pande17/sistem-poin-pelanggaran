<?php
require_once 'config/db.php';

class PelanggaranModel
{
    private $db;

    public function __construct()
    {
        $this->db = getDBConnection();
        $this->checkAndCreateKolomKeterangan();
    }

    private function checkAndCreateKolomKeterangan()
    {
        try {
            // Menambahkan kolom keterangan jika belum ada
            $this->db->exec("ALTER TABLE pelanggaran ADD COLUMN keterangan TEXT DEFAULT NULL");
        }
        catch (PDOException $e) {
        // Error dilewati (biasanya karena kolom sudah ada)
        }
    }

    public function getAllPelanggaran()
    {
        // Query dengan JOIN untuk mendapatkan nama_siswa, kelas, dan nama_pelanggaran
        $query = "
            SELECT 
                p.id, 
                p.id_jenis_pelanggaran, 
                p.id_siswa, 
                p.poin,
                p.keterangan, 
                p.created_by, 
                p.created_at, 
                p.updated_at, 
                p.deleted_at,
                s.nama as nama_siswa,
                s.kelas as kelas,
                jp.nama_pelanggaran as nama_pelanggaran
            FROM pelanggaran p
            LEFT JOIN siswa s ON p.id_siswa = s.id
            LEFT JOIN jenis_pelanggaran jp ON p.id_jenis_pelanggaran = jp.id
            WHERE p.deleted_at IS NULL
            ORDER BY p.created_at DESC
        ";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getPelanggaranById($id)
    {
        $query = "
            SELECT 
                p.id, 
                p.id_jenis_pelanggaran, 
                p.id_siswa, 
                p.poin, 
                p.keterangan,
                p.created_by, 
                p.created_at, 
                p.updated_at, 
                p.deleted_at,
                s.nama as nama_siswa,
                s.kelas as kelas,
                jp.nama_pelanggaran as nama_pelanggaran
            FROM pelanggaran p
            LEFT JOIN siswa s ON p.id_siswa = s.id
            LEFT JOIN jenis_pelanggaran jp ON p.id_jenis_pelanggaran = jp.id
            WHERE p.id = :id AND p.deleted_at IS NULL
        ";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function addPelanggaran($id_jenis_pelanggaran, $id_siswa, $poin, $keterangan, $created_by)
    {
        $stmt = $this->db->prepare("INSERT INTO pelanggaran (id_jenis_pelanggaran, id_siswa, poin, keterangan, created_by, created_at, updated_at) VALUES (:id_jenis_pelanggaran, :id_siswa, :poin, :keterangan, :created_by, NOW(), NOW())");
        $stmt->bindParam(':id_jenis_pelanggaran', $id_jenis_pelanggaran);
        $stmt->bindParam(':id_siswa', $id_siswa);
        $stmt->bindParam(':poin', $poin);
        $stmt->bindParam(':keterangan', $keterangan);
        $stmt->bindParam(':created_by', $created_by);
        return $stmt->execute();
    }

    public function updatePelanggaran($id, $id_jenis_pelanggaran, $id_siswa, $poin, $keterangan)
    {
        $stmt = $this->db->prepare("UPDATE pelanggaran SET id_jenis_pelanggaran = :id_jenis_pelanggaran, id_siswa = :id_siswa, poin = :poin, keterangan = :keterangan, updated_at = NOW() WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':id_jenis_pelanggaran', $id_jenis_pelanggaran);
        $stmt->bindParam(':id_siswa', $id_siswa);
        $stmt->bindParam(':poin', $poin);
        $stmt->bindParam(':keterangan', $keterangan);
        return $stmt->execute();
    }

    public function deletePelanggaran($id)
    {
        $stmt = $this->db->prepare("UPDATE pelanggaran SET deleted_at = NOW() WHERE id = :id");
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
