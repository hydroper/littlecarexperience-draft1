export type World = {
    entities: Entity[],
};

export type Entity =
    | Car;

export type Car = {
    type: "Car",
    x: number,
    y: number,
    rotationRadians: number,
};