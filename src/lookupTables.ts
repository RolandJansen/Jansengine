import { ILookupTables } from "./interfaces"

// This is basically copied from the tutorial by F. Permadi:
// https://github.com/permadi-com/ray-cast
// The idea is to pre-compute as much data as possible and
// lookup the values in the game loop

export function getLookupTables(): ILookupTables {
    if (tables.sinTable.length === 0) {
        initLookupTables();
    }

    return tables;
}

const tables: ILookupTables = {
    sinTable: [],
    sinTableInverse: [],
    cosTable: [],
    cosTableInverse: [],
    tanTable: [],
    tanTableInverse: [],
}

function initLookupTables() {

    // 361 records because: 360deg + 0deg
    for (let i = 0; i <= 360; i++) {

        // Populate tables with their radian values.
        // (The addition of 0.0001 is a kludge to avoid divisions by 0.
        // Removing it will produce unwanted holes in the wall when a
        // ray is at 0, 90, 180, or 270 degree angles)
        let radian = arcToRad(i) + (0.0001);

        tables.sinTable[i] = Math.sin(radian);
	    tables.sinTableInverse[i] = (1.0 / (tables.sinTable[i]));
		tables.cosTable[i] = Math.cos(radian);
		tables.cosTableInverse[i] = (1.0 / (tables.cosTable[i]));
		tables.tanTable[i] = Math.tan(radian);
        tables.tanTableInverse[i] = (1.0 / tables.tanTable[i]);

    }
}

function arcToRad(arcAngle: number) {
	return ((arcAngle * Math.PI) / 180);
}
