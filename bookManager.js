// bookManager.js
// Name: HugoXuHao, ID: 223190726

const sqlite3 = require('sqlite3').verbose();
const readline = require('readline');
const os = require('os');
const { networkInterfaces } = require('os');

// Create or connect to a SQLite database
const db = new sqlite3.Database('./books.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the books database.');
});

// Create a table if it doesn't exist
db.run('CREATE TABLE IF NOT EXISTS books (title TEXT, author TEXT, ISBN TEXT, context TEXT)', (err) => {
    if (err) {
        console.error(err.message);
    }
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to insert a book into the database
function insertBook(title, author, ISBN, context) {
    db.run(`INSERT INTO books(title, author, ISBN, context) VALUES(?, ?, ?, ?)`, [title, author, ISBN, context], (err) => {
        if (err) {
            return console.log(err.message);
        }
        console.log('A new book has been added: ' + title);
    });
}

// Function to ask for book details
function askForBooks() {
    rl.question('Enter book title: ', (title) => {
        rl.question('Enter author name: ', (author) => {
            rl.question('Enter ISBN: ', (ISBN) => {
                rl.question('Enter context: ', (context) => {
                    insertBook(title, author, ISBN, context);
                    rl.question('Add another book? (yes/no) ', (answer) => {
                        if (answer === 'yes') {
                            askForBooks(); // Recursive call to ask for more books
                        } else {
                            rl.close();
                        }
                    });
                });
            });
        });
    });
}

// Function to list all books
function listBooks() {
    console.log("Listing all books:");
    db.each("SELECT rowid AS id, title, author, ISBN, context FROM books", (err, row) => {
        if (err) {
            throw err;
        }
        console.log(`${row.id}: ${row.title}, ${row.author}, ${row.ISBN}, ${row.context}`);
    });
}

// Function to print machine MAC and IP address
function printMachineDetails() {
    const nets = networkInterfaces();
    const results = Object.create(null); // Or just '{}', an empty object

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }

    console.log('Machine details:', os.hostname(), JSON.stringify(results));
}

// Initial book insertions
insertBook('Sample Book 1', 'Author 1', 'ISBN1', 'Context 1');
insertBook('Sample Book 2', 'Author 2', 'ISBN2', 'Context 2');
insertBook('Sample Book 3', 'Author 3', 'ISBN3', 'Context 3');

askForBooks(); // Start interaction with the user to insert books

rl.on('close', () => {
    listBooks(); // List all books after user finishes input
    printMachineDetails(); // Print machine details
});

// Comments in the code explain the functionality step by step
// Using sqlite3 for managing SQLite database
// Using readline for interactive user input
// Recursive function to continuously add books
// os and networkInterfaces to print system details
