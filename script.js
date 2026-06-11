const frames = document.querySelectorAll(".frame");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

frames.forEach((frame) => {
  const strength = Number(frame.dataset.shift || 10);

  frame.addEventListener("pointermove", (event) => {
    if (reducedMotion.matches || event.pointerType === "touch") return;

    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    frame.style.setProperty("--mx", `${x * strength}px`);
    frame.style.setProperty("--my", `${y * strength}px`);
  });

  frame.addEventListener("pointerleave", () => {
    frame.style.setProperty("--mx", "0px");
    frame.style.setProperty("--my", "0px");
  });

  frame.addEventListener("click", (event) => {
    if (event.target.closest("a")) return;
    frame.classList.toggle("is-altered");
  });
});

document.querySelector(".hint").addEventListener("click", (event) => {
  event.stopPropagation();
  event.currentTarget.closest(".frame").classList.toggle("is-altered");
});
