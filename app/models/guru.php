<?php
require_once '../config/db.php';

class GuruModel {
    private $db;

    public function __construct() {
        $this->db = getDBConnection();
    }

    public function getAllGuru() {
        $stmt = $this->db->prepare("SELECT * FROM guru");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getGuruById($id) {
        $stmt = $this->db->prepare("SELECT * FROM guru WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function addGuru($nama, $kodeGuru, $email, $jenisKelamin, $role) {
        $stmt = $this->db->prepare("INSERT INTO guru (nama, kode_guru, email, jenis_kelamin, role) VALUES (:nama, :kode_guru, :email, :jenis_kelamin, :role)");
        $stmt->bindParam(':nama', $nama);
        $stmt->bindParam(':kode_guru', $kodeGuru);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':jenis_kelamin', $jenisKelamin);
        $stmt->bindParam(':role', $role);
        return $stmt->execute();
    }

    public function updateGuru($id, $nama, $kodeGuru, $email, $jenisKelamin, $role) {
        $stmt = $this->db->prepare("UPDATE guru SET nama = :nama, kode_guru = :kode_guru, email = :email, jenis_kelamin = :jenis_kelamin, role = :role WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':nama', $nama);
        $stmt->bindParam(':kode_guru', $kodeGuru);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':jenis_kelamin', $jenisKelamin);
        $stmt->bindParam(':role', $role);
        return $stmt->execute();
    }

    public function deleteGuru($id) {
        $stmt = $this->db->prepare("UPDATE guru SET deleted_at = NOW() WHERE id = :id");
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
