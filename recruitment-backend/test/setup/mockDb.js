const tables = {};

const mockQuery = jest.fn((sql, params) => {
  const sqlLower = sql.toLowerCase().trim();
  
  if (sqlLower.startsWith('insert') && sqlLower.includes('into')) {
    const tableMatch = sqlLower.match(/into\s+(\w+)/);
    if (tableMatch) {
      const table = tableMatch[1];
      if (!tables[table]) tables[table] = [];
      
      const values = params || [];
      const row = {};
      
      const colMatch = sql.match(/\(([^)]+)\)\s*values/i);
      if (colMatch) {
        const cols = colMatch[1].split(',').map(c => c.trim());
        cols.forEach((col, i) => {
          row[col] = values[i];
        });
      }
      
      if (table === 'person') {
        row.person_id = row.person_id || (tables[table].length > 0 ? Math.max(...tables[table].map(r => r.person_id || 0)) + 1 : 1);
      }
      
      tables[table].push(row);
      
      if (sqlLower.includes('returning')) {
        return { rows: [row], rowCount: 1 };
      }
      return { rows: [], rowCount: 1 };
    }
  }
  
  if (sqlLower.startsWith('select')) {
    const tableMatch = sqlLower.match(/from\s+(\w+)/);
    if (tableMatch) {
      const table = tableMatch[1];
      let rows = [...(tables[table] || [])];
      
      if (sqlLower.includes('where')) {
        if (sqlLower.includes('$2')) {
          const parts = sqlLower.split('where')[1].trim();
          if (parts.includes('username') && parts.includes('password')) {
            rows = rows.filter(row => row.username === params[0] && row.password === params[1]);
          } else if (parts.includes('email') && parts.includes('pnr')) {
            rows = rows.filter(row => row.email === params[0] && row.pnr === params[1]);
          } else if (parts.includes('person_id') && parts.includes('$2')) {
            rows = rows.filter(row => row.person_id == params[1]);
          } else if (parts.includes('code') && parts.includes('person_id')) {
            rows = rows.filter(row => row.person_id == params[0] && row.code === params[1]);
          }
        } else if (sqlLower.includes('$1')) {
          if (sqlLower.includes('username')) {
            rows = rows.filter(row => row.username === params[0]);
          } else if (sqlLower.includes('person_id')) {
            rows = rows.filter(row => row.person_id == params[0]);
          } else if (sqlLower.includes('email')) {
            rows = rows.filter(row => row.email === params[0]);
          }
        }
      }
      
      return { rows, rowCount: rows.length };
    }
  }
  
  if (sqlLower.startsWith('update')) {
    const tableMatch = sqlLower.match(/update\s+(\w+)/);
    if (tableMatch) {
      const table = tableMatch[1];
      const setMatch = sql.match(/set\s+(.+?)\s+where/i);
      
      if (setMatch) {
        const setParts = setMatch[1].split(',').map(s => s.trim());
        const whereMatch = sqlLower.match(/where\s+(\w+)\s*=\s*\$(\d+)/);
        
        if (whereMatch) {
          const whereCol = whereMatch[1];
          const paramIdx = parseInt(whereMatch[2]) - 1;
          const whereVal = params[paramIdx];
          
          const rowIndex = tables[table].findIndex(row => row[whereCol] == whereVal);
          if (rowIndex !== -1) {
            let paramOffset = 0;
            setParts.forEach(part => {
              const [col] = part.split('=').map(s => s.trim());
              if (col && paramOffset < params.length - 1 && params[paramOffset] !== undefined) {
                tables[table][rowIndex][col] = params[paramOffset++];
              }
            });
            return { rows: [tables[table][rowIndex]], rowCount: 1 };
          }
        }
      }
      return { rows: [], rowCount: 0 };
    }
  }
  
  if (sqlLower.startsWith('delete')) {
    const tableMatch = sqlLower.match(/delete\s+from\s+(\w+)/);
    if (tableMatch) {
      const table = tableMatch[1];
      if (sqlLower.includes('where')) {
        const whereMatch = sqlLower.match(/where\s+(\w+)\s*=\s*\$(\d+)/);
        if (whereMatch) {
          const [, col] = whereMatch;
          const whereVal = params[0];
          const initialLength = (tables[table] || []).length;
          tables[table] = (tables[table] || []).filter(row => row[col] != whereVal);
          return { rows: [], rowCount: initialLength - (tables[table] || []).length };
        }
      } else {
        const count = (tables[table] || []).length;
        tables[table] = [];
        return { rows: [], rowCount: count };
      }
    }
  }
  
  return { rows: [], rowCount: 0 };
});

const mockConnect = jest.fn(() => {
  const client = {
    query: mockQuery,
    release: jest.fn()
  };
  return Promise.resolve(client);
});

const db = {
  query: mockQuery,
  connect: mockConnect
};

function reset() {
  Object.keys(tables).forEach(key => delete tables[key]);
  mockQuery.mockClear();
  mockConnect.mockClear();
}

function getTables() {
  return tables;
}

module.exports = { db, reset, getTables, mockQuery, mockConnect };
