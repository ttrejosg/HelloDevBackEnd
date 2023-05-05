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

export const loginAutor = async (req, res) => {
	try {
		const { email, contraseña } = req.body;
		const [usuarios] = await pool.query(
			"SELECT * FROM usuarios WHERE email = ? AND contraseña = ?",
			[email, contraseña],
		);
		if (usuarios.length === 1) {
			const [autores] = await pool.query(
				"SELECT id_usuario FROM autores WHERE id_usuario = ?",
				[usuarios[0].id_usuario],
			);
			if (autores.length === 1) {
				res.json({
					autenticado: true,
					id: usuarios[0].id_usuario,
					nombres: usuarios[0].nombres,
					rol: ROLS.AUTOR,
				});
			} else {
				const [editores] = await pool.query(
					"SELECT id_usuario FROM editores WHERE id_usuario = ?",
					[usuarios[0].id_usuario],
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
