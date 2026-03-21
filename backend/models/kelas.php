<?php
require_once 'config/db.php';

class KelasModel
{
    private $db;

    public function __construct()
    {
        $this->db = getDBConnection();
    }

    public function getAllKelas()
    {
        $stmt = $this->db->prepare("
            SELECT k.*, g.nama as wali_kelas_nama 
            FROM kelas k
            LEFT JOIN guru g ON k.wali_kelas = g.id
            WHERE k.deleted_at IS NULL
        ");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getKelasById($id)
    {
        $stmt = $this->db->prepare("
            SELECT k.*, g.nama as wali_kelas_nama 
            FROM kelas k
            LEFT JOIN guru g ON k.wali_kelas = g.id
            WHERE k.id = :id AND k.deleted_at IS NULL
        ");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function addKelas($tingkat, $jurusan, $kelas, $wali_kelas)
    {
        $stmt = $this->db->prepare("INSERT INTO kelas (tingkat, jurusan, kelas, wali_kelas) VALUES (:tingkat, :jurusan, :kelas, :wali_kelas)");
        $stmt->bindParam(':tingkat', $tingkat);
        $stmt->bindParam(':jurusan', $jurusan);
        $stmt->bindParam(':kelas', $kelas);
        if ($wali_kelas !== null && $wali_kelas !== '') {
            $stmt->bindParam(':wali_kelas', $wali_kelas);
        }
        else {
            $stmt->bindValue(':wali_kelas', null, PDO::PARAM_NULL);
        }
        return $stmt->execute();
    }

    public function updateKelas($id, $tingkat, $jurusan, $kelas, $wali_kelas)
    {
        $stmt = $this->db->prepare("UPDATE kelas SET tingkat = :tingkat, jurusan = :jurusan, kelas = :kelas, wali_kelas = :wali_kelas, updated_at = NOW() WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':tingkat', $tingkat);
        $stmt->bindParam(':jurusan', $jurusan);
        $stmt->bindParam(':kelas', $kelas);
        if ($wali_kelas !== null && $wali_kelas !== '') {
            $stmt->bindParam(':wali_kelas', $wali_kelas);
        }
        else {
            $stmt->bindValue(':wali_kelas', null, PDO::PARAM_NULL);
        }
        return $stmt->execute();
    }

    public function deleteKelas($id)
    {
        $stmt = $this->db->prepare("UPDATE kelas SET deleted_at = NOW() WHERE id = :id");
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
