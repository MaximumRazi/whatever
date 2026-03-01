# Emporium Science Lab: Atmospheric Scattering Simulator

## Run locally

From this folder:

```bash
python3 -m http.server 4173
```

Then open:

- http://localhost:4173

## See the interactivity

- Choose **Earth**, **Mars**, or **Venus** in the Planet dropdown.
- Drag **Sun elevation** (0° = sunset/sunrise, 90° = overhead sun).
- Drag **Dust / haze** to increase aerosol scattering.
- Watch these update live:
  - the **Sky color preview**
  - the **Scattering by wavelength** bars
  - the explanatory text under the controls

## Quick stop command

Press `Ctrl+C` in the terminal running `http.server`.
