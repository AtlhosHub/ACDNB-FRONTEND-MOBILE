export const getRadius = (value) => {
    const base = 50;
    return Math.sqrt(value) * base;
};

export const getLatitudeDelta = (area) => {
    const radius = getRadius(area);
    const degreesPerMeter = 1 / 111000;
    return radius * degreesPerMeter / 0.5;
};