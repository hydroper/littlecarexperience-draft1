type YPosition = { y: number };

/**
 * Sorts an array of entities by Z in-place.
 */
export default function sortEntitiesByZ(array: YPosition[]) {
    const n = array.length;
    let i = 0, j = 0;
    for (i = 0; i < n - 1; ++i) {
        for (j = i + 1; j < n; ++j) {
            const arrayI = array[i];
            if (array[i].y > array[j].y) {
                array[i] = array[j];
                array[j] = arrayI;
            }
        }
    }
}