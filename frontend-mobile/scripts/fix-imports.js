const fs = require('fs');
const path = require('path');

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach((file) => {
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
            results.push(file);
          }
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

const dirs = [
  path.join(__dirname, '../app'),
  path.join(__dirname, '../src')
];

let allFiles = [];
let pendingDirs = dirs.length;

dirs.forEach(dir => {
  walk(dir, (err, files) => {
    if (err) throw err;
    allFiles = allFiles.concat(files);
    if (!--pendingDirs) {
      processFiles();
    }
  });
});

function processFiles() {
  allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    // Replace ../../src/ or ../src/ or ../../../src/ with @/src/
    content = content.replace(/['"](\.\.\/)+src\//g, '"@/src/');
    
    // Replace ../../assets/ or ../assets/ or ../../../assets/ with @/assets/
    content = content.replace(/['"](\.\.\/)+assets\//g, '"@/assets/');
    
    // Replace ../../hooks/ or ../hooks/ with @/src/hooks/
    content = content.replace(/['"](\.\.\/)+hooks\//g, '"@/src/hooks/');

    // Replace @/hooks/ with @/src/hooks/
    content = content.replace(/['"]@\/hooks\//g, '"@/src/hooks/');

    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated imports in ${file.replace(path.join(__dirname, '../'), '')}`);
    }
  });
}
