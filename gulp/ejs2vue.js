
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');


const listComponentResult = ejs.render(listComponentTemplate, {layoutCount: data.length});
fs.writeFileSync(path.resolve(__dirname, './test.vue'), listComponentResult);