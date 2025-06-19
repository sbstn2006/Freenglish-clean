-- Esquema de Base de Datos PostgreSQL para Freenglish
-- Sistema de Usuarios

-- Crear la base de datos (ejecutar como superusuario)
-- CREATE DATABASE freenglish_db;

-- Conectar a la base de datos
-- \c freenglish_db;

-- Crear esquema
CREATE SCHEMA IF NOT EXISTS freenglish;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS freenglish.user (
    id_user SERIAL PRIMARY KEY,
    name_user VARCHAR(255) NOT NULL,
    email_user VARCHAR(255) UNIQUE NOT NULL,
    password_user VARCHAR(255) NOT NULL
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_user_email ON freenglish.user(email_user);

-- Insertar usuario de prueba
INSERT INTO freenglish.user (name_user, email_user, password_user) 
VALUES (
    'Estudiante Demo', 
    'estudiante@demo.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' -- password: 123456
) ON CONFLICT (email_user) DO NOTHING; 