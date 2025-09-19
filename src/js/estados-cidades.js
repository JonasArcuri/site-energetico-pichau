const estadoSelect = document.getElementById("estado");
const cidadeSelect = document.getElementById("cidade");

// Carregar estados do IBGE
fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
  .then(res => res.json())
  .then(estados => {
    // Ordenar alfabeticamente
    estados.sort((a, b) => a.nome.localeCompare(b.nome));

    estados.forEach(estado => {
      const option = document.createElement("option");
      option.value = estado.sigla;
      option.textContent = `${estado.nome} (${estado.sigla})`;
      estadoSelect.appendChild(option);
    });
  });

// Quando selecionar um estado, carregar as cidades
estadoSelect.addEventListener("change", () => {
  const uf = estadoSelect.value;

  cidadeSelect.innerHTML = '<option value="">Selecione a Cidade</option>';
  cidadeSelect.disabled = true;

  if (uf) {
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
      .then(res => res.json())
      .then(cidades => {
        cidades.sort((a, b) => a.nome.localeCompare(b.nome));

        cidades.forEach(cidade => {
          const option = document.createElement("option");
          option.value = cidade.nome;
          option.textContent = cidade.nome;
          cidadeSelect.appendChild(option);
        });

        cidadeSelect.disabled = false;
      });
  }
});
