import { pool } from "../db.js";
import { readdir } from "fs/promises";

const FILES_DEST_DIR = "./uploads/articulos/";

const insertFilesUrls = async (rows) => {
  const files = await readdir(FILES_DEST_DIR);

  rows.forEach((row) => {
    let extension;
    for (const file of files) {
      const splittedFile = file.split(".");
      if (
        splittedFile[0] === row.id_articulo.toString() &&
        splittedFile[1] !== "pdf"
      ) {
        extension = splittedFile[1];
        break;
      }
    }
    row.portada = `http://localhost:3000/articulos/${row.id_articulo}.${extension}`;
    row.archivo = `http://localhost:3000/articulos/${row.id_articulo}.pdf`;
  });
};

export const getNotificacionesEditorHistorial = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "select * from full_notificaciones where id_emisor = ? and id_estado = 3 or id_estado = 4 pr id_estado = 4 and id_autor = id_receptor order by fecha desc",
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Notificaciones no encontradas" });
    await insertFilesUrls(rows);
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getNotificacionesEditor = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "select * from full_notificaciones where id_receptor = ? and (id_estado = 2 or id_estado = 6) and id_autor = id_emisor order by fecha desc",
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Notificaciones no encontradas" });
    await insertFilesUrls(rows);
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getNotificacionesAutor = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "select * from full_notificaciones where id_receptor = ? and id_autor = id_receptor order by fecha desc",
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Notificaciones no encontradas" });
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const verify = async (body) => {
  const { id_emisor, id_estado } = body;

  if (id_emisor != 10) {
    if (id_estado == 2)
      throw new Error("El articulo ya ha sido enviado a revisión");
    if (id_estado == 3)
      throw new Error("El articulo ya ha sido aceptado/publicado");
    if (id_estado == 5) throw new Error("El articulo ya ha sido eliminado");
    if (id_estado == 6)
      throw new Error("El articulo ha sido revertido, espere revisión");
  }
};

export const createNotificacion = async (req, res) => {
  try {
    await verify(req.body);

    const {
      id_emisor,
      id_receptor,
      mensaje,
      id_articulo_notificacion,
      new_estado,
    } = req.body;

    const [rows] = await pool.query(
      "insert into notificaciones (id_emisor, fecha, id_receptor, leido, mensaje, id_articulo_notificacion) values (?, now(), ?, 0, ?,?)",
      [id_emisor, id_receptor, mensaje, id_articulo_notificacion]
    );

    await pool.query(
      "UPDATE articulos SET id_estado = ? WHERE id_articulo = ?",
      [new_estado, id_articulo_notificacion]
    );

    res.send({
      id: rows.insertId,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const patchEstadoNotificacion = async (req, res) => {
  const { id_emisor, fecha, id_receptor, leido, id_articulo_notificacion } =
    req.body;
  try {
    const [rows] = await pool.query(
      "update notificaciones set leido = ? where id_emisor = ? and fecha = ? and id_receptor = ? and id_articulo_notificacion = ?",
      [leido, id_emisor, fecha, id_receptor, id_articulo_notificacion]
    );
    if (rows.affectedRows === 0)
      return res.status(404).json({ message: "Notificacion no encontrada" });
    res.json({ message: "Notificacion actualizada" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
