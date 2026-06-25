document.querySelector(".primary-button")?.addEventListener("click", () => {
  document.querySelector(".primary-button").textContent = "Ready";
});

document.querySelectorAll(".toolbar-group:first-child .toolbar-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".toolbar-group:first-child .toolbar-button").forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
  });
});
