import { readdir, rename, unlink } from "fs/promises";
import multer from "multer";
import { pool } from "../db.js";

const FILES_DEST_DIR = "./uploads/articulos/";
const MIME_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];

/**
 *
 */
export const multerMiddleware = multer({
  storage: multer.diskStorage({
    destination: FILES_DEST_DIR,
    filename: (req, file, cb) => {
      const extension = file.mimetype.split("/")[1];
      cb(null, `${file.fieldname}-${Date.now()}.${extension}`);
    },
  }),

  fileFilter: (req, file, cb) => {
    if (file?.fieldname === "archivo") {
      if (file.mimetype === MIME_TYPES[0]) cb(null, true);
      else cb(new Error("El archivo debe ser un PDF"));
    } else if (file?.fieldname === "portada") {
      if (MIME_TYPES.slice(1).includes(file.mimetype)) cb(null, true);
      else cb(new Error("La portada debe ser una imagen"));
    }
  },
});

const insertFilesUrls = async (rows) => {
  const files = await readdir(FILES_DEST_DIR);

  rows.forEach((row) => {
    let extension;
    for (const file of files) {
      const splittedFile = file.split(".");
      if (splittedFile[0] === row.id.toString() && splittedFile[1] !== "pdf") {
        extension = splittedFile[1];
        break;
      }
    }
    row.portada = `http://localhost:3000/articulos/${row.id}.${extension}`;
    row.archivo = `http://localhost:3000/articulos/${row.id}.pdf`;
  });
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getArticulos = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM full_articulos");
    await insertFilesUrls(rows);
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getArticulosAutor = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "select a.id_articulo as id, a.titulo, a.fecha_creacion, e.nombre as estado from articulos as a, estados as e where id_autor = 1  and a.id_estado = e.id_estado and e.id_estado != 5 and id_articulo not in (select id_articulo_origen from ediciones) union select t1.id_articulo as id,t1.titulo,t1.fecha_creacion,e.nombre as estado from (select * from ediciones as e inner join articulos as a on e.id_edicion = a.id_articulo where id_autor = 1) as t1, (select e1.id_articulo_origen as origen, max(a1.fecha_creacion) as lastEdition from ediciones as e1, articulos as a1 where e1.id_edicion = a1.id_articulo and a1.id_autor = 1 group by origen) as t2, estados as e where t1.id_articulo_origen = t2.origen and t1.id_estado = e.id_estado and e.id_estado != 5 and t1.fecha_creacion = t2.lastEdition",
      [req.params.id, req.params.id, req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Articulo/s no encontrados" });
    await insertFilesUrls(rows);
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getArticuloById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM full_articulos WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Articulo no encontrado" });
    await insertFilesUrls(rows);
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getArticuloBy = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM full_articulos where ${req.query.filter} = ?`,
      [req.query.filterValue]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Articulo no encontrado" });
    await insertFilesUrls(rows);
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//create Articulo Logic

const verifyFiles = async (files) => {
  if (!files.archivo && !files.portada)
    throw new Error("Falta archivo y portada");
  if (!files.archivo) throw new Error("Falta archivo");
  if (!files.portada) throw new Error("Falta portada");
};

const renameFiles = async (files, to) => {
  await rename(
    `${FILES_DEST_DIR}${files.archivo[0].filename}`,
    `${FILES_DEST_DIR}${to}.pdf`
  );
  await rename(
    `${FILES_DEST_DIR}${files.portada[0].filename}`,
    `${FILES_DEST_DIR}${to}.${files.portada[0].mimetype.split("/")[1]}`
  );
};

const deleteFiles = async (files) => {
  if (files.archivo)
    await unlink(`${FILES_DEST_DIR}${files.archivo[0].filename}`);
  if (files.portada)
    await unlink(`${FILES_DEST_DIR}${files.portada[0].filename}`);
};

/**
 *
 * @param {*} req  contiene el body de la petición con los datos del articulo, el archivo y portada.
 * @param {*} res  respuesta que contiene el id del articulo creado.
 * @returns 200 si se creo el articulo, 500 si hubo un error.
 */
export const createArticulo = async (req, res) => {
  try {
    await verifyFiles(req.files);

    const { titulo, resumen } = req.body;

    const [rows] = await pool.query(
      "INSERT INTO articulos (titulo, resumen, fecha_creacion,id_estado,id_autor,fecha_publicación) VALUES (?,?,now(),?,?,?)",
      [titulo, resumen, 1, 1, null]
    );

    if (rows.affectedRows <= 0) throw new Error("No se pudo crear el articulo");

    renameFiles(req.files, rows.insertId);

    res.send({
      id: rows.insertId,
    });
  } catch (error) {
    deleteFiles(req.files);
    return res.status(500).json({ message: error.message });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const deleteArticulo = async (req, res) => {
  try {
    const [result] = await pool.query(
      "UPDATE articulos SET id_estado = 5 WHERE id_articulo = ?",
      [req.params.id]
    );
    if (result.affectedRows <= 0)
      return res.status(404).json({ message: "Articulo no encontrado" });
    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
