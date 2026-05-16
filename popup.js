document.getElementById('scrapeBtn').addEventListener('click', async () => {
  const status = document.getElementById('status');

  try {
    status.innerText = "Scraping current page...";

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const jobTitle =
          document.querySelector('h1')?.innerText || "Not found";

        const salary =
          document.querySelector('#salaryInfoAndJobType span')
            ?.innerText || "Not found";

        const jobType =
          document.querySelector('#salaryInfoAndJobType span + span')
            ?.innerText || "Not found";

        const companyName =
          document.querySelector('[data-testid=jobsearch-CompanyInfoContainer]').children[0].children[0].children[0].children[0].children[0].children[0]?.innerText || "Not found";

        const location =
          document.querySelector('[data-testid=jobsearch-CompanyInfoContainer]').children[0].children[0].children[0].children[1]?.innerText || "Not found";

        return {
          jobTitle,
          salary,
          jobType,
          companyName,
          location,
          url: window.location.href
        };
      }
    });

    const data = result[0].result;

    const excelString = [
      `${data.companyName}\t${data.jobTitle}\t${data.salary}\t${data.url}\t${data.location}`
    ].join('\n');

    await navigator.clipboard.writeText(excelString);

    status.innerText = "Copied to clipboard!";
  } catch (err) {
    console.error(err);
    status.innerText = "Error: " + err.message;
  }
});
