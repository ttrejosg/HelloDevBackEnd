import {pool} from '../db.js';

export const getUsuarioLogin = async (req, res) => {
    try {
        const [user] = await pool.query(`select id_usuario from usuarios WHERE nombre_usuario = ? and contraseña = ?`,
                                    [req.query.usuario, req.query.contraseña]);
        if(user.length !== 0) {
            const[rows] = await pool.query(`select * from editores where id_editor = ?`, [user[0].id_usuario]);
            if(rows.length !== 0) user[0]['rol'] = 'editor';
            else user[0]['rol'] = 'autor';
            return res.json(user[0]);
        } else return res.status(404).json({message: 'Usuario no encontrado'});
        
    } catch (error) {
        return res.status(500).json({
            message: error
        });
    }
}