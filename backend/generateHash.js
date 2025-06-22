import bcrypt from 'bcryptjs';

const password = 'securepassword123'; // Change this
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync(password, salt);

console.log('Hashed Password:', hashedPassword);