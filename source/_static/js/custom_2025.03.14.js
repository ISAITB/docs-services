document.addEventListener('DOMContentLoaded', function() {

  const codeBlocks = document.querySelectorAll(".highlight");
  if (codeBlocks) {
    codeBlocks.forEach((codeBlock) => {
      const button = document.createElement("button");
      button.className = "copy-code-button";
      button.ariaLabel = "Cody code";
      button.innerHTML = `<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
            <rect x='9' y='9' width='13' height='13' rx='2' ry='2'></rect>
            <path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'></path>
          </svg>`;
      button.addEventListener("click", function(event) {
        const codeContent = event.currentTarget.parentElement.querySelector("pre");
        if (codeContent) {
          navigator.clipboard.writeText(codeContent.innerText.trim()).then(() => {});
          const button = event.currentTarget;
          button.innerHTML = `<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
              <polyline points='20 6 9 17 4 12'></polyline>
            </svg>`;
          setTimeout(() => {
            button.innerHTML = `<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
            <rect x='9' y='9' width='13' height='13' rx='2' ry='2'></rect>
            <path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'></path>
          </svg>`;
          }, 1000);
        }
      });
      codeBlock.append(button);
    });
  }

});
