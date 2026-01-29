const fs = require('fs');

// Create symlink from server/index.js to backend/index.js
try {
  if (!fs.existsSync('server')) {
    fs.mkdirSync('server');
  }
  
  if (!fs.existsSync('server/index.js')) {
    fs.symlinkSync('../backend/index.js', 'server/index.js');
    console.log('Symlink created: server/index.js -> backend/index.js');
  }
} catch (err) {
  console.log('Symlink already exists or error:', err.message);
}
