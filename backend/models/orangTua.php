<?php
require_once 'config/db.php';

class OrangTuaModel {
    private $db;

    public function __construct() {
        $this->db = getDBConnection();
    }

    public function getAllOrangTua() {
        $stmt = $this->db->prepare("SELECT * FROM orang_tua");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getOrangTuaById($id) {
        $stmt = $this->db->prepare("SELECT * FROM orang_tua WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function addOrangTua($nama, $email, $telepon, $alamat) {
        $stmt = $this->db->prepare("INSERT INTO orang_tua (nama, email, telepon, alamat) VALUES (:nama, :email, :telepon, :alamat)");
        $stmt->bindParam(':nama', $nama);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':telepon', $telepon);
        $stmt->bindParam(':alamat', $alamat);
        return $stmt->execute();
    }

    public function updateOrangTua($id, $nama, $email, $telepon, $alamat) {
        $stmt = $this->db->prepare("UPDATE orang_tua SET nama = :nama, email = :email, telepon = :telepon, alamat = :alamat WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':nama', $nama);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':telepon', $telepon);
        $stmt->bindParam(':alamat', $alamat);
        return $stmt->execute();
    }

    public function deleteOrangTua($id) {
        $stmt = $this->db->prepare("UPDATE orang_tua SET deleted_at = NOW() WHERE id = :id");
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}

?>