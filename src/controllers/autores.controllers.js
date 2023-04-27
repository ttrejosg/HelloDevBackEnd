import {pool} from '../db.js';

export const getAutores = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM autores');
        res.json(rows);
    } catch (error) {
        return res.status(500).json({
            message: "Something goes wrong"
        });
    }
}

export const getAutorBy = async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM usuarios AS u JOIN autores AS a ON u.id_usuario = a.id_usuario WHERE u.${req.query.filter} = ?` ,[req.query.value] );
        if(rows.length === 0) return res.status(404).json({message: 'Autor(es) no encontrado(s)'});
        res.json(rows);
    } catch (error) {
        return res.status(500).json({
            message: "Something goes wrong"
        });
    }
}

export const createAutor = async (req, res) => { 
    try {
        console.log(req.body);
        const { nombres, apellidos, username, contraseña, email, telefono} = req.body;
        const [rows] = await pool.query('INSERT INTO usuarios (nombres, apellidos, nombre_usuario, contraseña, email, fecha_registro, telefono) VALUES (?,?,?,?,?,NOW(),?)', [nombres, apellidos, username, contraseña, email, telefono]);  
        const [autor] = await pool.query('INSERT INTO autores (autobiografia, seudonimo, id_usuario) VALUES ("", "", ?)', [rows.insertId]);
        res.send({
            id: rows.insertId,
            username,
            email
        });
    } catch (error) {
        return res.status(500).json({
            message: error
        });
    }
}