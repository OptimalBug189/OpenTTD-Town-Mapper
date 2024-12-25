document.addEventListener('DOMContentLoaded', () => {
    let markers = [];
    const mapElement = document.getElementById('map');
    const container = document.getElementById('map-container');

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    document.getElementById('image-upload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                mapElement.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    mapElement.addEventListener('click', (e) => {
        const rect = mapElement.getBoundingClientRect();
        let x = (e.clientX - rect.left) / rect.width;
        let y = 1 - (e.clientY - rect.top) / rect.height;

        x = clamp(x, 0, 1);
        y = clamp(y, 0, 1);

        const marker = {
            name: prompt('Enter town name:'),
            population: parseFloat(prompt('Enter population:')),
            city: confirm('Is this a city?'),
            x: x,
            y: y
        };

        markers.push(marker);

        const markerElement = document.createElement('div');
        markerElement.className = 'marker';
        markerElement.style.left = `${x * 100}%`;
        markerElement.style.top = `${(1 - y) * 100}%`;
        markerElement.draggable = true;

        markerElement.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            const index = markers.indexOf(marker);
            markers.splice(index, 1);
            container.removeChild(markerElement);
        });

        container.appendChild(markerElement);
    });

    document.getElementById('export').addEventListener('click', () => {
        const invertedMarkers = markers.map(marker => ({
            name: marker.name,
            population: marker.population,
            city: marker.city,
            x: 1-(marker.y),
            y: marker.x,
        }));

        const json = JSON.stringify(invertedMarkers, null, 4);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'export.json';
        a.click();
        URL.revokeObjectURL(url);
    });
});
