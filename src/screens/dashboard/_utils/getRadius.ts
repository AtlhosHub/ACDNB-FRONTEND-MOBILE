export const getRadius = (value: number) => {
    const base = 50;
    // Garantir que o valor é um número válido
    if (typeof value !== 'number' || isNaN(value)) {
        return 0;
    }
    const validValue = Math.max(0, value);
    return Math.sqrt(validValue) * base;
};

export const getLatitudeDelta = (area: number) => {
    const radius = getRadius(area);
    const degreesPerMeter = 1 / 111000;
    return radius * degreesPerMeter / 0.5;
};