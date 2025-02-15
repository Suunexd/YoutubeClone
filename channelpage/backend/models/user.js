const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Definirea schema-ului utilizatorului
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Hasharea parolei înainte de a salva utilizatorul
userSchema.pre('save', async function (next) {
  // Verificăm dacă parola a fost modificată sau adăugată
  if (!this.isModified('password')) return next();

  try {
    // Criptăm parola
    this.password = await bcrypt.hash(this.password, 10);
    next(); // Continuăm cu salvarea
  } catch (err) {
    next(err); // Dacă apare o eroare în timpul criptării, o tratăm
  }
});

// Metodă pentru a compara parola introdusă cu cea stocată
userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw new Error('Eroare la compararea parolelor');
  }
};

// Crearea modelului User
module.exports = mongoose.model('User', userSchema);
