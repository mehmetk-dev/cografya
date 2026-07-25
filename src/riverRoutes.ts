import type { MapPoint } from "./types";

export type RiverBranchRoute = {
  name: string;
  points: MapPoint[];
  labelAt?: MapPoint;
};

export type RiverRoute = {
  id: string;
  points: MapPoint[];
  labelAt: MapPoint;
  branches: RiverBranchRoute[];
};

/**
 * The usable land silhouette in turkey-map-react's 1050 × 585 coordinate
 * system. Route points stay inside this inset; the SVG clip path handles the
 * irregular coastline and provincial outline.
 */
export const RIVER_ROUTE_SAFE_BOUNDS = {
  minX: 45,
  maxX: 1015,
  minY: 145,
  maxY: 590,
} as const;

export const RIVER_ROUTES: Record<string, RiverRoute> = {
  kizilirmak: {
    id: "kizilirmak",
    points: [
      { x: 675, y: 334 },
      { x: 630, y: 350 },
      { x: 580, y: 380 },
      { x: 530, y: 395 },
      { x: 480, y: 365 },
      { x: 440, y: 330 },
      { x: 455, y: 290 },
      { x: 485, y: 260 },
      { x: 515, y: 235 },
      { x: 525, y: 205 },
      { x: 525, y: 191 },
    ],
    labelAt: { x: 485, y: 350 },
    branches: [
      {
        name: "Delice Irmağı",
        points: [
          { x: 520, y: 345 },
          { x: 480, y: 340 },
          { x: 440, y: 330 },
        ],
        labelAt: { x: 490, y: 333 },
      },
      {
        name: "Devrez Çayı",
        points: [
          { x: 390, y: 265 },
          { x: 425, y: 280 },
          { x: 455, y: 290 },
        ],
        labelAt: { x: 414, y: 271 },
      },
      {
        name: "Gökırmak",
        points: [
          { x: 430, y: 225 },
          { x: 470, y: 235 },
          { x: 515, y: 235 },
        ],
        labelAt: { x: 468, y: 224 },
      },
    ],
  },
  yesilirmak: {
    id: "yesilirmak",
    points: [
      { x: 625, y: 315 },
      { x: 595, y: 288 },
      { x: 560, y: 270 },
      { x: 550, y: 250 },
      { x: 565, y: 225 },
      { x: 580, y: 205 },
      { x: 585, y: 190 },
    ],
    labelAt: { x: 579, y: 247 },
    branches: [
      {
        name: "Kelkit Çayı",
        points: [
          { x: 735, y: 280 },
          { x: 690, y: 280 },
          { x: 650, y: 275 },
          { x: 615, y: 278 },
          { x: 595, y: 288 },
        ],
        labelAt: { x: 675, y: 269 },
      },
      {
        name: "Çekerek Irmağı",
        points: [
          { x: 500, y: 330 },
          { x: 525, y: 300 },
          { x: 560, y: 270 },
        ],
        labelAt: { x: 519, y: 306 },
      },
      {
        name: "Tersakan Çayı",
        points: [
          { x: 525, y: 225 },
          { x: 540, y: 240 },
          { x: 550, y: 250 },
        ],
        labelAt: { x: 521, y: 238 },
      },
    ],
  },
  sakarya: {
    id: "sakarya",
    points: [
      { x: 285, y: 365 },
      { x: 325, y: 350 },
      { x: 365, y: 345 },
      { x: 390, y: 325 },
      { x: 365, y: 305 },
      { x: 330, y: 300 },
      { x: 300, y: 285 },
      { x: 280, y: 265 },
      { x: 270, y: 240 },
      { x: 275, y: 220 },
    ],
    labelAt: { x: 335, y: 318 },
    branches: [
      {
        name: "Porsuk Çayı",
        points: [
          { x: 230, y: 340 },
          { x: 270, y: 330 },
          { x: 315, y: 340 },
          { x: 365, y: 345 },
        ],
        labelAt: { x: 277, y: 322 },
      },
      {
        name: "Ankara Çayı",
        points: [
          { x: 420, y: 300 },
          { x: 405, y: 310 },
          { x: 390, y: 325 },
        ],
        labelAt: { x: 415, y: 292 },
      },
      {
        name: "Göksu",
        points: [
          { x: 350, y: 275 },
          { x: 340, y: 288 },
          { x: 330, y: 300 },
        ],
        labelAt: { x: 353, y: 282 },
      },
    ],
  },
  filyos: {
    id: "filyos",
    points: [
      { x: 410, y: 240 },
      { x: 390, y: 235 },
      { x: 365, y: 225 },
      { x: 345, y: 215 },
      { x: 335, y: 197 },
    ],
    labelAt: { x: 365, y: 213 },
    branches: [
      {
        name: "Devrek Çayı",
        points: [
          { x: 315, y: 260 },
          { x: 335, y: 240 },
          { x: 365, y: 225 },
        ],
        labelAt: { x: 326, y: 246 },
      },
      {
        name: "Soğanlı Çayı",
        points: [
          { x: 445, y: 260 },
          { x: 425, y: 250 },
          { x: 410, y: 240 },
        ],
        labelAt: { x: 438, y: 249 },
      },
      {
        name: "Araç Çayı",
        points: [
          { x: 470, y: 220 },
          { x: 440, y: 225 },
          { x: 410, y: 240 },
        ],
        labelAt: { x: 450, y: 214 },
      },
    ],
  },
  coruh: {
    id: "coruh",
    points: [
      { x: 815, y: 310 },
      { x: 790, y: 300 },
      { x: 770, y: 285 },
      { x: 785, y: 270 },
      { x: 810, y: 265 },
      { x: 830, y: 245 },
      { x: 850, y: 225 },
      { x: 870, y: 200 },
    ],
    labelAt: { x: 832, y: 238 },
    branches: [
      {
        name: "Oltu Çayı",
        points: [
          { x: 870, y: 285 },
          { x: 850, y: 270 },
          { x: 810, y: 265 },
        ],
        labelAt: { x: 850, y: 258 },
      },
      {
        name: "Berta Çayı",
        points: [
          { x: 880, y: 245 },
          { x: 865, y: 235 },
          { x: 850, y: 225 },
        ],
        labelAt: { x: 882, y: 232 },
      },
      {
        name: "Barhal Çayı",
        points: [
          { x: 890, y: 265 },
          { x: 875, y: 245 },
          { x: 850, y: 225 },
        ],
        labelAt: { x: 895, y: 253 },
      },
    ],
  },
  meric: {
    id: "meric",
    points: [
      { x: 80, y: 151 },
      { x: 75, y: 180 },
      { x: 72, y: 205 },
      { x: 65, y: 230 },
      { x: 60, y: 245 },
    ],
    labelAt: { x: 91, y: 214 },
    branches: [
      {
        name: "Arda",
        points: [
          { x: 48, y: 185 },
          { x: 60, y: 195 },
          { x: 72, y: 205 },
        ],
        labelAt: { x: 52, y: 179 },
      },
      {
        name: "Tunca",
        points: [
          { x: 90, y: 150 },
          { x: 85, y: 170 },
          { x: 75, y: 180 },
        ],
        labelAt: { x: 96, y: 167 },
      },
      {
        name: "Ergene",
        points: [
          { x: 135, y: 220 },
          { x: 110, y: 225 },
          { x: 80, y: 225 },
          { x: 65, y: 230 },
        ],
        labelAt: { x: 112, y: 214 },
      },
    ],
  },
  gediz: {
    id: "gediz",
    points: [
      { x: 230, y: 395 },
      { x: 205, y: 390 },
      { x: 180, y: 385 },
      { x: 150, y: 375 },
      { x: 120, y: 365 },
      { x: 90, y: 355 },
      { x: 60, y: 350 },
    ],
    labelAt: { x: 143, y: 356 },
    branches: [
      {
        name: "Alaşehir Çayı",
        points: [
          { x: 180, y: 415 },
          { x: 165, y: 400 },
          { x: 150, y: 375 },
        ],
        labelAt: { x: 183, y: 405 },
      },
      {
        name: "Gördes Çayı",
        points: [
          { x: 155, y: 345 },
          { x: 150, y: 360 },
          { x: 150, y: 375 },
        ],
        labelAt: { x: 169, y: 356 },
      },
      {
        name: "Kum Çayı",
        points: [
          { x: 225, y: 370 },
          { x: 205, y: 380 },
          { x: 180, y: 385 },
        ],
        labelAt: { x: 214, y: 370 },
      },
    ],
  },
  "buyuk-menderes": {
    id: "buyuk-menderes",
    points: [
      { x: 270, y: 430 },
      { x: 250, y: 440 },
      { x: 230, y: 450 },
      { x: 205, y: 445 },
      { x: 175, y: 440 },
      { x: 145, y: 440 },
      { x: 115, y: 445 },
      { x: 85, y: 450 },
    ],
    labelAt: { x: 155, y: 425 },
    branches: [
      {
        name: "Banaz Çayı",
        points: [
          { x: 210, y: 390 },
          { x: 210, y: 420 },
          { x: 205, y: 445 },
        ],
        labelAt: { x: 198, y: 414 },
      },
      {
        name: "Çürüksu",
        points: [
          { x: 235, y: 430 },
          { x: 220, y: 440 },
          { x: 205, y: 445 },
        ],
        labelAt: { x: 238, y: 422 },
      },
      {
        name: "Akçay",
        points: [
          { x: 155, y: 485 },
          { x: 145, y: 465 },
          { x: 145, y: 440 },
        ],
        labelAt: { x: 162, y: 469 },
      },
      {
        name: "Çine Çayı",
        points: [
          { x: 115, y: 490 },
          { x: 120, y: 465 },
          { x: 115, y: 445 },
        ],
        labelAt: { x: 105, y: 473 },
      },
    ],
  },
  "kucuk-menderes": {
    id: "kucuk-menderes",
    points: [
      { x: 165, y: 415 },
      { x: 145, y: 410 },
      { x: 120, y: 410 },
      { x: 95, y: 405 },
      { x: 70, y: 410 },
    ],
    labelAt: { x: 119, y: 395 },
    branches: [
      {
        name: "Fetrek Çayı",
        points: [
          { x: 135, y: 385 },
          { x: 130, y: 400 },
          { x: 120, y: 410 },
        ],
        labelAt: { x: 126, y: 384 },
      },
      {
        name: "Ilıca Deresi",
        points: [
          { x: 165, y: 430 },
          { x: 150, y: 420 },
          { x: 145, y: 410 },
        ],
        labelAt: { x: 174, y: 427 },
      },
    ],
  },
  bakircay: {
    id: "bakircay",
    points: [
      { x: 175, y: 345 },
      { x: 150, y: 340 },
      { x: 125, y: 340 },
      { x: 100, y: 338 },
      { x: 75, y: 335 },
      { x: 55, y: 335 },
    ],
    labelAt: { x: 120, y: 324 },
    branches: [
      {
        name: "Yağcılı Çayı",
        points: [
          { x: 160, y: 325 },
          { x: 150, y: 335 },
          { x: 150, y: 340 },
        ],
        labelAt: { x: 165, y: 326 },
      },
      {
        name: "Geyikli Deresi",
        points: [
          { x: 120, y: 355 },
          { x: 125, y: 345 },
          { x: 125, y: 340 },
        ],
        labelAt: { x: 113, y: 356 },
      },
    ],
  },
  seyhan: {
    id: "seyhan",
    points: [
      { x: 540, y: 445 },
      { x: 530, y: 480 },
      { x: 525, y: 510 },
      { x: 525, y: 535 },
    ],
    labelAt: { x: 548, y: 468 },
    branches: [
      {
        name: "Zamantı Irmağı",
        points: [
          { x: 580, y: 370 },
          { x: 570, y: 395 },
          { x: 555, y: 420 },
          { x: 540, y: 445 },
        ],
        labelAt: { x: 591, y: 382 },
      },
      {
        name: "Göksu",
        points: [
          { x: 600, y: 410 },
          { x: 580, y: 425 },
          { x: 560, y: 440 },
          { x: 540, y: 445 },
        ],
        labelAt: { x: 581, y: 417 },
      },
    ],
  },
  ceyhan: {
    id: "ceyhan",
    points: [
      { x: 610, y: 410 },
      { x: 600, y: 440 },
      { x: 590, y: 465 },
      { x: 575, y: 485 },
      { x: 560, y: 500 },
      { x: 555, y: 525 },
    ],
    labelAt: { x: 589, y: 478 },
    branches: [
      {
        name: "Hurman Çayı",
        points: [
          { x: 625, y: 400 },
          { x: 615, y: 420 },
          { x: 600, y: 440 },
        ],
        labelAt: { x: 635, y: 416 },
      },
      {
        name: "Göksun Çayı",
        points: [
          { x: 570, y: 430 },
          { x: 580, y: 448 },
          { x: 590, y: 465 },
        ],
        labelAt: { x: 562, y: 440 },
      },
      {
        name: "Aksu Çayı",
        points: [
          { x: 635, y: 455 },
          { x: 610, y: 465 },
          { x: 590, y: 465 },
        ],
        labelAt: { x: 625, y: 450 },
      },
    ],
  },
  asi: {
    id: "asi",
    points: [
      { x: 570, y: 585 },
      { x: 568, y: 570 },
      { x: 570, y: 550 },
      { x: 565, y: 535 },
      { x: 555, y: 530 },
      { x: 545, y: 542 },
    ],
    labelAt: { x: 582, y: 552 },
    branches: [
      {
        name: "Afrin Çayı",
        points: [
          { x: 610, y: 530 },
          { x: 590, y: 535 },
          { x: 565, y: 535 },
        ],
        labelAt: { x: 598, y: 525 },
      },
      {
        name: "Karasu",
        points: [
          { x: 575, y: 500 },
          { x: 572, y: 515 },
          { x: 565, y: 535 },
        ],
        labelAt: { x: 585, y: 514 },
      },
    ],
  },
  goksu: {
    id: "goksu",
    points: [
      { x: 420, y: 470 },
      { x: 430, y: 490 },
      { x: 425, y: 510 },
      { x: 410, y: 530 },
      { x: 405, y: 550 },
      { x: 400, y: 565 },
    ],
    labelAt: { x: 432, y: 522 },
    branches: [
      {
        name: "Ermenek Çayı",
        points: [
          { x: 365, y: 510 },
          { x: 390, y: 515 },
          { x: 425, y: 510 },
        ],
        labelAt: { x: 389, y: 503 },
      },
      {
        name: "Hadim Göksu",
        points: [
          { x: 400, y: 475 },
          { x: 415, y: 482 },
          { x: 430, y: 490 },
        ],
        labelAt: { x: 402, y: 470 },
      },
    ],
  },
  firat: {
    id: "firat",
    points: [
      { x: 715, y: 405 },
      { x: 700, y: 430 },
      { x: 690, y: 455 },
      { x: 690, y: 485 },
      { x: 700, y: 520 },
      { x: 705, y: 540 },
    ],
    labelAt: { x: 706, y: 468 },
    branches: [
      {
        name: "Karasu",
        points: [
          { x: 835, y: 300 },
          { x: 790, y: 315 },
          { x: 750, y: 335 },
          { x: 725, y: 365 },
          { x: 715, y: 405 },
        ],
        labelAt: { x: 780, y: 307 },
      },
      {
        name: "Murat",
        points: [
          { x: 950, y: 330 },
          { x: 900, y: 350 },
          { x: 850, y: 365 },
          { x: 800, y: 380 },
          { x: 755, y: 390 },
          { x: 715, y: 405 },
        ],
        labelAt: { x: 850, y: 353 },
      },
      {
        name: "Peri Suyu",
        points: [
          { x: 770, y: 345 },
          { x: 750, y: 370 },
          { x: 730, y: 395 },
          { x: 715, y: 405 },
        ],
        labelAt: { x: 760, y: 360 },
      },
      {
        name: "Tohma Çayı",
        points: [
          { x: 650, y: 390 },
          { x: 670, y: 400 },
          { x: 690, y: 415 },
          { x: 700, y: 430 },
        ],
        labelAt: { x: 664, y: 388 },
      },
    ],
  },
  dicle: {
    id: "dicle",
    points: [
      { x: 750, y: 410 },
      { x: 770, y: 425 },
      { x: 800, y: 435 },
      { x: 835, y: 445 },
      { x: 870, y: 455 },
      { x: 895, y: 470 },
      { x: 915, y: 485 },
    ],
    labelAt: { x: 820, y: 426 },
    branches: [
      {
        name: "Batman Çayı",
        points: [
          { x: 825, y: 380 },
          { x: 835, y: 410 },
          { x: 835, y: 445 },
        ],
        labelAt: { x: 844, y: 408 },
      },
      {
        name: "Botan Çayı",
        points: [
          { x: 900, y: 400 },
          { x: 890, y: 430 },
          { x: 870, y: 455 },
        ],
        labelAt: { x: 905, y: 428 },
      },
      {
        name: "Büyük Zap",
        points: [
          { x: 975, y: 445 },
          { x: 970, y: 465 },
          { x: 955, y: 485 },
        ],
        labelAt: { x: 981, y: 465 },
      },
    ],
  },
  aras: {
    id: "aras",
    points: [
      { x: 815, y: 320 },
      { x: 850, y: 330 },
      { x: 885, y: 328 },
      { x: 915, y: 315 },
      { x: 940, y: 305 },
      { x: 965, y: 298 },
      { x: 1005, y: 295 },
    ],
    labelAt: { x: 910, y: 302 },
    branches: [
      {
        name: "Arpaçay",
        points: [
          { x: 920, y: 235 },
          { x: 925, y: 270 },
          { x: 940, y: 305 },
        ],
        labelAt: { x: 935, y: 258 },
      },
      {
        name: "Zengmar Çayı",
        points: [
          { x: 970, y: 335 },
          { x: 970, y: 315 },
          { x: 965, y: 298 },
        ],
        labelAt: { x: 985, y: 316 },
      },
    ],
  },
};
