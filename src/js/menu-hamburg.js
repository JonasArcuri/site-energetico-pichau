document.addEventListener("DOMContentLoaded", () => {
  const hamburguer = document.getElementById("hamburguer-icon");
  const mobileNav = document.getElementById("mobile-nav");

  hamburguer.addEventListener("click", () => {
    hamburguer.classList.toggle("ativo");
    mobileNav.classList.toggle("ativo");
  });

  // fecha o menu ao clicar em um link
  document.querySelectorAll(".mobile-nav a").forEach(link => {
    link.addEventListener("click", () => {
      hamburguer.classList.remove("ativo");
      mobileNav.classList.remove("ativo");
    });
  });
});
