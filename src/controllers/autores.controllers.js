import { pool } from "../db.js";

const ROLS = {
	EDITOR: 0,
	AUTOR: 1,
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
		const [rows] = await pool.query("SELECT * FROM full_autores WHERE id_autor = ?", [
			req.params.id,
		]);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const getAutorByFilter = async (req, res) => {
	try {
		const [rows] = await pool.query(
			`SELECT * FROM full_autores WHERE ${req.query.filter} = ?`,
			[req.query.filterValue],
		);
		res.json(rows);
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
			[nombres, apellidos, nombreUsuario, nacionalidad, contraseña, email, telefono],
		);
		await pool.query("INSERT INTO autores (id_usuario,seudonimo) VALUES (?,?)", [
			rows.insertId,
			"",
		]);
		res.send({ id: rows.insertId });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
