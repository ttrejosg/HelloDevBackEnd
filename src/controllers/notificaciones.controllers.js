import { pool } from "../db.js";

export const getNotificacionesEditorHistorial = async (req, res) => {
	try {
		const [rows] = await pool.query(
			"select * from full_notificaciones where id_emisor = ? and id_estado = 3 or id_estado = 4 and id_autor = id_receptor",
			[req.params.id],
		);
		if (rows.length === 0)
			return res.status(404).json({ message: "Notificaciones no encontradas" });
		res.json(rows);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const getNotificacionesEditor = async (req, res) => {
	try {
		const [rows] = await pool.query(
			"select * from full_notificaciones where id_receptor = ? and id_estado = 2 and id_autor = id_emisor",
			[req.params.id],
		);
		if (rows.length === 0)
			return res.status(404).json({ message: "Notificaciones no encontradas" });
		res.json(rows);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const getNotificacionesAutor = async (req, res) => {
	try {
		const [rows] = await pool.query(
			"select * from full_notificaciones where id_receptor = ? and id_autor = id_receptor",
			[req.params.id],
		);
		if (rows.length === 0)
			return res.status(404).json({ message: "Notificaciones no encontradas" });
		res.json(rows);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const createNotificacion = async (req, res) => {
	try {
		const { id_emisor, id_receptor, mensaje, id_articulo_notificacion } = req.body;
		const [rows] = await pool.query(
			"insert into notificaciones (id_emisor, fecha, id_receptor, leido, mensaje, id_articulo_notificacion) values (?, now(), ?, 0, ?,?)",
			[id_emisor, id_receptor, mensaje, id_articulo_notificacion],
		);
		res.send({
			id: rows.insertId,
		});
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const patchEstadoNotificacion = async (req, res) => {
	const { id_emisor, fecha, id_receptor, leido, id_articulo_notificacion } = req.body;
	try {
		const [rows] = await pool.query(
			"update notificaciones set leido = ? where id_emisor = ? and fecha = ? and id_receptor = ? and id_articulo_notificacion = ?",
			[leido, id_emisor, fecha, id_receptor, id_articulo_notificacion],
		);
		if (rows.affectedRows === 0)
			return res.status(404).json({ message: "Notificacion no encontrada" });
		res.json({ message: "Notificacion actualizada" });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
