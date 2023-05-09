import { pool } from "../db.js";

const ROLS = {
  EDITOR: 0,
  AUTOR: 1,
};

const verifyInputs = async (body) => {
  const { nombres, apellidos, nombreUsuario, telefono, nacionalidad, email } =
    body;

  if (!nombres || nombres === "")
    throw new Error("El campo nombres es obligatorio");
  if (!apellidos || apellidos === "")
    throw new Error("El campo apellidos es obligatorio");
  if (!nombreUsuario || nombreUsuario === "")
    throw new Error("El campo nombre de usuario es obligatorio");
  if (!telefono || telefono === "")
    throw new Error("El campo telefono es obligatorio");
  if (!nacionalidad || nacionalidad === "")
    throw new Error("El campo nacionalidad es obligatorio");
  if (!email || email === "") throw new Error("El campo email es obligatorio");
};

export const getAutores = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM full_autores");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAutorById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM full_autores WHERE id_usuario = ?",
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAutorByFilter = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM full_autores WHERE ${req.query.filter} = ?`,
      [req.query.filterValue]
    );
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginAutor = async (req, res) => {
  try {
    const { email, contraseña } = req.body;
    const [usuarios] = await pool.query(
      "SELECT * FROM usuarios WHERE (email = ? or nombre_usuario = ?) AND contraseña = ?",
      [email, email, contraseña]
    );
    if (usuarios.length === 1) {
      const [autores] = await pool.query(
        "SELECT * FROM autores WHERE id_usuario = ?",
        [usuarios[0].id_usuario]
      );
      if (autores.length === 1) {
        res.json({
          autenticado: true,
          id: usuarios[0].id_usuario,
          nombres: usuarios[0].nombres,
          apellidos: usuarios[0].apellidos,
          nombreUsuario: usuarios[0].nombre_usuario,
          nacionalidad: usuarios[0].nacionalidad,
          telefono: usuarios[0].telefono,
          email: usuarios[0].email,
          autobiografia: autores[0].autobiografia,
          rol: ROLS.AUTOR,
        });
      } else {
        const [editores] = await pool.query(
          "SELECT id_editor FROM editores WHERE id_editor = ?",
          [usuarios[0].id_usuario]
        );
        if (editores.length === 1) {
          res.json({
            autenticado: true,
            id: usuarios[0].id_usuario,
            nombres: usuarios[0].nombres,
            rol: ROLS.EDITOR,
          });
        } else {
          res.json({
            autenticado: false,
          });
        }
      }
    } else {
      res.json({
        autenticado: false,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const createAutor = async (req, res) => {
  try {
    const {
      nombres,
      apellidos,
      nombreUsuario,
      nacionalidad,
      telefono,
      email,
      contraseña,
    } = req.body;
    const [rows] = await pool.query(
      "INSERT INTO usuarios (nombres, apellidos, nombre_usuario, nacionalidad, contraseña, email, fecha_registro, telefono) VALUES (?,?,?,?,?,?,now(),?)",
      [
        nombres,
        apellidos,
        nombreUsuario,
        nacionalidad,
        contraseña,
        email,
        telefono,
      ]
    );
    await pool.query(
      "INSERT INTO autores (id_usuario,seudonimo) VALUES (?,?)",
      [rows.insertId, ""]
    );
    res.send({ id: rows.insertId });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const patchAutor = async (req, res) => {
  try {
    await verifyInputs(req.body);

    const { id } = req.params;
    const {
      nombres,
      apellidos,
      nombreUsuario,
      telefono,
      nacionalidad,
      email,
      autobiografia,
    } = req.body;

    const [rows] = await pool.query(
      "UPDATE usuarios SET nombres = IFNULL(?, nombres), apellidos = IFNULL(?, apellidos), nombre_usuario = IFNULL(?, nombre_usuario), telefono = IFNULL(?, telefono), nacionalidad = IFNULL(?, nacionalidad), email = IFNULL(?, email) WHERE id_usuario = ?",
      [nombres, apellidos, nombreUsuario, telefono, nacionalidad, email, id]
    );

    if (rows.affectedRows === 0) {
      return res.status(404).json({ message: "Autor no encontrado" });
    }

    await pool.query(
      "UPDATE autores SET autobiografia = IFNULL(?, autobiografia) WHERE id_usuario = ?",
      [autobiografia, id]
    );

    const [autor] = await pool.query(
      "SELECT * FROM full_autores WHERE id_usuario = ?",
      [id]
    );

    res.json(autor[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
