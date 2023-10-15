import optimalFitRatio from '@/app/util/optimalFitRatio';
import { Car, World } from '../world/World';
import * as gamesec from "com.hydroper.gamesec.client";

// The level frame original size
const frameSize = new gamesec.Vector(1140, 518);

export default class LevelView {
    // 2D stage
    private stage: gamesec.Stage | undefined = undefined;

    attach() {
        // Initialise stage
        this.stage = new gamesec.Stage({
            fit: "optimal",
            size: frameSize,
            container: "#levelContainer",
            background: "black",
        });
        this.stage.attachToDocument();

        // Timeout for initial stage render
        this.initialStageRender();
    }

    detach() {
        if (this.stage !== undefined) {
            this.stage.detachFromDocument();
            this.stage = undefined;
        }
    }

    renderLevel(world: World) {
        this.stage!.root.removeAllChildren();
 
        // Sort Z index
        gamesec.sortObjectsByZ(world.entities);

        for (const entity of world.entities) {
            if (entity.type == "Car") {
                this.renderCar(entity);
            }
        }

        // Render stage
        this.stage!.render();
    }

    private renderCar(car: Car) {
        // Orient the car
        const orient = (shape: gamesec.DisplayObject) => {
            shape.position = new gamesec.Vector(car.x, car.y);
            shape.rotationRadians = car.rotationRadians;
        };

        // Create the shadow
        const shadow = new gamesec.Image("assets/carShadow/car-shadow.png");
        shadow.scale = new gamesec.Vector(1.3, 1.6);
        orient(shadow);

        // Create the car shape
        const carBitmap = new gamesec.Image("assets/carSkins/porsche-carrera-gt.png");
        orient(carBitmap);
    }

    private initialStageRender() {
        setTimeout(() => {
            this.stage!.render();
        }, 500);
    }
}