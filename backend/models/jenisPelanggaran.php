<?php
require_once 'config/db.php';

class JenisPelanggaranModel
{
    private $db;

    public function __construct()
    {
        $this->db = getDBConnection();
    }

    public function getAllJenisPelanggaran()
    {
        $stmt = $this->db->prepare("SELECT * FROM jenis_pelanggaran WHERE deleted_at IS NULL");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getJenisPelanggaranById($id)
    {
        $stmt = $this->db->prepare("SELECT id, kode_pelanggaran, nama_pelanggaran, poin, created_at, updated_at, deleted_at FROM jenis_pelanggaran WHERE id = :id AND deleted_at IS NULL");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function addJenisPelanggaran($kodePelanggaran, $namaPelanggaran, $poin)
    {
        $stmt = $this->db->prepare("INSERT INTO jenis_pelanggaran (kode_pelanggaran, nama_pelanggaran, poin, created_at, updated_at) VALUES (:kode_pelanggaran, :nama_pelanggaran, :poin, NOW(), NOW())");
        $stmt->bindParam(':kode_pelanggaran', $kodePelanggaran);
        $stmt->bindParam(':nama_pelanggaran', $namaPelanggaran);
        $stmt->bindParam(':poin', $poin);
        return $stmt->execute();
    }

    public function updateJenisPelanggaran($id, $kodePelanggaran, $namaPelanggaran, $poin)
    {
        $stmt = $this->db->prepare("UPDATE jenis_pelanggaran SET kode_pelanggaran = :kode_pelanggaran, nama_pelanggaran = :nama_pelanggaran, poin = :poin, updated_at = NOW() WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':kode_pelanggaran', $kodePelanggaran);
        $stmt->bindParam(':nama_pelanggaran', $namaPelanggaran);
        $stmt->bindParam(':poin', $poin);
        return $stmt->execute();
    }

    public function deleteJenisPelanggaran($id)
    {
        $stmt = $this->db->prepare("UPDATE jenis_pelanggaran SET deleted_at = NOW() WHERE id = :id");
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
