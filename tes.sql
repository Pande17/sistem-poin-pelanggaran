CREATE TABLE guru (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50),
  password VARCHAR(255),
  nama VARCHAR(100) NOT NULL,
  kode_guru VARCHAR(20) NOT NULL,
  jenis_kelamin VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

CREATE TABLE ortu_wali (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama VARCHAR(100),
  hubungan VARCHAR(50),
  no_telp VARCHAR(20),
  pekerjaan VARCHAR(100),
  alamat VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

CREATE TABLE siswa (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50),
  password VARCHAR(255),
  nama VARCHAR(100) NOT NULL,
  nis INT NOT NULL,
  kelas VARCHAR(20) NOT NULL,
  jurusan VARCHAR(50) NOT NULL,
  jenis_kelamin VARCHAR(20) NOT NULL,
  alamat VARCHAR(255) NOT NULL,
  no_telp VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  id_ortuWali INT,
  poin INT NOT NULL,
  status VARCHAR(20) DEFAULT 'Aktif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

CREATE TABLE kelas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tingkat VARCHAR(10),
    jurusan VARCHAR(50),
    kelas VARCHAR(50),
    wali_kelas INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
)

CREATE TABLE jenis_pelanggaran (
  id INT PRIMARY KEY AUTO_INCREMENT,
  kode_pelanggaran VARCHAR(20),
  nama_pelanggaran VARCHAR(100),
  poin INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

CREATE TABLE pelanggaran (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_jenis_pelanggaran INT,
  id_siswa INT,
  poin INT,
  keterangan VARCHAR(255),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

CREATE TABLE surat (
  id INT PRIMARY KEY AUTO_INCREMENT,
  jenis_surat VARCHAR(50),
  nomor_surat VARCHAR(50),
  tanggal_surat DATE,
  id_siswa INT,
  keterangan VARCHAR(255),
  deskripsi VARCHAR(255),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

CREATE TABLE laporan (
  id INT PRIMARY KEY AUTO_INCREMENT,
  jenis_laporan VARCHAR(50),
  id_surat INT,
  keterangan VARCHAR(255),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

INSERT INTO guru (username, password, nama, kode_guru, jenis_kelamin, email, role)
VALUES
('guru1','pass1','Budi Santoso','GR001','Laki-laki','budi@guru.sch.id','admin'),
('guru2','pass2','Siti Aminah','GR002','Perempuan','siti@guru.sch.id','guru'),
('guru3','pass3','Ahmad Fauzi','GR003','Laki-laki','ahmad@guru.sch.id','guru'),
('guru4','pass4','Rina Lestari','GR004','Perempuan','rina@guru.sch.id','guru'),
('guru5','pass5','Dedi Pratama','GR005','Laki-laki','dedi@guru.sch.id','bk');

INSERT INTO ortu_wali (nama, hubungan, no_telp, pekerjaan, alamat)
VALUES
('Andi Wijaya','Ayah','081234567001','Wiraswasta','Jakarta'),
('Slamet Riyadi','Ayah','081234567002','Petani','Bogor'),
('Rudi Hartono','Ayah','081234567003','Karyawan Swasta','Depok'),
('Agus Salim','Ayah','081234567004','PNS','Bekasi'),
('Joko Susilo','Wali','081234567005','Pedagang','Tangerang');

INSERT INTO siswa 
(username, password, nama, nis, kelas, jurusan, jenis_kelamin, alamat, no_telp, email, id_ortuWali, poin, status)
VALUES
('siswa1','pass1','Aldi Prakoso',1001,'X RPL 2','RPL','Laki-laki','Jakarta','0811111111','aldi@siswa.sch.id',1,0,'Aktif'),
('siswa2','pass2','Nina Sari',1002,'XI RPL 1','RPL','Perempuan','Bogor','0811111112','nina@siswa.sch.id',2,10,'Aktif'),
('siswa3','pass3','Rizky Maulana',1003,'XII TKJ 1','TKJ','Laki-laki','Depok','0811111113','rizky@siswa.sch.id',3,20,'Aktif'),
('siswa4','pass4','Dewi Anggraini',1004,'X TKJ 2','TKJ','Perempuan','Bekasi','0811111114','dewi@siswa.sch.id',4,5,'Aktif'),
('siswa5','pass5','Fajar Nugroho',1005,'XI RPL 2','RPL','Laki-laki','Tangerang','0811111115','fajar@siswa.sch.id',5,15,'Aktif');

INSERT INTO kelas 
(tingkat, jurusan, kelas, wali_kelas)
VALUES
('X','RPL','1',1),
('XI','RPL','2',2),
('XII','TKJ','3',3),
('X','TKJ','4',4),
('XI','RPL','5',5);

INSERT INTO jenis_pelanggaran 
(kode_pelanggaran, nama_pelanggaran, poin)
VALUES
('PL001','Terlambat',5),
('PL002','Tidak memakai seragam',10),
('PL003','Membolos',20),
('PL004','Merokok',30),
('PL005','Berkelahi',50);

INSERT INTO pelanggaran 
(id_jenis_pelanggaran, id_siswa, poin, keterangan, created_by)
VALUES
(1,1,5,'Datang terlambat',1),
(2,2,10,'Seragam tidak lengkap',2),
(3,3,20,'Tidak masuk tanpa keterangan',3),
(1,4,5,'Terlambat apel',4),
(4,5,30,'Merokok di lingkungan sekolah',5);

INSERT INTO surat 
(jenis_surat, nomor_surat, tanggal_surat, id_siswa, keterangan, deskripsi, created_by)
VALUES
('Peringatan','SP-001','2025-01-10',1,'Terlambat berulang', 'Siswa terlambat lebih dari 3 kali dalam seminggu',1),
('Peringatan','SP-002','2025-01-11',2,'Seragam tidak sesuai','Siswa tidak memakai seragam lengkap',2),
('Pemanggilan','SP-003','2025-01-12',3,'Membolos','Siswa tidak masuk tanpa keterangan selama 3 hari berturut-turut',3),
('Peringatan','SP-004','2025-01-13',4,'Disiplin waktu','Siswa terlambat pada kegiatan apel pagi hari',4),
('Skorsing','SP-005','2025-01-14',5,'Merokok','Siswa melakukan kegiatan merokok di lingkungan sekolah.',5);

INSERT INTO laporan 
(jenis_laporan, id_surat, keterangan, created_by)
VALUES
('Harian',1,'Laporan pelanggaran ringan',1),
('Harian',2,'Laporan seragam',2),
('Bulanan',3,'Pelanggaran berat',3),
('Harian',4,'Disiplin siswa',4),
('Khusus',5,'Kasus skorsing',5);

ALTER TABLE pelanggaran
ADD CONSTRAINT fk_pelanggaran_jenis_pelanggaran
FOREIGN KEY (id_jenis_pelanggaran) REFERENCES jenis_pelanggaran(id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE pelanggaran
ADD CONSTRAINT fk_pelanggaran_siswa
FOREIGN KEY (id_siswa) REFERENCES siswa(id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE siswa
ADD CONSTRAINT fk_siswa_orang_tua
FOREIGN KEY (id_orangTua) REFERENCES ortu_wali(id)
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE surat
ADD CONSTRAINT fk_surat_siswa
FOREIGN KEY (id_siswa) REFERENCES siswa(id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE laporan
ADD CONSTRAINT fk_laporan_surat
FOREIGN KEY (id_surat) REFERENCES surat(id)
ON DELETE CASCADE
ON UPDATE CASCADE;