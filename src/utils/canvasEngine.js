import { removeBackground as removeBgAi } from '@imgly/background-removal';

const MAX_CANVAS_DIMENSION = 2560;

export function getOptimizedDimensions(width, height) {
  if (width <= MAX_CANVAS_DIMENSION && height <= MAX_CANVAS_DIMENSION) {
    return { width, height };
  }
  const ratio = width / height;
  if (width > height) {
    return { width: MAX_CANVAS_DIMENSION, height: Math.round(MAX_CANVAS_DIMENSION / ratio) };
  }
  return { width: Math.round(MAX_CANVAS_DIMENSION * ratio), height: MAX_CANVAS_DIMENSION };
}

/**
 * AI Background Removal
 */
export async function removeBackgroundAi(imageInput, onProgress) {
  try {
    const blob = await removeBgAi(imageInput, {
      progress: (key, current, total) => {
        if (onProgress && total > 0) {
          const pct = Math.round((current / total) * 100);
          onProgress(pct);
        }
      }
    });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.warn('WASM AI removal fallback:', err);
    return fallbackSmartSegmentation(imageInput);
  }
}

function fallbackSmartSegmentation(imgInput) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const origW = img.naturalWidth || img.width;
      const origH = img.naturalHeight || img.height;
      const { width: targetW, height: targetH } = getOptimizedDimensions(origW, origH);

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, targetW, targetH);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const c1 = [data[0], data[1], data[2]];
      const c2 = [data[(canvas.width - 1) * 4], data[(canvas.width - 1) * 4 + 1], data[(canvas.width - 1) * 4 + 2]];

      const bgR = (c1[0] + c2[0]) / 2;
      const bgG = (c1[1] + c2[1]) / 2;
      const bgB = (c1[2] + c2[2]) / 2;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const dist = Math.sqrt(Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2));

        if (dist < 45) {
          data[i + 3] = 0;
        } else if (dist < 75) {
          data[i + 3] = Math.round(((dist - 45) / 30) * 255);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = typeof imgInput === 'string' ? imgInput : URL.createObjectURL(imgInput);
  });
}

export function replaceBackground(fgDataUrl, bgType, bgValue, callback) {
  const fgImg = new Image();
  fgImg.crossOrigin = 'anonymous';
  fgImg.onload = () => {
    const origW = fgImg.naturalWidth || fgImg.width;
    const origH = fgImg.naturalHeight || fgImg.height;
    const { width: targetW, height: targetH } = getOptimizedDimensions(origW, origH);

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');

    if (bgType === 'color') {
      ctx.fillStyle = bgValue || '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(fgImg, 0, 0, targetW, targetH);
      callback(canvas.toDataURL('image/png'));
    } else if (bgType === 'gradient') {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (bgValue === 'sunset') {
        grad.addColorStop(0, '#ff7e5f');
        grad.addColorStop(1, '#feb47b');
      } else if (bgValue === 'neon') {
        grad.addColorStop(0, '#00c6ff');
        grad.addColorStop(1, '#0072ff');
      } else if (bgValue === 'pastel') {
        grad.addColorStop(0, '#a8edf0');
        grad.addColorStop(1, '#fed6e3');
      } else {
        grad.addColorStop(0, '#667eea');
        grad.addColorStop(1, '#764ba2');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(fgImg, 0, 0, targetW, targetH);
      callback(canvas.toDataURL('image/png'));
    } else if (bgType === 'image' && bgValue) {
      const bgImg = new Image();
      bgImg.crossOrigin = 'anonymous';
      bgImg.onload = () => {
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(fgImg, 0, 0, targetW, targetH);
        callback(canvas.toDataURL('image/png'));
      };
      bgImg.src = bgValue;
    } else {
      callback(fgDataUrl);
    }
  };
  fgImg.src = fgDataUrl;
}

/**
 * Passport Photo Grid Printable Sheet Generator (Center-Crop Aspect Ratio - No Squishing!)
 */
export function generatePassportSheet(passportImgUrl, count = 8, pageSize = '4x6') {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1800;
      canvas.height = 1200;

      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const passW = 350;
      const passH = 450;
      const gapX = 60;
      const gapY = 60;

      let cols = 4;
      let rows = 2;

      if (count === 12) {
        cols = 4;
        rows = 3;
      } else if (count === 6) {
        cols = 3;
        rows = 2;
      }

      const totalGridW = cols * passW + (cols - 1) * gapX;
      const totalGridH = rows * passH + (rows - 1) * gapY;

      const startX = (canvas.width - totalGridW) / 2;
      const startY = (canvas.height - totalGridH) / 2;

      const imgW = img.naturalWidth || img.width;
      const imgH = img.naturalHeight || img.height;

      const scale = Math.max(passW / imgW, passH / imgH);
      const scaledW = imgW * scale;
      const scaledH = imgH * scale;
      const offsetX = (passW - scaledW) / 2;
      const offsetY = (passH - scaledH) / 2;

      let drawn = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (drawn >= count) break;
          const x = startX + c * (passW + gapX);
          const y = startY + r * (passH + gapY);

          ctx.save();
          ctx.beginPath();
          ctx.rect(x, y, passW, passH);
          ctx.clip();

          ctx.drawImage(img, x + offsetX, y + offsetY, scaledW, scaledH);
          ctx.restore();

          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, passW, passH);

          drawn++;
        }
      }

      resolve(canvas.toDataURL('image/png'));
    };
    img.src = passportImgUrl;
  });
}

