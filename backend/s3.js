const AWS = require('aws-sdk');
require('dotenv').config();

// El SDK toma las credenciales automaticamente del IAM Role asignado a la EC2
// No se necesita ninguna clave hardcodeada
const s3 = new AWS.S3();

/**
 * Sube un archivo al bucket S3 bajo el prefijo profesores/
 * @param {Buffer} buffer - Contenido del archivo
 * @param {string} nombreArchivo - Nombre con el que se guardara en S3
 * @param {string} contentType - MIME type del archivo
 */
async function subirArchivo(buffer, nombreArchivo, contentType = 'application/octet-stream') {
    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: `profesores/${nombreArchivo}`,
        Body: buffer,
        ContentType: contentType,
    };
    return s3.upload(params).promise();
}

/**
 * Descarga un archivo del bucket S3
 * @param {string} nombreArchivo - Nombre del archivo en S3
 */
async function obtenerArchivo(nombreArchivo) {
    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: `profesores/${nombreArchivo}`,
    };
    return s3.getObject(params).promise();
}

/**
 * Lista todos los archivos del prefijo profesores/ en S3
 */
async function listarArchivos() {
    const params = {
        Bucket: process.env.S3_BUCKET,
        Prefix: 'profesores/',
    };
    return s3.listObjectsV2(params).promise();
}

module.exports = { subirArchivo, obtenerArchivo, listarArchivos };
