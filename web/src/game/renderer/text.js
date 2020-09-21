
export function renderText(ctx, text, x, y, fontSize, options) {
  options = options || {};

  ctx.font = `${fontSize}px monospace`;

  ctx.lineWidth = 5;

  if (options.center) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
  }

  if (options.baseline) {
    ctx.textBaseline = options.baseline;
  }

  if (options.bg) {
    const measure = ctx.measureText(text);

    const width = measure.width + 10;
    const height = fontSize + 10;

    ctx.fillStyle = options.bg;
    ctx.fillRect(
      x - width / 2,
      y - height / 2,
      width,
      height
    );
  }

  if (options.stroke) {
    ctx.strokeStyle = 'white';
    ctx.strokeText(text, x, y);
  }
  ctx.fillStyle = options.stroke ? 'black' : 'white';
  ctx.fillText(text, x, y);

  ctx.textAlign = 'start';
  ctx.textBaseline = 'alphabetic';

  ctx.lineWidth = 1;
}
