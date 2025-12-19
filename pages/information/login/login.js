async function loadCSV() {
  const csvUrl = `https://docs.google.com/spreadsheets/d/e/2PACX-1vT6F0pgYXnKbq9scIPt7VBQREUDOYcJpAeArEuwSvdFq5LVhObqBwaZpVpncWvQnAuYsLSpbB2iXsXm/pub?output=csv`;
  const response = await fetch(`${csvUrl}&timestamp=${Date.now()}`);
  const text = await response.text();
  const data = text.split("\n").map((row) => row.split(","));
  console.log(data);
}
loadCSV();
console.log("test");