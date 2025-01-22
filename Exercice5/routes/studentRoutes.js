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

    const students = (await Student.find(searchFilter).sort({ [field]: sortOrder }))
    res.render("students", { students, query, orderBy });
} catch (err) {
    res.status(500).render("error", { message: "Erreur lors de la récupération des étudiants", error: err });
}
});
router.get('/:id', async (req, res) => {
  console.log('get student data by ID')
  try {
    const studentId =  {_id : req.params.id};
    const student = await Student.find(studentId); // Rechercher l'étudiant dans la base de données
    if (!student) {
      return res.status(404).send('Étudiant introuvable');
    }
    res.json(student); // Retourner les données de l'étudiant au format JSON
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'étudiant:', error);
    res.status(500).send('Erreur du serveur');
  }
});

router.put('/update-student/:id' , async (req ,res) => {
  console.log('UPDATE Student')

  try {
      const studentId = req.params.id;
      const updatedData = {
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        email: req.body.email,
        phone: req.body.phone,
        validated: req.body.validated,
        admin: req.body.admin === 'on',
      };
      const updatedStudent = await Student.findByIdAndUpdate(studentId, updatedData, { new: true });
      if (!updatedStudent) {
        return res.status(404).send('Étudiant introuvable');
      }
      res.status(200).send('Étudiant mis à jour avec succès');
  

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'étudiant:', error);
    res.status(500).send('Erreur du serveur');

  }
})

router.delete('/delete-student/:id' , async (req ,res) => {
  console.log('delete Student')

  try {
      const studentId = { _id  : req.params.id};
      const deleteStudent = await Student.deleteOne(studentId);
      if (deleteStudent.deletedCount === 0) {
        return res.status(404).send('Étudiant introuvable');
      }
      res.status(200).send('Étudiant supprimer avec succès');

  } catch (error) {
    console.error('Erreur lors de la suppresion de l\'étudiant:', error);
    res.status(500).send('Erreur du serveur');

  }
})


module.exports = router;