/**
 * Clean Telea Distance-Weighted Radial Inpainting (No Mask Redraw!)
 */
export function eraseObjectInpaint(img, maskCanvas) {
  const canvas = document.createElement('canvas');
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Scale mask canvas to match natural image size
  const tempMaskCanvas = document.createElement('canvas');
  tempMaskCanvas.width = width;
  tempMaskCanvas.height = height;
  const tempMaskCtx = tempMaskCanvas.getContext('2d');
  tempMaskCtx.drawImage(maskCanvas, 0, 0, width, height);

  const maskData = tempMaskCtx.getImageData(0, 0, width, height).data;

  // Identify all masked pixels (where red brush was painted)
  const maskedPixels = [];
  const isMasked = new Uint8Array(width * height);

  for (let i = 0; i < width * height; i++) {
    if (maskData[i * 4 + 3] > 30) {
      isMasked[i] = 1;
      maskedPixels.push(i);
    }
  }

  if (maskedPixels.length === 0) return canvas.toDataURL('image/png');

  // Multi-pass Radial Distance-Weighted Neighbor Inpainting
  const maxRadius = 40;
  const passes = 3;

  for (let pass = 0; pass < passes; pass++) {
    for (let i = 0; i < maskedPixels.length; i++) {
      const idx = maskedPixels[i];
      const x = idx % width;
      const y = Math.floor(idx / width);

      let totalWeight = 0;
      let rSum = 0, gSum = 0, bSum = 0;

      const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1],
        [-1, -1], [1, 1], [-1, 1], [1, -1]
      ];

      for (let d = 0; d < directions.length; d++) {
        const [dx, dy] = directions[d];
        for (let r = 1; r <= maxRadius; r++) {
          const nx = x + dx * r;
          const ny = y + dy * r;

          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const nIdx = ny * width + nx;
            // Found clean non-masked background pixel
            if (!isMasked[nIdx] || pass > 0) {
              const weight = 1.0 / (r * r);
              const pIdx = nIdx * 4;

              rSum += data[pIdx] * weight;
              gSum += data[pIdx + 1] * weight;
              bSum += data[pIdx + 2] * weight;
              totalWeight += weight;
              break;
            }
          } else {
            break;
          }
        }
      }

      if (totalWeight > 0) {
        const pIdx = idx * 4;
        data[pIdx] = Math.round(rSum / totalWeight);
        data[pIdx + 1] = Math.round(gSum / totalWeight);
        data[pIdx + 2] = Math.round(bSum / totalWeight);
        data[pIdx + 3] = 255;
      }
    }
  }

  // Put clean inpainted pixels back onto canvas
  ctx.putImageData(imgData, 0, 0);

  // Return clean inpainted image DataURL (NO red mask re-drawn!)
  return canvas.toDataURL('image/png');
}

export function applyPhotoFilters(img, { brightness = 100, contrast = 100, saturation = 100, blur = 0 }) {
  const origW = img.naturalWidth || img.width;
  const origH = img.naturalHeight || img.height;
  const { width: targetW, height: targetH } = getOptimizedDimensions(origW, origH);

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');

  ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`;
  ctx.drawImage(img, 0, 0, targetW, targetH);

  return canvas.toDataURL('image/png');
}

export function resizeAndCropImage(img, targetWidth, targetHeight, format = 'png', quality = 0.92) {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const imgW = img.naturalWidth || img.width;
  const imgH = img.naturalHeight || img.height;

  const scale = Math.max(targetWidth / imgW, targetHeight / imgH);
  const scaledW = imgW * scale;
  const scaledH = imgH * scale;

  const offsetX = (targetWidth - scaledW) / 2;
  const offsetY = (targetHeight - scaledH) / 2;

  ctx.drawImage(img, offsetX, offsetY, scaledW, scaledH);

  const mimeType = format === 'jpg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
  return canvas.toDataURL(mimeType, quality);
}

export function applyWatermark(img, { text, opacity = 50, position = 'bottom-right', fontSize = 24, textColor = '#ffffff' }) {
  const origW = img.naturalWidth || img.width;
  const origH = img.naturalHeight || img.height;
  const { width: targetW, height: targetH } = getOptimizedDimensions(origW, origH);

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(img, 0, 0, targetW, targetH);

  if (text) {
    ctx.globalAlpha = opacity / 100;
    ctx.font = `bold ${fontSize}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = textColor;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 6;

    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    let x = 20;
    let y = fontSize + 20;

    if (position === 'bottom-right') {
      x = canvas.width - textWidth - 30;
      y = canvas.height - 30;
    } else if (position === 'center') {
      x = (canvas.width - textWidth) / 2;
      y = canvas.height / 2;
    } else if (position === 'top-left') {
      x = 30;
      y = fontSize + 30;
    }

    ctx.fillText(text, x, y);
  }

  return canvas.toDataURL('image/png');
}
