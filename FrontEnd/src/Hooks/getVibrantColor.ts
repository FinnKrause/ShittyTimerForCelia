export async function getVibrantColorFrom(
  imageurl: string,
  invert?: boolean
): Promise<string> {
  const promise = new Promise<string>((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    if (imageurl.startsWith("BackgroundImages/"))
      img.src = window.location + imageurl;
    else img.src = imageurl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        ).data;
        let maxSaturation = 0;
        let maxBrightness = 0;
        let vibrantColor: number[] = [];

        for (let i = 0; i < imageData.length; i += 4) {
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const delta = max - min;

          const brightness = max / 255;
          const saturation = max !== 0 ? delta / max : 0;

          if (
            saturation > maxSaturation ||
            (saturation === maxSaturation && brightness > maxBrightness)
          ) {
            maxSaturation = saturation;
            maxBrightness = brightness;
            vibrantColor = [r, g, b];
          }
        }

        const dominantColorHex: string = `#${vibrantColor
          .map((c) => c.toString(16).padStart(2, "0"))
          .join("")}`;

        if (invert) resolve(invertColor(dominantColorHex));
        else resolve(dominantColorHex);
      }
    };
  });
  return promise;
}

function invertColor(hex: string) {
  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error("Invalid HEX color.");
  }
  // invert color components
  const r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
    g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
    b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
  // pad each with zeros and return
  return "#" + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str: unknown, len?: number) {
  len = len || 2;
  const zeros = new Array(len).join("0");
  return (zeros + str).slice(-len);
}
