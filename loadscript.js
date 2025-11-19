/* ---------------------------------------------------------
   Minimal Markdown → HTML converter (Github Pages safe)
   Supports: # headers, **bold**, *italic*, lists, paragraphs.
   --------------------------------------------------------- */

function mdToHtml(md) {
    let html = md;

    // escape HTML injection
    html = html.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // headings
    html = html.replace(/^### (.*)$/gm, "<h3>$1</h3>");
    html = html.replace(/^## (.*)$/gm, "<h2>$1</h2>");
    html = html.replace(/^# (.*)$/gm, "<h1>$1</h1>");

    // bold & italics
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // unordered lists
    html = html.replace(/^\s*[-•] (.*)$/gm, "<li>$1</li>");

    // wrap <li> blocks with <ul>
    html = html.replace(/(<li>[\s\S]*?<\/li>)/gm, "<ul>$1</ul>");

    // paragraphs (simple rule)
    html = html.replace(/^(?!<h|<ul|<li|<\/ul|<\/li)(.+)$/gm, "<p>$1</p>");

    return html;
}

/* ---------------------------------------------------------
   Loader: finds all elements with data-content="file.md",
   fetches the file, converts Markdown to HTML, injects it.
   --------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll("[data-content]");

    cards.forEach(card => {
        const url = card.getAttribute("data-content");

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("File not found: " + url);
                }
                return response.text();
            })
            .then(text => {
                card.innerHTML = mdToHtml(text);
            })
            .catch(error => {
                console.error("Content load error:", error);
                card.innerHTML = "<p style='color:#a00;'>[Content load failed]</p>";
            });
    });
});
