const express = require('express');
const Student = require("../models/Student"); // Importer le modèle Student
const router = express.Router();
const path = require("path")


router.get("/new", async (req, res) => {
    const filePath = path.join(__dirname, '..', 'public', 'html', 'form.html');
    res.sendFile(filePath);
})

// Route pour créer un étudiant
router.post('/create-student', async (req, res) => {
  try {
    const newStudent = new Student({
      lastname: req.body.lastname,
      firstname: req.body.firstname,
      email: req.body.email,
      phone: req.body.phone,
      validated: req.body.validated,
      admin: req.body.admin === 'on', // Vérifier si l'option admin est cochée
    });

    await newStudent.save(); // Sauvegarder l'étudiant dans la base de données
    res.status(201).send('Collection saved');
  } catch (error) {
    console.error('Erreur lors de la création de l\'étudiant:', error);
    res.status(500).send(' Failed to save the collection.');
  }
});

router.get("/in-progress", async (req, res) => {
    try {
        const students = await Student.find({validated: 'in progress'}).sort('lastname');
        res.render('studentsInProgress', {students})
    } catch (error) {
        console.error('Erreur lors de la récupération des étudiants:', error);
        res.status(500).send('Erreur du serveur');
    
    }
})
router.get("/management", async (req, res) => {
  let { orderBy, search } = req.query;

  // Valeurs par défaut
  orderBy = orderBy || '_id-asc';
  const [field, order] = orderBy.split('-');
  const sortOrder = order === 'desc' ? -1 : 1;

  try {
    const { query, orderBy = "id" } = req.query;




    const searchFilter = search
    ? {
          $or: [
              { firstname: { $regex: new RegExp(`^${search}$`, "i") } },
              { lastname: { $regex: new RegExp(`^${search}$`, "i") } },
              { phone: { $regex: new RegExp(`^${search}$`, "i") } },
              { email: { $regex: new RegExp(`^${search}$`, "i") } }
          ]
      }
    : {};

const students = await Student.find(searchFilter);

      //const students = await Student.find(searchFilter).sort({ [field]: 1 });

    // Rendre la page avec les données
    res.render("students", { students, query, orderBy });
} catch (err) {
    res.status(500).render("error", { message: "Erreur lors de la récupération des étudiants", error: err });
}
});






module.exports = router;
