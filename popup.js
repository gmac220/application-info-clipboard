document.getElementById('scrapeBtn').addEventListener('click', async () => {
  const url = document.getElementById('urlInput').value;
  const status = document.getElementById('status');

  try {
    // 1. Fetch the webpage content
    const response = await fetch(url);
    const html = await response.text();

    // 2. Parse the HTML string into a DOM document
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // 3. Extract data (Example: grabbing table rows)
    const rows = doc.querySelectorAll('tr');
    let excelData = "";

    rows.forEach(row => {
      const cols = row.querySelectorAll('td, th');
      const rowData = Array.from(cols)
        .map(col => col.textContent.trim())
        .join('\t'); // Tab separator for Excel columns
      excelData += rowData + '\n'; // Newline for Excel rows
    });

    // 4. Copy to clipboard
    await navigator.clipboard.writeText(excelData);
    status.innerText = "Copied to clipboard!";
  } catch (err) {
    status.innerText = "Error: " + err.message;
  }
});

document.getElementById('scrapeBtn').addEventListener('click', async () => {
  const url = document.getElementById('urlInput').value;
  const status = document.getElementById('status');

  document.querySelectorAll('[class*="job"]')


  try {
    status.innerText = "Fetching data...";
    const response = await fetch(url);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');  
    
    // Helper: Finds text near a label (e.g., finding the text next to "Salary:")
    const findByLabel = (label) => {
      const elements = Array.from(doc.querySelectorAll('div, p, span, li, td'));
      const target = elements.find(el => el.textContent.toLowerCase().includes(label.toLowerCase()));
      return target ? target.textContent.replace(label, "").trim() : "Not Found";
    };

    // Extracting Data - Adjust selectors based on your target site (e.g., LinkedIn, Indeed)
    const data = {
      company: doc.querySelector('.company-name, .brand, h3')?.textContent.trim() || findByLabel("Company"),
      job: doc.querySelector('h1, .job-title')?.textContent.trim() || "Not Found",
      salary: doc.querySelector('.salary, .pay-range')?.textContent.trim() || findByLabel("Salary"),
      url: url,
      location: doc.querySelector('.location, .city-state')?.textContent.trim() || findByLabel("Location")
    };

    // Format for Excel: Headers + Data separated by tabs (\t)
    const excelString = [
      `${data.company}\t${data.job}\t${data.salary}\t${data.url}\t${data.location}`
    ].join('\n');

    await navigator.clipboard.writeText(excelString);
    status.innerText = "Copied to clipboard!";
  } catch (err) {
    status.innerText = "Error: " + err.message;
  }
});