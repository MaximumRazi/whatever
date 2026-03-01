const planets = {
  Earth: {
    gasDensity: 1.0,
    dustDefault: 0.2,
    rayleighFactor: 1.0,
    mieFactor: 0.25,
    horizonTint: [255, 145, 90],
    zenithBase: [55, 135, 255],
    summary:
      "Earth's molecules strongly Rayleigh-scatter blue light. At sunset, sunlight crosses a longer atmospheric path, removing more blue/green from the direct beam and leaving reds/oranges."
  },
  Mars: {
    gasDensity: 0.2,
    dustDefault: 0.65,
    rayleighFactor: 0.35,
    mieFactor: 1.1,
    horizonTint: [210, 145, 95],
    zenithBase: [196, 150, 105],
    summary:
      "Mars has a thin atmosphere but lots of fine dust. Dust scattering creates tan daytime skies and can make sunsets appear bluish near the sun due to forward scattering."
  },
  Venus: {
    gasDensity: 12,
    dustDefault: 0.9,
    rayleighFactor: 0.12,
    mieFactor: 1.45,
    horizonTint: [220, 192, 120],
    zenithBase: [236, 214, 150],
    summary:
      "Venus has a very thick CO₂ atmosphere and global sulfuric acid clouds. Multiple scattering and cloud layers produce a bright, diffuse yellowish sky with muted sunsets."
  }
};

const planetSelect = document.getElementById("planetSelect");
const sunAngle = document.getElementById("sunAngle");
const dust = document.getElementById("dust");
const sunAngleValue = document.getElementById("sunAngleValue");
const dustValue = document.getElementById("dustValue");
const explanation = document.getElementById("explanation");
const skyPanel = document.getElementById("skyPanel");
const sunDisc = document.getElementById("sunDisc");
const bars = document.getElementById("bars");

Object.keys(planets).forEach((name) => {
  const opt = document.createElement("option");
  opt.value = name;
  opt.textContent = name;
  planetSelect.appendChild(opt);
});

planetSelect.value = "Earth";

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function mixColor(rgbA, rgbB, t) {
  return rgbA.map((v, i) => Math.round(lerp(v, rgbB[i], t)));
}

function rgb([r, g, b], a = 1) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function drawBars(planet, pathFactor) {
  const wavelengths = [450, 500, 550, 600, 650];
  const labels = ["Blue", "Cyan", "Green", "Orange", "Red"];
  const colors = ["#66a3ff", "#5bd6ff", "#7be495", "#ffbd69", "#ff6a6a"];

  bars.innerHTML = "";

  wavelengths.forEach((lambda, i) => {
    const rayleigh = planet.rayleighFactor / Math.pow(lambda / 450, 4);
    const mie = planet.mieFactor * 0.22;
    const total = (rayleigh * 0.72 + mie * 0.28) * pathFactor;
    const h = Math.max(8, Math.min(170, total * 120));

    const x = 24 + i * 78;
    const y = 192 - h;

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", 52);
    rect.setAttribute("height", h);
    rect.setAttribute("fill", colors[i]);
    rect.setAttribute("rx", 6);

    const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    txt.setAttribute("x", x + 26);
    txt.setAttribute("y", 208);
    txt.setAttribute("text-anchor", "middle");
    txt.setAttribute("fill", "#e7edff");
    txt.setAttribute("font-size", "11");
    txt.textContent = labels[i];

    bars.appendChild(rect);
    bars.appendChild(txt);
  });
}

function update() {
  const planet = planets[planetSelect.value];
  const angle = Number(sunAngle.value);
  const haze = Number(dust.value);

  sunAngleValue.textContent = `${angle}°`;
  dustValue.textContent = haze.toFixed(2);

  const pathFactor = 1 / Math.max(0.12, Math.sin((angle * Math.PI) / 180));
  const sunsetness = Math.min(1, (pathFactor - 1) / 5);

  const baseSky = mixColor(planet.zenithBase, planet.horizonTint, haze * 0.35);
  const zenith = mixColor(baseSky, [45, 95, 220], planet.rayleighFactor * (1 - haze) * 0.28);
  const horizon = mixColor(planet.horizonTint, [255, 92, 58], sunsetness * 0.72);

  skyPanel.style.background = `linear-gradient(to bottom, ${rgb(zenith)} 0%, ${rgb(
    mixColor(zenith, horizon, 0.55)
  )} 58%, ${rgb(horizon)} 100%)`;

  const sunX = lerp(10, 82, angle / 90);
  const sunY = lerp(78, 12, angle / 90);
  sunDisc.style.left = `${sunX}%`;
  sunDisc.style.top = `${sunY}%`;

  explanation.textContent = `${planet.summary} Current model: solar path length is ~${pathFactor.toFixed(
    2
  )}× overhead, so warm colors are ${Math.round(sunsetness * 100)}% emphasized.`;

  drawBars(planet, pathFactor * (1 + haze * 0.4));
}

planetSelect.addEventListener("change", () => {
  const p = planets[planetSelect.value];
  dust.value = p.dustDefault;
  update();
});
sunAngle.addEventListener("input", update);
dust.addEventListener("input", update);

update();
