

    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <form action="siswaController.php?action=add" method="POST">
                <h3>Data Siswa</h3>
                <label for="username">Username:</label>
                <input type="text" name="username" required><br>
                
                <label for="password">Password:</label>
    <input type="password" name="password" required><br>

    <label for="nama">Nama Siswa:</label>
    <input type="text" name="nama" required><br>

    <label for="nis">NIS:</label>
    <input type="text" name="nis" required><br>

    <label for="kelas">Kelas:</label>
    <input type="text" name="kelas" required><br>

    <label for="jurusan">Jurusan:</label>
    <input type="text" name="jurusan" required><br>

    <label for="jenis_kelamin">Jenis Kelamin:</label>
    <select name="jenis_kelamin" required>
        <option value="Laki-laki">Laki-laki</option>
        <option value="Perempuan">Perempuan</option>
    </select><br>

    <label for="alamat">Alamat Siswa:</label>
    <input type="text" name="alamat" required><br>

    <label for="no_telp">No. Telp:</label>
    <input type="text" name="no_telp" required><br>

    <label for="email">Email:</label>
    <input type="email" name="email" required><br>

    <h3>Data Orang Tua</h3>
    <label for="nama_orangTua">Nama Orang Tua:</label>
    <input type="text" name="nama_orangTua" required><br>

    <label for="telp_orangTua">Telepon Orang Tua:</label>
    <input type="text" name="telp_orangTua" required><br>

    <label for="pekerjaan_orangTua">Pekerjaan Orang Tua:</label>
    <input type="text" name="pekerjaan_orangTua" required><br>

    <label for="alamat_orangTua">Alamat Orang Tua:</label>
    <input type="text" name="alamat_orangTua" required><br>

    <input type="submit" value="Submit">
</form>
</body>
</html>