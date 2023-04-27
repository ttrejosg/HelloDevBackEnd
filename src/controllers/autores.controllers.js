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
