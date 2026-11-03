// CRUD operations of students table of school database
const express = require("express");
const mysql = require("mysql8");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "tharunya",
    database: "cllg"
});

db.connect((err) => {
    if (err) {
        console.log("MySQL Connection Failed:", err.message);
        return;
    }
    console.log("Connected to MySQL");
});

// Get all students
app.get("/students", (req, res) => {
    db.query("SELECT * FROM student", (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

// Get one student by ID
app.get("/students/:id", (req, res) => {
    db.query("SELECT * FROM student WHERE id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

// Insert student
app.post("/students", (req, res) => {
    const { id, name, marks, phone, age } = req.body;
    if (id === undefined || !name || marks === undefined || !phone || age === undefined) {
        return res.status(400).send("Please provide id, name, marks, phone and age");
    }
    db.query(
        "INSERT INTO student (id, name, marks, phone, age) VALUES (?, ?, ?, ?, ?)",
        [id, name, marks, phone, age],
        (err) => {
            if (err) return res.status(500).send(err.message);
            res.send("Student Inserted");
        }
    );
});

// Update student
app.put("/students/:id", (req, res) => {
    const { name, marks, phone, age } = req.body;
    db.query(
        "UPDATE student SET name = ?, marks = ?, phone = ?, age = ? WHERE id = ?",
        [name, marks, phone, age, req.params.id],
        (err, result) => {
            if (err) return res.status(500).send(err.message);
            if (result.affectedRows === 0) return res.status(404).send("Student NOT found");
            res.send("Student Updated");
        }
    );
});

// Delete student
app.delete("/students/:id", (req, res) => {
    db.query("DELETE FROM student WHERE id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err.message);
        if (result.affectedRows === 0) return res.status(404).send("Student NOT found to delete");
        res.send("Student Deleted");
    });
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
