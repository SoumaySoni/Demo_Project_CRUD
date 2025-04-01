const express = require("express");
const db = require("../db_connection");

const router = express.Router();

// Read All Employees

router.get("/", (req, res) => {
  console.log(req.body);
  db.query("SELECT * FROM employees", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result).status(200);
  });
});

// Create an Employee

router.post("/", (req, res) => {
  const { name, email, position, salary } = req.body;
  db.query(
    "INSERT INTO employees (name,email,position,salary) VALUES (?,?,?,?)",
    [name, email, position, salary],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res
        .json({ id: result.insertId, name, email, position, salary })
        .status(201);
    }
  );
});

// Read single employee

router.get("/:id", (req, res) => {
  console.log(req.params.id);
  const { id } = req.params;
  db.query("SELECT * FROM employees WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0)
      return res.status(404).json({ message: "employee not found" });
    res.json(result[0]).status(200);
  });
});

// Delete an employee

router.delete("/:id", (req, res) => {
  db.query(
    "DELETE FROM employees WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      console.log(result);
      if (result.affectedRows === 0)
        return res.status(404).json({
          message: "employee not found",
        });
      res.json({ message: "employee delete successfully" });
    }
  );
});

// update an employee

router.put("/:id", (req, res) => {
  const { name, email, position, salary } = req.body;
  db.query(
    "UPDATE employees SET name = ?,email=?,position=?,salary=? WHERE id=?",
    [name, email, position, salary, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Employee not found" });
      res.json({ message: "Employee updated successfully" });
    }
  );
});

module.exports = router;
