const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  lastname: { type: String, required: true },
  firstname: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    match: /^[\w.-]+@[\w-]+(\.[\w-]{2,4})+$/ 
  },
  phone: { 
    type: String, 
    required: true,
    match: /^(\+33|0)[0-9]{9}$/

  },
  validated: { 
    type: String, 
    required: true, 
    enum: ["in progress", "validated","rejected"] 
  },
  admin: { type: Boolean, required: true },  
});

module.exports = mongoose.model('Student', StudentSchema);
