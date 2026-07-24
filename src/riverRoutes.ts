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

export const RIVER_ROUTES: Record<string, RiverRoute> = {
  kizilirmak: {
    id: "kizilirmak",
    points: [
      { x: 625, y: 285 },
      { x: 575, y: 320 },
      { x: 525, y: 330 },
      { x: 475, y: 295 },
      { x: 445, y: 250 },
      { x: 455, y: 205 },
      { x: 515, y: 190 },
      { x: 555, y: 155 },
      { x: 565, y: 118 },
    ],
    labelAt: { x: 485, y: 282 },
    branches: [
      {
        name: "Delice Irmağı",
        points: [{ x: 535, y: 270 }, { x: 495, y: 260 }, { x: 452, y: 248 }],
        labelAt: { x: 500, y: 255 },
      },
      {
        name: "Devrez Çayı",
        points: [{ x: 430, y: 155 }, { x: 445, y: 180 }, { x: 455, y: 205 }],
        labelAt: { x: 430, y: 174 },
      },
      {
        name: "Gökırmak",
        points: [{ x: 490, y: 145 }, { x: 520, y: 165 }, { x: 545, y: 165 }],
        labelAt: { x: 508, y: 151 },
      },
    ],
  },
  yesilirmak: {
    id: "yesilirmak",
    points: [
      { x: 630, y: 280 },
      { x: 615, y: 235 },
      { x: 590, y: 205 },
      { x: 600, y: 170 },
      { x: 620, y: 125 },
    ],
    labelAt: { x: 615, y: 192 },
    branches: [
      {
        name: "Kelkit Çayı",
        points: [{ x: 735, y: 205 }, { x: 680, y: 215 }, { x: 615, y: 235 }],
        labelAt: { x: 675, y: 204 },
      },
      {
        name: "Çekerek Irmağı",
        points: [{ x: 540, y: 270 }, { x: 565, y: 235 }, { x: 590, y: 205 }],
        labelAt: { x: 550, y: 240 },
      },
      {
        name: "Tersakan Çayı",
        points: [{ x: 565, y: 150 }, { x: 580, y: 175 }, { x: 595, y: 185 }],
        labelAt: { x: 559, y: 166 },
      },
    ],
  },
  sakarya: {
    id: "sakarya",
    points: [
      { x: 355, y: 325 },
      { x: 390, y: 285 },
      { x: 360, y: 255 },
      { x: 320, y: 245 },
      { x: 285, y: 220 },
      { x: 275, y: 175 },
      { x: 290, y: 135 },
    ],
    labelAt: { x: 340, y: 268 },
    branches: [
      {
        name: "Porsuk Çayı",
        points: [{ x: 265, y: 300 }, { x: 295, y: 270 }, { x: 320, y: 245 }],
        labelAt: { x: 278, y: 276 },
      },
      {
        name: "Ankara Çayı",
        points: [{ x: 430, y: 245 }, { x: 405, y: 260 }, { x: 375, y: 270 }],
        labelAt: { x: 410, y: 249 },
      },
      {
        name: "Göksu",
        points: [{ x: 315, y: 205 }, { x: 295, y: 215 }, { x: 285, y: 220 }],
        labelAt: { x: 309, y: 197 },
      },
    ],
  },
  filyos: {
    id: "filyos",
    points: [
      { x: 355, y: 215 },
      { x: 390, y: 190 },
      { x: 395, y: 160 },
      { x: 375, y: 130 },
      { x: 365, y: 108 },
    ],
    labelAt: { x: 390, y: 166 },
    branches: [
      {
        name: "Devrek Çayı",
        points: [{ x: 330, y: 175 }, { x: 355, y: 155 }, { x: 383, y: 143 }],
        labelAt: { x: 336, y: 158 },
      },
      {
        name: "Soğanlı Çayı",
        points: [{ x: 420, y: 205 }, { x: 405, y: 180 }, { x: 395, y: 160 }],
        labelAt: { x: 417, y: 178 },
      },
      {
        name: "Araç Çayı",
        points: [{ x: 455, y: 170 }, { x: 425, y: 165 }, { x: 395, y: 160 }],
        labelAt: { x: 438, y: 156 },
      },
    ],
  },
  coruh: {
    id: "coruh",
    points: [
      { x: 795, y: 260 },
      { x: 820, y: 225 },
      { x: 845, y: 190 },
      { x: 870, y: 150 },
      { x: 882, y: 105 },
    ],
    labelAt: { x: 846, y: 187 },
    branches: [
      {
        name: "Oltu Çayı",
        points: [{ x: 865, y: 245 }, { x: 845, y: 220 }, { x: 835, y: 205 }],
        labelAt: { x: 865, y: 222 },
      },
      {
        name: "Berta Çayı",
        points: [{ x: 900, y: 175 }, { x: 880, y: 165 }, { x: 865, y: 158 }],
        labelAt: { x: 895, y: 162 },
      },
      {
        name: "Barhal Çayı",
        points: [{ x: 910, y: 135 }, { x: 890, y: 142 }, { x: 875, y: 145 }],
        labelAt: { x: 904, y: 127 },
      },
    ],
  },
  meric: {
    id: "meric",
    points: [
      { x: 78, y: 82 },
      { x: 88, y: 125 },
      { x: 82, y: 165 },
      { x: 75, y: 205 },
      { x: 62, y: 230 },
    ],
    labelAt: { x: 94, y: 160 },
    branches: [
      {
        name: "Arda",
        points: [{ x: 48, y: 115 }, { x: 68, y: 125 }, { x: 88, y: 125 }],
        labelAt: { x: 54, y: 105 },
      },
      {
        name: "Tunca",
        points: [{ x: 105, y: 83 }, { x: 100, y: 105 }, { x: 88, y: 125 }],
        labelAt: { x: 108, y: 98 },
      },
      {
        name: "Ergene",
        points: [{ x: 165, y: 145 }, { x: 130, y: 155 }, { x: 82, y: 165 }],
        labelAt: { x: 135, y: 143 },
      },
    ],
  },
  gediz: {
    id: "gediz",
    points: [
      { x: 285, y: 300 },
      { x: 245, y: 315 },
      { x: 205, y: 305 },
      { x: 165, y: 292 },
      { x: 125, y: 275 },
      { x: 100, y: 265 },
    ],
    labelAt: { x: 205, y: 292 },
    branches: [
      {
        name: "Alaşehir Çayı",
        points: [{ x: 220, y: 350 }, { x: 190, y: 325 }, { x: 175, y: 298 }],
        labelAt: { x: 205, y: 333 },
      },
      {
        name: "Gördes Çayı",
        points: [{ x: 185, y: 245 }, { x: 175, y: 270 }, { x: 165, y: 292 }],
        labelAt: { x: 188, y: 265 },
      },
      {
        name: "Kum Çayı",
        points: [{ x: 250, y: 270 }, { x: 230, y: 290 }, { x: 205, y: 305 }],
        labelAt: { x: 245, y: 282 },
      },
    ],
  },
  "buyuk-menderes": {
    id: "buyuk-menderes",
    points: [
      { x: 255, y: 365 },
      { x: 230, y: 375 },
      { x: 205, y: 363 },
      { x: 178, y: 375 },
      { x: 150, y: 365 },
      { x: 120, y: 382 },
      { x: 96, y: 382 },
    ],
    labelAt: { x: 181, y: 356 },
    branches: [
      {
        name: "Banaz Çayı",
        points: [{ x: 225, y: 320 }, { x: 232, y: 345 }, { x: 240, y: 370 }],
        labelAt: { x: 218, y: 338 },
      },
      {
        name: "Çürüksu",
        points: [{ x: 275, y: 350 }, { x: 260, y: 360 }, { x: 245, y: 370 }],
        labelAt: { x: 275, y: 341 },
      },
      {
        name: "Akçay",
        points: [{ x: 170, y: 415 }, { x: 165, y: 390 }, { x: 160, y: 370 }],
        labelAt: { x: 174, y: 397 },
      },
      {
        name: "Çine Çayı",
        points: [{ x: 135, y: 420 }, { x: 145, y: 395 }, { x: 150, y: 365 }],
        labelAt: { x: 128, y: 398 },
      },
    ],
  },
  "kucuk-menderes": {
    id: "kucuk-menderes",
    points: [
      { x: 190, y: 315 },
      { x: 170, y: 325 },
      { x: 145, y: 332 },
      { x: 120, y: 342 },
      { x: 102, y: 340 },
    ],
    labelAt: { x: 150, y: 320 },
    branches: [
      {
        name: "Fetrek Çayı",
        points: [{ x: 145, y: 305 }, { x: 140, y: 320 }, { x: 135, y: 335 }],
        labelAt: { x: 132, y: 310 },
      },
      {
        name: "Ilıca Deresi",
        points: [{ x: 175, y: 350 }, { x: 160, y: 338 }, { x: 145, y: 332 }],
        labelAt: { x: 171, y: 345 },
      },
    ],
  },
  bakircay: {
    id: "bakircay",
    points: [
      { x: 225, y: 255 },
      { x: 195, y: 250 },
      { x: 165, y: 245 },
      { x: 130, y: 250 },
      { x: 100, y: 250 },
    ],
    labelAt: { x: 165, y: 232 },
    branches: [
      {
        name: "Yağcılı Çayı",
        points: [{ x: 195, y: 225 }, { x: 185, y: 240 }, { x: 175, y: 247 }],
        labelAt: { x: 200, y: 234 },
      },
      {
        name: "Geyikli Deresi",
        points: [{ x: 145, y: 270 }, { x: 150, y: 258 }, { x: 160, y: 247 }],
        labelAt: { x: 145, y: 267 },
      },
    ],
  },
  seyhan: {
    id: "seyhan",
    points: [
      { x: 560, y: 295 },
      { x: 550, y: 335 },
      { x: 530, y: 370 },
      { x: 520, y: 410 },
      { x: 505, y: 458 },
    ],
    labelAt: { x: 535, y: 375 },
    branches: [
      {
        name: "Zamantı Irmağı",
        points: [{ x: 580, y: 280 }, { x: 570, y: 305 }, { x: 550, y: 335 }],
        labelAt: { x: 586, y: 307 },
      },
      {
        name: "Göksu",
        points: [{ x: 600, y: 345 }, { x: 570, y: 355 }, { x: 540, y: 355 }],
        labelAt: { x: 582, y: 343 },
      },
    ],
  },
  ceyhan: {
    id: "ceyhan",
    points: [
      { x: 620, y: 320 },
      { x: 600, y: 350 },
      { x: 585, y: 380 },
      { x: 560, y: 410 },
      { x: 545, y: 458 },
    ],
    labelAt: { x: 585, y: 382 },
    branches: [
      {
        name: "Hurman Çayı",
        points: [{ x: 640, y: 295 }, { x: 630, y: 310 }, { x: 620, y: 320 }],
        labelAt: { x: 646, y: 306 },
      },
      {
        name: "Göksun Çayı",
        points: [{ x: 570, y: 330 }, { x: 585, y: 340 }, { x: 600, y: 350 }],
        labelAt: { x: 566, y: 321 },
      },
      {
        name: "Aksu Çayı",
        points: [{ x: 625, y: 375 }, { x: 605, y: 375 }, { x: 585, y: 380 }],
        labelAt: { x: 620, y: 365 },
      },
    ],
  },
  asi: {
    id: "asi",
    points: [
      { x: 605, y: 495 },
      { x: 595, y: 470 },
      { x: 590, y: 445 },
      { x: 570, y: 440 },
      { x: 548, y: 442 },
    ],
    labelAt: { x: 602, y: 456 },
    branches: [
      {
        name: "Afrin Çayı",
        points: [{ x: 635, y: 415 }, { x: 615, y: 430 }, { x: 590, y: 445 }],
        labelAt: { x: 630, y: 427 },
      },
      {
        name: "Karasu",
        points: [{ x: 600, y: 390 }, { x: 598, y: 415 }, { x: 592, y: 438 }],
        labelAt: { x: 606, y: 409 },
      },
    ],
  },
  goksu: {
    id: "goksu",
    points: [
      { x: 445, y: 380 },
      { x: 450, y: 410 },
      { x: 438, y: 435 },
      { x: 415, y: 458 },
      { x: 402, y: 480 },
    ],
    labelAt: { x: 452, y: 430 },
    branches: [
      {
        name: "Ermenek Çayı",
        points: [{ x: 365, y: 425 }, { x: 400, y: 430 }, { x: 438, y: 435 }],
        labelAt: { x: 390, y: 418 },
      },
      {
        name: "Hadim Göksu",
        points: [{ x: 425, y: 385 }, { x: 440, y: 400 }, { x: 450, y: 410 }],
        labelAt: { x: 415, y: 397 },
      },
    ],
  },
  firat: {
    id: "firat",
    points: [
      { x: 720, y: 310 },
      { x: 700, y: 330 },
      { x: 680, y: 350 },
      { x: 680, y: 382 },
      { x: 700, y: 420 },
      { x: 708, y: 485 },
    ],
    labelAt: { x: 697, y: 380 },
    branches: [
      {
        name: "Karasu",
        points: [
          { x: 805, y: 245 },
          { x: 760, y: 245 },
          { x: 725, y: 270 },
          { x: 720, y: 310 },
        ],
        labelAt: { x: 763, y: 234 },
      },
      {
        name: "Murat",
        points: [
          { x: 915, y: 250 },
          { x: 865, y: 285 },
          { x: 810, y: 300 },
          { x: 760, y: 295 },
          { x: 720, y: 310 },
        ],
        labelAt: { x: 835, y: 278 },
      },
      {
        name: "Peri Suyu",
        points: [{ x: 760, y: 260 }, { x: 745, y: 285 }, { x: 730, y: 305 }],
        labelAt: { x: 754, y: 278 },
      },
      {
        name: "Tohma Çayı",
        points: [{ x: 650, y: 315 }, { x: 670, y: 330 }, { x: 690, y: 340 }],
        labelAt: { x: 655, y: 329 },
      },
    ],
  },
  dicle: {
    id: "dicle",
    points: [
      { x: 750, y: 315 },
      { x: 770, y: 345 },
      { x: 800, y: 365 },
      { x: 845, y: 375 },
      { x: 880, y: 410 },
      { x: 905, y: 450 },
      { x: 915, y: 492 },
    ],
    labelAt: { x: 825, y: 356 },
    branches: [
      {
        name: "Batman Çayı",
        points: [{ x: 850, y: 325 }, { x: 850, y: 350 }, { x: 845, y: 375 }],
        labelAt: { x: 858, y: 344 },
      },
      {
        name: "Botan Çayı",
        points: [{ x: 900, y: 365 }, { x: 890, y: 390 }, { x: 880, y: 410 }],
        labelAt: { x: 905, y: 387 },
      },
      {
        name: "Büyük Zap",
        points: [{ x: 970, y: 410 }, { x: 945, y: 435 }, { x: 910, y: 465 }],
        labelAt: { x: 950, y: 422 },
      },
    ],
  },
  aras: {
    id: "aras",
    points: [
      { x: 790, y: 250 },
      { x: 830, y: 235 },
      { x: 875, y: 220 },
      { x: 925, y: 225 },
      { x: 970, y: 245 },
      { x: 1015, y: 250 },
    ],
    labelAt: { x: 895, y: 210 },
    branches: [
      {
        name: "Arpaçay",
        points: [{ x: 930, y: 160 }, { x: 930, y: 195 }, { x: 925, y: 225 }],
        labelAt: { x: 938, y: 188 },
      },
      {
        name: "Zengmar Çayı",
        points: [{ x: 970, y: 205 }, { x: 968, y: 225 }, { x: 970, y: 245 }],
        labelAt: { x: 982, y: 221 },
      },
    ],
  },
};
