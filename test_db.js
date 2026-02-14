const db = require("./server/dbConfig");

console.log("Testing database connection...");

db.query("SELECT 1", (err) => {
  if (err) {
    console.error("Connection failed:", err.message);
    process.exit(1);
  }
  console.log("Connection successful!");

  console.log("Checking tables...");
  db.query("SHOW TABLES", (err, tables) => {
    if (err) {
      console.error("Could not list tables:", err.message);
      process.exit(1);
    }
    console.log("Tables:", tables);

    console.log("Checking accounts schema...");
    db.query("DESCRIBE accounts", (err, schema) => {
      if (err) {
        console.error(
          "Could not describe accounts table (might not exist):",
          err.message,
        );
      } else {
        console.log("Accounts Schema:", schema);
      }

      console.log("Checking attendance_records schema...");
      db.query("DESCRIBE attendance_records", (err, schema) => {
        if (err) {
          console.error(
            "Could not describe attendance_records table (might not exist):",
            err.message,
          );
        } else {
          console.log("Attendance Records Schema:", schema);
        }
        process.exit(0);
      });
    });
  });
});
