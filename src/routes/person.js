const express = require('express');
const router = express.Router();
const Person = require('../module/person');

// ✅ GET /persons - list all persons
router.get('/', async (req, res) => {
  try {
    const persons = await Person.find();
    res.status(200).json(persons);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching persons', error: err.message });
  }
});

// ✅ POST /persons - add a new person
router.post('/', async (req, res) => {
  try {
    const { name, family, url } = req.body;
    const person = new Person({ name, family, url });
    await person.save();
    res.status(201).json({ message: 'Person added', person });
  } catch (err) {
    res.status(500).json({ message: 'Error saving person', error: err.message });
  }
});

module.exports = router;
