const express = require("express");
const fs = require("fs");
const path = require("path");

const apiRoutes = require("./Develop/routes/apiRoutes.js");
const htmlRoutes = require("./Develop/routes/htmlRoutes.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("Develop/public"));

app.use("/api", apiRoutes);
app.use("/", htmlRoutes);

// Bonus: DELETE Route
app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;

  fs.readFile(
    path.join(__dirname, "./Develop/db/db.json"),
    "utf8",
    (err, data) => {
      if (err) throw err;
      const notes = JSON.parse(data);
      const updatedNotes = notes.filter((note) => note.id !== noteId);

      fs.writeFile(
        path.join(__dirname, "./Develop/db/db.json"),
        JSON.stringify(updatedNotes),
        (err) => {
          if (err) throw err;
          res.json({ success: true });
        }
      );
    }
  );
});

app.post("/notes", (req, res) => {
  // Get the data from the request body
  const { title, body } = req.body;

  // Validate the data
  if (!title || !body) {
    res.status(400).json({ error: "Missing title or body" });
    return;
  }

  // Save the data to a database or file system
  saveNoteToDatabase(title, body)
    .then((note) => {
      // Send a response back to the client
      res.status(201).json(note);
    })
    .catch((err) => {
      // Handle any errors that occurred while saving the note
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
