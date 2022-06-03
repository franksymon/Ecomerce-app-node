const { app } = require('./app');

// Models
const { initModels } = require('./models/initModel');

// Utils
const { db } = require('./utils/database');

// Authenticate database credentials
db.authenticate()
  .then(() => console.log('Database authenticated'))
  .catch(err => console.log(err));

// Establish models relations
initModels();

// Sync sequelize models
db.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.log(err));

// Spin up server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Express app running on port: ${PORT}`);
});
