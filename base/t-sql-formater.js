const sqlFormatter = require('sql-formatter');

let tSQLFormater = (sql, indent) => {
  let numberSpace = '';
  for(let idx = 0; idx < parseInt(indent); idx++) {
      numberSpace += ' ';
  }

  return sqlFormatter.format(sql, {
      language: 'n1ql',
      indent: numberSpace
  })
};

module.exports = tSQLFormater;