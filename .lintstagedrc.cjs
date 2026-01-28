const path = require('path');

module.exports = {
  'backend/**/*.{ts,js}': (filenames) => {
    const cwd = process.cwd();
    const relativeFiles = filenames
      .map((file) => path.relative(path.join(cwd, 'backend'), file))
      .filter(f => !f.startsWith('../')); // ensure it's inside backend
    if (relativeFiles.length === 0) return [];
    return `npm test --prefix backend -- --findRelatedTests ${relativeFiles.join(' ')}`;
  },
  'frontend/**/*.{ts,tsx,js,jsx}': (filenames) => {
    const cwd = process.cwd();
    const relativeFiles = filenames
      .map((file) => path.relative(path.join(cwd, 'frontend'), file))
      .filter(f => !f.startsWith('../')); // ensure it's inside frontend
    if (relativeFiles.length === 0) return [];
    return `npm test --prefix frontend -- related --run ${relativeFiles.join(' ')}`;
  },
};
