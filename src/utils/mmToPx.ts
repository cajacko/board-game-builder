const pxMmConversions = [{
    mm: 201,
    px: 760, 
    // 0.2644736842
  },
  {
    mm: 288,
    px: 1089,
    // 0.2644628099
  }
];

const ratio = pxMmConversions.reduce((acc, { mm, px }) => acc + (mm / px), 0) / pxMmConversions.length;

function mmToPx(mm: number): number {
  return Math.round(mm / ratio);
}

export default mmToPx;