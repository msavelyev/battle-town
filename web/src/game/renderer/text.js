
export function renderText(ctx, text, x, y) {
  ctx.font = '15px monospace';

  ctx.lineWidth = 5;
  // ctx.strokeStyle = 'white';
  // ctx.strokeText(text, x, y);
  ctx.fillStyle = 'white';
  ctx.fillText(text, x, y);

  ctx.lineWidth = 1;
}

export const OFFSET_Y = 15;
