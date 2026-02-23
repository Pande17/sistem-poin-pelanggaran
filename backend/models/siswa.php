<?php
require_once 'config/db.php';

class SiswaModel {
    private $db;

    public function __construct() {
        $this->db = getDBConnection();
    }

    public function getAllSiswa() {
        $stmt = $this->db->prepare("SELECT * FROM siswa");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getSiswaById($id) {
        $stmt = $this->db->prepare("SELECT * FROM siswa WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function addSiswa($nama, $kodeGuru, $email, $jenisKelamin, $role) {
        $stmt = $this->db->prepare("INSERT INTO guru (nama, kode_guru, email, jenis_kelamin, role) VALUES (:nama, :kode_guru, :email, :jenis_kelamin, :role)");
        $stmt->bindParam(':nama', $nama);
        $stmt->bindParam(':kode_guru', $kodeGuru);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':jenis_kelamin', $jenisKelamin);
        $stmt->bindParam(':role', $role);
        return $stmt->execute();
    }

    public function updateSiswa($id, $nama, $kodeGuru, $email, $jenisKelamin, $role) {
        $stmt = $this->db->prepare("UPDATE guru SET nama = :nama, kode_guru = :kode_guru, email = :email, jenis_kelamin = :jenis_kelamin, role = :role WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':nama', $nama);
        $stmt->bindParam(':kode_guru', $kodeGuru);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':jenis_kelamin', $jenisKelamin);
        $stmt->bindParam(':role', $role);
        return $stmt->execute();
    }

    public function deleteSiswa($id) {
        $stmt = $this->db->prepare("UPDATE guru SET deleted_at = NOW() WHERE id = :id");
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
