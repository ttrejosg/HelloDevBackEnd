import { pool } from "../db.js";

export const getEditores = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM editores");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
