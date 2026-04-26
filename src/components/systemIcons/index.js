import Svg, { Path } from 'react-native-svg';

export default function SystemIcons({ icon, size, color }) {
    const iconSize = size || icon.defaultSize;

    const paths = [...icon.svg.matchAll(/<path([^>]*)>/g)].map(match => {
        const attrs = match[1];

        const dMatch = attrs.match(/d="([^"]+)"/);
        const fillMatch = attrs.match(/fill="([^"]+)"/);

        return {
            d: dMatch ? dMatch[1] : null,
            fill: fillMatch ? fillMatch[1] : null
        };
    });

    return (
        <Svg width={iconSize} height={iconSize} viewBox={icon.viewBox}>
            {paths.map((p, i) => (
                <Path
                    key={i}
                    d={p.d}
                    fill={
                        p.fill === "{color}"
                            ? color
                            : p.fill || color || icon.defaultFill
                    }
                />
            ))}
        </Svg>
    );
}