import { pool } from "../db.js";

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
		const { nombres, apellidos, nombre_usuario, contraseña, email, telefono } = req.body;
		const [rows] = await pool.query(
			"INSERT INTO autores (nombres, apellidos, nombre_usuario, contraseña, email, fecha_registro, telefono) VALUES (?,?,?,?,?,now(),?)",
			[nombres, apellidos, nombre_usuario, contraseña, email, telefono],
		);
		res.send({
			id: rows.insertId,
		});
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
