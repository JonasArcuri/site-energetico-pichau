const estadoSelect = document.getElementById("estado");
const cidadeSelect = document.getElementById("cidade");
const exemploBar = document.querySelector(".exemplo-bar");

// ========= INICIALIZA MAPA =========
const map = L.map("map").setView([-14.235, -51.9253], 4);

// Tile layer OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

// ========= CARREGA ESTADOS =========
fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
  .then(res => res.json())
  .then(estados => {
    estados.sort((a, b) => a.nome.localeCompare(b.nome));
    estados.forEach(estado => {
      const option = document.createElement("option");
      option.value = estado.sigla;
      option.textContent = `${estado.nome} (${estado.sigla})`;
      estadoSelect.appendChild(option);
    });
  });

// ========= CARREGA CIDADES =========
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

// ========= CENTRALIZA AO ESCOLHER CIDADE =========
cidadeSelect.addEventListener("change", async () => {
  const cidade = cidadeSelect.value;
  const estado = estadoSelect.value;

  if (cidade && estado) {
    let url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&city=${cidade}&state=${estado}&country=Brasil`;
    let resp = await fetch(url);
    let data = await resp.json();

    if (data.length > 0) {
      let lat = data[0].lat;
      let lon = data[0].lon;
      map.setView([lat, lon], 12);
    }
  }
});

// ========= CARREGA LOCAIS DO CSV =========
let marcadores = [];

async function addLocaisDoCSV() {
  Papa.parse("src/enderecos.csv", {
    download: true,
    header: true,
    complete: async function(results) {
      for (let row of results.data) {
        if (!row.endereco || !row.cidade) continue;

        let enderecoCompleto = `${row.endereco}, ${row.numero}, ${row.cidade}, Brasil`;

        let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoCompleto)}`;
        let resp = await fetch(url, { headers: { "User-Agent": "pichau-mapa" } });
        let data = await resp.json();

        if (data.length > 0) {
          let lat = parseFloat(data[0].lat);
          let lon = parseFloat(data[0].lon);

          let marker = L.marker([lat, lon]).addTo(map);

          // Clique no marcador -> atualiza sidebar
          marker.on("click", () => {
            exemploBar.innerHTML = `
              <img src="src/assets/Tranquilebas.png" alt="Img Local"> 
              <div class="info-bar">
                <p class="titulo-1">${row.nome}</p>
                <div class="endereco">
                  <img src="src/assets/Endereco.png" alt="Endereço">
                  <p>${row.endereco}, ${row.numero}. ${row.cidade}</p>
                </div>
                <div class="contato">
                  <img src="src/assets/Contato.png" alt="Contato">
                  <p>${row.telefone || "—"}</p>
                </div>
              </div>
            `;
          });

          marcadores.push({ marker, cidade: row.cidade });
        }
      }
    }
  });
}

// ========= FILTRA MARCADORES PELO SELECT =========
cidadeSelect.addEventListener("change", () => {
  const cidadeSelecionada = cidadeSelect.value;

  marcadores.forEach(obj => {
    if (cidadeSelecionada === "" || obj.cidade.toLowerCase() === cidadeSelecionada.toLowerCase()) {
      map.addLayer(obj.marker);
    } else {
      map.removeLayer(obj.marker);
    }
  });
});

// Inicializa os locais
addLocaisDoCSV();
