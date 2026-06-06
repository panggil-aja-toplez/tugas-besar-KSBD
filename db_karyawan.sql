CREATE DATABASE db_karyawan;
USE db_karyawan;

CREATE TABLE `jabatan` (
  `id_jabatan` int NOT NULL AUTO_INCREMENT,
  `nama_jabatan` varchar(50) DEFAULT NULL,
  `gaji_pokok` int DEFAULT NULL,
  PRIMARY KEY (`id_jabatan`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `klien` (
  `id_klien` int NOT NULL AUTO_INCREMENT,
  `nama_klien` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_klien`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `penempatan` (
  `id_kota` int NOT NULL AUTO_INCREMENT,
  `nama_kota` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_kota`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `karyawan` (
  `id_karyawan` varchar(50) NOT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `no_telp` varchar(20) DEFAULT NULL,
  `alamat` varchar(255) DEFAULT NULL,
  `id_jabatan` int DEFAULT NULL,
  `id_klien` int DEFAULT NULL,
  `id_penempatan` int DEFAULT NULL,
  PRIMARY KEY (`id_karyawan`),
  KEY `id_jabatan_idx` (`id_jabatan`),
  CONSTRAINT `id_jabatan` FOREIGN KEY (`id_jabatan`) REFERENCES `jabatan` (`id_jabatan`),
  CONSTRAINT `fk_karyawan_klien` FOREIGN KEY (`id_klien`) REFERENCES `klien` (`id_klien`),
  CONSTRAINT `fk_karyawan_penempatan` FOREIGN KEY (`id_penempatan`) REFERENCES `penempatan` (`id_kota`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `admin` (
  `id_admin` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_admin`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

iNSERT INTO jabatan (nama_jabatan, gaji_pokok) VALUES ('Manager IT', 15000000), ('Staff Developer', 8000000);
INSERT INTO karyawan (nama, email, no_telp, alamat, id_jabatan,) 
VALUES ('Budi Sudarsono', 'budi@email.com', '0812345678', 'Jakarta', 1),
       ('Siti Rahma', 'siti@email.com', '0877654321', 'Tangerang', 2);
