import { pool } from "../db.js";

export const getArticulos = async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT * FROM articulos");
		res.json(rows);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const getArticulosAutor = async (req, res) => {
	try {
		const [rows] = await pool.query(
			"select * from articulos where id_autor = ? and id_articulo not in (select id_articulo_origen from ediciones) union select id_articulo,titulo,resumen,cover,path,fecha_creacion,id_estado,fecha_publicación,id_autor from (select * from ediciones as e inner join articulos as a on e.id_edicion = a.id_articulo where id_autor = ?) as t1, (select e1.id_articulo_origen as origen, max(a1.fecha_creacion) as lastEdition from ediciones as e1, articulos as a1 where e1.id_edicion = a1.id_articulo and a1.id_autor = ? group by origen) as t2 where t1.id_articulo_origen = t2.origen and t1.fecha_creacion = t2.lastEdition",
			[req.params.id, req.params.id, req.params.id],
		);
		if (rows.length === 0)
			return res.status(404).json({ message: "Articulo/s no encontrados" });
		res.json(rows);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const getArticuloById = async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT * FROM articulos WHERE id_articulo = ?", [
			req.params.id,
		]);
		if (rows.length === 0)
			return res.status(404).json({ message: "Articulo no encontrado" });
		res.json(rows);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const getArticuloBy = async (req, res) => {
	try {
		const [rows] = await pool.query(
			`SELECT * FROM articulos where ${req.query.filter} = ?`,
			[req.query.filterValue],
		);
		if (rows.length === 0)
			return res.status(404).json({ message: "Articulo no encontrado" });
		res.json(rows);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const createArticulo = async (req, res) => {
	try {
		console.log(req.body);
		const { titulo, resumen, cover, path, id_estado, id_autor } = req.body;
		const [rows] = await pool.query(
			"INSERT INTO articulos (titulo, resumen, cover, path, fecha_creacion,id_estado,id_autor,fecha_publicación) VALUES (?,?,?,?,now(),?,?,?)",
			[titulo, resumen, cover, path, id_estado, id_autor, null],
		);
		res.send({
			id: rows.insertId,
		});
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const patchEstadoArticulo = async (req, res) => {
	try {
		const { id_estado } = req.body;
		const [rows] = await pool.query(
			"UPDATE articulos SET id_estado = ? WHERE id_articulo = ?",
			[id_estado, req.params.id],
		);
		if (rows.affectedRows <= 0)
			return res.status(404).json({ message: "Articulo no encontrado" });
		res.sendStatus(204);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
[];
export const deleteArticulo = async (req, res) => {
	try {
		const [result] = await pool.query("DELETE FROM articulos WHERE id_articulo = ?", [
			req.params.id,
		]);
		if (result.affectedRows <= 0)
			return res.status(404).json({ message: "Articulo no encontrado" });
		res.sendStatus(204);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
