const transformSheetData = (sheetData) => {
  const [headers, ...rows] = sheetData;

  return rows.map(row => {
    const obj = {};
    headers.forEach((header, i) => {
      let value = row[i];

      if (header === "id") {
        value = Number(value);
      }

      obj[header] = value ?? "";
    });
    return obj;
  });
}
module.exports = transformSheetData;
