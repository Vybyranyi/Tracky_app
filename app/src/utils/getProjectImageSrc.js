export const getProjectImageSrc = (img) => {
    if (!img) return '/projects/01.png';
    if (img.startsWith('http')) return img;
    return `/projects/${img}.png`;
};
