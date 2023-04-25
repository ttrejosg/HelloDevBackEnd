import {pool} from '../db.js';

export const getArticulos = async (req, res) => {
    try {

        const [rows] = await pool.query('SELECT * FROM articulos');
        res.json(rows);
    } catch (error) {
        return res.status(500).json({
            message: "Something goes wrong"
        });
    }
}

export const getArticulo = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM articulos where id = ?',[req.params.id] );
        if(rows.length === 0) return res.status(404).json({message: 'Articulo no encontrado'});
        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({
            message: "Something goes wrong"
        });
    }
}


export const createArticulos = async (req, res) => {
    const { titulo, cover, resumen, contenido, estado, fecha} = req.body;
     
    try {
        const [rows] = await pool.query('INSERT INTO articulos (titulo, cover, resumen, contenido, estado, fecha) VALUES (?,?,?,?,?,?)', [titulo, cover, resumen, contenido, estado, fecha]);  
        res.send({
            id: rows.insertId,
            titulo,
            resumen
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something goes wrong"
        });
    }
}

export const deleteArticulos = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM articulos WHERE id = ?', [req.params.id]);
        if(result.affectedRows <= 0) return res.status(404).json({message: 'Articulo no encontrado'});
        res.sendStatus(204);  
    } catch (error) {
        return res.status(500).json({
            message: "Something goes wrong"
        });
    }
}

export const updateArticulos = async (req, res) => {
    const {id} = req.params;
    const {titulo, resumen, estado} = req.body;

    try {
        const [result] = await pool.query('UPDATE articulos SET titulo = IFNULL(?, name), resumen = IFNULL(?, resumen), estado = IFNULL(?, estado) WHERE id = ?', [titulo, resumen, estado, id]);
        if(result.affectedRows === 0) return res.status(404).json({message: 'Articulo no encontrado'});
    
        const [rows] = await pool.query('SELECT * FROM articulos WHERE id = ?', [id]);
    
        res.json(rows[0]); 
    } catch (error) {
        return res.status(500).json({
            message: "Something goes wrong"
        });
    }
}