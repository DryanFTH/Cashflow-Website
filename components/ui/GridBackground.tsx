export function GridBackground() {
    return (
        <div
            className='
                absolute inset-0
                bg-[linear-gradient(to_right,rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.08)_1px,transparent_1px)]
                bg-size-[80px_80px]
                mask-[radial-gradient(ellipse_at_center,black_55%,transparent_100%)]
            '
        />
    );
}
