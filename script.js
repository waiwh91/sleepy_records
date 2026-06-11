const frames = document.querySelectorAll(".frame");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const trailLayer = document.querySelector(".trail-layer");
const trailSources = [
  "assets/photos/street.jpg",
  "assets/photos/field.jpg",
  "assets/photos/live.jpg",
];
let lastTrail = 0;
let trailIndex = 0;

frames.forEach((frame) => {
  const strength = Number(frame.dataset.shift || 10);

  frame.addEventListener("pointermove", (event) => {
    if (reducedMotion.matches || event.pointerType === "touch") return;

    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    frame.style.setProperty("--mx", `${x * strength}px`);
    frame.style.setProperty("--my", `${y * strength}px`);

    const now = performance.now();
    if (now - lastTrail > 95) {
      const image = document.createElement("img");
      image.className = "trail-photo";
      image.src = trailSources[trailIndex % trailSources.length];
      image.style.left = `${event.clientX}px`;
      image.style.top = `${event.clientY}px`;
      image.style.setProperty("--rotation", `${-9 + Math.random() * 18}deg`);
      trailLayer.append(image);
      window.setTimeout(() => image.remove(), 850);
      trailIndex += 1;
      lastTrail = now;
    }
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

let activeDrag = null;

document.querySelectorAll(".draggable").forEach((item) => {
  item.setAttribute("draggable", "false");
  item.querySelector("img")?.setAttribute("draggable", "false");
  item.addEventListener("dragstart", (event) => event.preventDefault());

  item.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    activeDrag = {
      item,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: Number(item.dataset.x || 0),
      originY: Number(item.dataset.y || 0),
      moved: false,
    };
    item.classList.add("is-dragging");
  });

  item.addEventListener("click", (event) => {
    if (item.dataset.wasDragged === "true") {
      event.preventDefault();
      item.dataset.wasDragged = "false";
    }
  });
});

window.addEventListener("pointermove", (event) => {
  if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;

  const x = activeDrag.originX + event.clientX - activeDrag.startX;
  const y = activeDrag.originY + event.clientY - activeDrag.startY;
  activeDrag.moved ||=
    Math.abs(event.clientX - activeDrag.startX) +
      Math.abs(event.clientY - activeDrag.startY) >
    8;
  activeDrag.item.style.setProperty("--drag-x", `${x}px`);
  activeDrag.item.style.setProperty("--drag-y", `${y}px`);
  activeDrag.item.dataset.x = x;
  activeDrag.item.dataset.y = y;
});

window.addEventListener("pointerup", () => {
  if (!activeDrag) return;
  activeDrag.item.classList.remove("is-dragging");
  activeDrag.item.dataset.wasDragged = String(activeDrag.moved);
  activeDrag = null;
});
