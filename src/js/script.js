document.addEventListener("DOMContentLoaded", () => {
  const botoes = document.querySelectorAll(".botoes button");
  const botoesContainer = document.querySelector(".botoes");
  const conteudo1 = document.querySelector(".conteudo-1");
  const header = document.querySelector("header");
  const conteudo2 = document.querySelector(".conteudo-2"); // div da lata
  const lataImg = document.querySelector(".conteudo-2 img");
  const logoPichau3 = document.querySelector(".logo-pichau3");

  let resetTimeout = null;
  let hoverTimeout = null;
  const RESET_DELAY = 1500;
  const HOVER_DELAY = 750;
  const BUTTONS_HIDE_MS = 4500; // tempo que os botões ficam escondidos no mobile (ms)

  const data = {
    original: {
      html: `
        <p class="texto-sabor">
          <span class="sabor">Sabor</span>
          <span class="nome">Original</span>
          <br><br>
          Aquele clássico que nunca dá alt+f4. O sabor Original do Pichau Energy Drink traz aquele
          empurrão certeiro
          pra te manter acordado, focado e pronto para o que vier, da ranqueada decisiva até o relatório
          de última hora!
          <br><br>
          <span class="by">By Pichau Group</span>
        </p>
      `,
      bg: "url('./src/assets/BG-Original.png')",
      lata: "./src/assets/Original2.png"
    },
    tropical: {
      html: `
        <p class="texto-sabor">
          <span class="sabor">Sabor</span>
          <span class="nome">Tropical</span>
          <br><br>
          Se o seu jogo é fugir do óbvio, o sabor Tropical foi feito pra você! O Tropical é a pedida certa pra
          quem quer manter o gás lá em cima, sendo ideal para sessões longas, ou pra quando o calor bate e
          você ainda tem meia dúzia de partidas pela frente.
          <br><br>
          <span class="by">By Pichau Group</span>
        </p>
      `,
      bg: "url('./src/assets/BG-Tropical.png')",
      lata: "./src/assets/Tropical2.png"
    },
    zero: {
      html: `
        <p class="texto-sabor">
          <span class="sabor">Sabor</span>
          <span class="nome">Zero</span>
          <br><br>
          Quer desempenho, mas sem açúcar? A versão Zero Açúcares entrega o mesmo efeito energético, com uma
          fórmula pensada pra quem cuida do corpo sem abrir mão da produtividade. É tipo aquele buff
          silencioso que faz toda diferença no final da partida!
          <br><br>
          <span class="by">By Pichau Group</span>
        </p>
      `,
      bg: "url('./src/assets/BG-Zero.png')",
      lata: "./src/assets/Zero2.png"
    }
  };

  function trocarConteudo(tipo) {
    const { html, bg, lata } = data[tipo];

    conteudo1.classList.add("fade-out");
    conteudo2.classList.add("fade-out");

    setTimeout(() => {
      conteudo1.innerHTML = html;
      header.style.background = `${bg} no-repeat center center / cover`;
      lataImg.src = lata;

      conteudo2.classList.add("sabor-ativo");
      logoPichau3.classList.add("oculto");

      conteudo1.classList.remove("fade-out");
      conteudo2.classList.remove("fade-out");
    }, 300);
  }

  function resetarConteudo() {
    conteudo1.classList.add("fade-out");
    conteudo2.classList.add("fade-out");

    setTimeout(() => {
      conteudo1.innerHTML = `
        <p>
          Chegou o energético que faltava pra sua rotina intensa! A Pichau, referência gamer na América Latina,
          orgulhosamente apresenta o Pichau Energy Drink. Pensado pra quem vive no ritmo acelerado das gameplays,
          maratonas de trabalho e tudo o que exige foco total.
          <br><br>
          A gente sabe que passar horas jogando, trabalhando ou estudando exige mais do que concentração, precisa
          de combustível! E como bons entendedores de setup, agora trazemos também uma bebida pra manter seu ritmo
          no alto e seu cansaço no low. Três sabores, zero enrolação, e a qualidade que só a Pichau entrega (com
          ou sem asas)!
          <br><br>
          CONHEÇA OS SABORES!
        </p>`;
      header.style.background = "url('./src/assets/BG.png') no-repeat center center / cover";
      lataImg.src = "./src/assets/Latas.png";

      conteudo2.classList.remove("sabor-ativo");
      logoPichau3.classList.remove("oculto");

      botoesContainer.classList.remove("oculto");
      botoesContainer.removeAttribute("aria-hidden");

      conteudo1.classList.remove("fade-out");
      conteudo2.classList.remove("fade-out");
    }, 300);
  }

  function hideButtonsTemporary(ms = BUTTONS_HIDE_MS) {
    if (!window.matchMedia("(max-width: 479px)").matches) return;

    if (resetTimeout) { clearTimeout(resetTimeout); resetTimeout = null; }
    if (hoverTimeout) { clearTimeout(hoverTimeout); hoverTimeout = null; }

    botoesContainer.classList.add("oculto");
    botoesContainer.setAttribute("aria-hidden", "true");

    setTimeout(() => {
      botoesContainer.classList.remove("oculto");
      botoesContainer.removeAttribute("aria-hidden");
      // 🔥 Agora sim, quando os botões voltam, resetamos o conteúdo para o padrão
      resetarConteudo();
    }, ms);
  }

  botoes.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      if (resetTimeout) clearTimeout(resetTimeout);
      if (hoverTimeout) clearTimeout(hoverTimeout);

      hoverTimeout = setTimeout(() => {
        if (btn.classList.contains("original")) trocarConteudo("original");
        else if (btn.classList.contains("tropical")) trocarConteudo("tropical");
        else if (btn.classList.contains("zero")) trocarConteudo("zero");
      }, HOVER_DELAY);
    });

    btn.addEventListener("mouseleave", () => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
    });

    btn.addEventListener("click", () => {
      if (btn.classList.contains("original")) trocarConteudo("original");
      else if (btn.classList.contains("tropical")) trocarConteudo("tropical");
      else if (btn.classList.contains("zero")) trocarConteudo("zero");

      hideButtonsTemporary();

      // 🔥 remove seleção visual
      btn.blur();
    });
  });

  botoesContainer.addEventListener("mouseleave", () => {
    resetTimeout = setTimeout(() => {
      resetarConteudo();
    }, RESET_DELAY);
  });
});
