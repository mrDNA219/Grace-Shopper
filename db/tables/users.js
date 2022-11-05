const client = require('../client');
const bcrypt = require('bcrypt')

const createUser = async user => {
	try {
		const SALT_COUNT = 10;

		const hashedPassword = await bcrypt.hash(password, SALT_COUNT)

		user.password = hashedPassword

		const columnNames = Object.keys(user).join('", "');
		const valueString = Object.keys(user)
			.map((key, index) => `$${index + 1}`)
			.join();

		const {
			rows: [newUser],
		} = await client.query(
			`
      INSERT INTO users("${columnNames}")
      VALUES (${valueString})
      RETURNING *;`,
			Object.values(user)
		);

		return newUser;
	} catch (err) {
		console.error(err);
	}
};

async function getUser({ username, password }) {
	try {
	  const User = await getUserByUsername(username);
  
	  const hashedPassword = User.password;
	  const isValid = await bcrypt.compare(password, hashedPassword)
  
  
	  if (isValid) {
	  const { rows: [user] } = await client.query(` 
		SELECT * FROM users
		WHERE password = '${hashedPassword}' AND username='${username}';
	  `);

		delete user.password

	  return user;

	  } else {
		console.log ('Password not correct')
		return null;
	  }
	} catch (error) {
	  console.log(error);
	  throw error;
	}
  }

  async function getUserById(userId) {
	try {
	  const { rows: [user] } = await client.query(` 
		SELECT * FROM users
		WHERE id = ${userId}
	  `);
	  if (!user) {
		return null;
	  }
	
	  delete user.password

	  return user;
	} catch (error) {
	  console.log(error);
	  throw error;
	}
  
  }
  
  async function getUserByUsername(userName) {
  
	try {
	  const { rows: [user] } = await client.query(` 
		SELECT * FROM users
		WHERE username = '${userName}';
	  `);
	  if (!user) {
		return null;
	  }
  
	  return user;
	} catch (error) {
	  console.log(error);
	  throw error;
	}
  }

module.exports = {
	createUser,
	getUser,
	getUserByUsername,
	getUserById
};
