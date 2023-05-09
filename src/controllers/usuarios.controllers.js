import { ROLS } from "../consts.js";
import { pool } from "../db.js";
import transporter from "../mailer.js";

export const usuariosLogin = async (req, res) => {
	try {
		const { email, contraseña } = req.body;
		const [usuarios] = await pool.query(
			"SELECT * FROM usuarios WHERE (email = ? or nombre_usuario = ?) AND contraseña = ?",
			[email, email, contraseña],
		);
		if (usuarios.length === 1) {
			const [autores] = await pool.query(
				"SELECT id_usuario FROM autores WHERE id_usuario = ?",
				[usuarios[0].id_usuario],
			);
			if (autores.length === 1) {
				res.json({
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
					[usuarios[0].id_usuario],
				);
				if (editores.length === 1) {
					res.json({
						id: usuarios[0].id_usuario,
						nombreUsuario: usuarios[0].nombre_usuario,
						rol: ROLS.EDITOR,
					});
				} else {
					res.status(500).json({ message: "Usuario sin rol" });
				}
			}
		} else {
			res.status(404).json({ message: "Usuario no registrado" });
		}
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;
		const [rows] = await pool.query(
			"SELECT id_usuario FROM usuarios where email = ?",
			[email],
		);
		if (rows.length === 1) {
			const restoreCode = Math.floor(Math.random() * 1000000);
			await pool.query("UPDATE usuarios SET restoreCode = ? WHERE email = ?", [
				restoreCode,
				email,
			]);
			transporter.sendMail(
				{
					from: "hellodevuam@gmail.com",
					to: email,
					subject: "Recuperación de contraseña",
					text: `Hola, Este es el codigo para recuperar tu contraseña: ${restoreCode}`,
				},
				(err, info) => {
					if (err) return res.status(500).json({ message: err.message });
					return res.json({ sended: true, info: info });
				},
			);
		} else return res.status(404).json({ message: "Usuario no registrado" });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const restoreCode = async (req, res) => {
	try {
		const { email, code } = req.body;
		const [rows] = await pool.query(
			"SELECT id_usuario FROM usuarios WHERE email = ? AND restoreCode = ?",
			[email, code],
		);
		if (rows.length === 1) {
			return res.json({
				id: rows.id_usuario,
			});
		} else {
			return res.status(404).json({ message: "Codigo incorrecto" });
		}
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
