import optimalFitRatio from '@/app/util/optimalFitRatio';
import { Car, World } from '../world/World';
import sortEntitiesByZ from '../world/sortEntitiesByZ';
import radiansToDegrees from '../util/math/radiansToDegrees';
import * as easeljs from "@createjs/easeljs";

// The level frame original size
const frameWidth = 1140;
const frameHeight = 518;

export default class LevelView {
    private attached: boolean = false;

    private canvas: HTMLCanvasElement | undefined = undefined;
    private resizeListener: any = undefined;

    // EaselJS 2D stage
    private easelStage: easeljs.Stage | undefined = undefined;

    attach() {
        this.attached = true;

        // Initialise canvas
        this.initialiseCanvas();

        // Initialize the EaselJS stage
        this.easelStage = new easeljs.Stage("levelCanvas");

        // Resizing
        this.resizeListener = this.resizeFrame.bind(this);
        window.addEventListener('resize', this.resizeListener);
        this.resizeFrame();

        // Timeout for initial 2D rendering
        this.initialEaselUpdate();
    }

    detach() {
        if (!this.attached) {
            return;
        }

        // Detach canvas
        this.canvas!.remove();

        // Detach resizer
        window.removeEventListener('resize', this.resizeListener);
        this.resizeListener = undefined;

        // Discard EaselJS stage
        this.easelStage = undefined;

        // Detached
        this.attached = false;
    }

    renderLevel(world: World) {
        this.easelStage!.removeAllChildren();
 
        // Sort Z index
        sortEntitiesByZ(world.entities);

        for (const entity of world.entities) {
            if (entity.type == "Car") {
                this.renderCar(entity);
            }
        }

        // Update Two to render shapes
        this.easelStage!.update();
    }

    private renderCar(car: Car) {
        // Orient the car
        const orient = (shape: easeljs.DisplayObject) => {
            shape.regX = 50;
            shape.regY = 50;
            shape.x = car.x;
            shape.y = car.y;
            shape.rotation = radiansToDegrees(car.rotationRadians);
        };

        // Create the shadow
        const shadow = new easeljs.Bitmap("assets/carShadow/car-shadow.png");
        shadow.scaleX = 1.3;
        shadow.scaleY = 1.6;
        orient(shadow);
        this.easelStage!.addChild(shadow);

        // Create the car shape
        const carBitmap = new easeljs.Bitmap("assets/carSkins/porsche-carrera-gt.png");
        orient(carBitmap);
        this.easelStage!.addChild(carBitmap);
    }

    private initialiseCanvas() {
        const canvas = document.createElement('canvas');
        canvas.style.backgroundColor = '#000';
        canvas.id = "levelCanvas";
        this.canvas = canvas;

        const container = document.getElementById('levelContainer')!;
        container.appendChild(this.canvas);
    }

    private initialEaselUpdate() {
        setTimeout(() => {
            this.easelStage!.update();
        }, 500);
    }

    private resizeFrame() {
        if (!this.attached) {
            return;
        }

        // Fit the level frame original size into the actual resolution
        const ratio = optimalFitRatio(
            { width: frameWidth, height: frameHeight },
            { width: window.innerWidth, height: window.innerHeight },
        );

        // Get the canvas
        const canvas = this.easelStage!.canvas as HTMLCanvasElement;

        // Resize the EaselJS stage
        canvas.width = frameWidth * ratio;
        canvas.height = frameHeight * ratio;
        this.easelStage!.scaleX = ratio;
        this.easelStage!.scaleY = ratio;

        this.easelStage!.update();
    }
}