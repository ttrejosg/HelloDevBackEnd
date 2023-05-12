import { AUTHOR_FILTERS } from "../consts.js";
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
			[req.params.id],
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
			[
				nombres,
				apellidos,
				nombreUsuario,
				nacionalidad,
				contraseña,
				email,
				telefono,
			],
		);
		await pool.query(
			"INSERT INTO autores (id_usuario,seudonimo) VALUES (?,?)",
			[rows.insertId, ""],
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
			[nombres, apellidos, nombreUsuario, telefono, nacionalidad, email, id],
		);

		if (rows.affectedRows === 0) {
			return res.status(404).json({ message: "Autor no encontrado" });
		}

		await pool.query(
			"UPDATE autores SET autobiografia = IFNULL(?, autobiografia) WHERE id_usuario = ?",
			[autobiografia, id],
		);

		const [autor] = await pool.query(
			"SELECT * FROM full_autores WHERE id_usuario = ?",
			[id],
		);

		res.json(autor[0]);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const searchAuthors = async (req, res) => {
	try {
		const { filter, filterValue } = req.body;
		if (filter === AUTHOR_FILTERS.ALL) {
			const [rows] = await pool.query(
				"SELECT * FROM full_autores WHERE nombres LIKE ? OR apellidos LIKE ? OR seudonimo LIKE ? OR email LIKE ? OR telefono LIKE ? OR nacionalidad LIKE ?",
				[
					`%${filterValue}%`,
					`%${filterValue}%`,
					`%${filterValue}%`,
					`%${filterValue}%`,
					`%${filterValue}%`,
					`%${filterValue}%`,
				],
			);
			res.json(rows);
		} else if (
			filter === AUTHOR_FILTERS.NAME ||
			filter === AUTHOR_FILTERS.LASTNAME ||
			filter === AUTHOR_FILTERS.SEUDONIMO ||
			filter === AUTHOR_FILTERS.EMAIL ||
			filter === AUTHOR_FILTERS.TEL ||
			filter === AUTHOR_FILTERS.NATION
		) {
			const [rows] = await pool.query(
				`SELECT * FROM full_autores WHERE ${filter} LIKE ?`,
				[`%${filterValue}%`],
			);
			res.json(rows);
		} else {
			throw new Error("Filtro no valido");
		}
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
