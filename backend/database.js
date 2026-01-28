const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'assunta_choir.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeTables();
  }
});

function initializeTables() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'member',
        first_name TEXT,
        last_name TEXT,
        voice_part TEXT,
        phone TEXT,
        is_approved BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS concerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        date DATETIME NOT NULL,
        location TEXT,
        is_public BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS rehearsals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        date DATETIME NOT NULL,
        location TEXT,
        duration INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS recordings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        file_path TEXT NOT NULL,
        file_size INTEGER,
        duration INTEGER,
        upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        uploaded_by INTEGER,
        is_public BOOLEAN DEFAULT 0,
        FOREIGN KEY (uploaded_by) REFERENCES users (id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS sheet_music (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        composer TEXT,
        description TEXT,
        file_path TEXT NOT NULL,
        file_size INTEGER,
        upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        uploaded_by INTEGER,
        voice_part TEXT,
        FOREIGN KEY (uploaded_by) REFERENCES users (id)
      )
    `);

    // Sprawdź czy Norbert już istnieje, jeśli nie - utwórz jako admina
    db.get(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      ['norbert', 'assunta@lwowek.net'],
      (err, row) => {
        if (!row) {
          const bcrypt = require('bcryptjs');
          const defaultPassword = 'assunta2024'; // Norbert zmieni potem

          bcrypt.hash(defaultPassword, 10, (err, hash) => {
            if (!err) {
              db.run(`
                                INSERT INTO users (username, email, password, role, first_name, last_name, voice_part)
                                VALUES (?, ?, ?, ?, ?, ?, ?)
                            `, ['norbert', 'assunta@lwowek.net', hash, 'admin', 'Norbert', 'Bryłka', 'Bas']);
              console.log('✅ Admin user Norbert created with default password: assunta2024');
            }
          });
        } else {
          console.log('ℹ️ User Norbert already exists');
        }
      }
    );

    // Dodaj przykładowe koncerty
    db.get('SELECT COUNT(*) as count FROM concerts', (err, result) => {
      if (!err && result.count === 0) {
        const sampleConcerts = [
          {
            title: 'Koncert Bożonarodzeniowy w Nietrzanowie',
            description: 'Uroczysty koncert kolęd w kościele parafialnym w Nietrzanowie. Zapraszamy na wspólne kolędowanie z udziałem całego chóru.',
            date: '2026-01-25 19:00:00',
            location: 'Kościół parafialny w Nietrzanowie',
            is_public: 1
          },
          {
            title: 'Wielkanocny Koncert Paschalny',
            description: 'Koncert z okazji Wielkanocy, prezentujący utwory pasyjne i wielkanocne. Specjalny program z udziałem solistów.',
            date: '2025-12-15 18:00:00',
            location: 'Kościół NMP Wniebowziętej w Lwówku',
            is_public: 1
          },
          {
            title: 'Adwentowy Koncert Świąteczny',
            description: 'Koncert adwentowy z najpiękniejszymi utworami świątecznymi. Gościnnie wystąpi dziecięcy schola parafialna.',
            date: '2025-12-08 17:30:00',
            location: 'Kościół NMP Wniebowziętej w Lwówku',
            is_public: 1
          },
          {
            title: 'Koncert z okazji Dnia Papieża Jana Pawła II',
            description: 'Koncert ku czci Świętego Jana Pawła II, wykonujący polskie utwory religijne i patriotyczne.',
            date: '2025-10-22 19:00:00',
            location: 'Kościół NMP Wniebowziętej w Lwówku',
            is_public: 1
          }
        ];

        sampleConcerts.forEach((concert, index) => {
          db.run(`
            INSERT INTO concerts (title, description, date, location, is_public)
            VALUES (?, ?, ?, ?, ?)
          `, [concert.title, concert.description, concert.date, concert.location, concert.is_public]);
        });

        console.log('✅ Sample concerts added to database');
      } else {
        console.log('ℹ️ Concerts already exist in database');
      }
    });

    console.log('Database tables initialized');
  });
}

module.exports = db;
