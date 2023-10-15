import optimalFitRatio from '@/app/util/optimalFitRatio';
import { Car, World } from '../world/World';
import sortEntitiesByZ from '../world/sortEntitiesByZ';

// Import Two
import Two from 'two.js';
import { Shape as TwoShape } from 'two.js/src/shape';
import { Rectangle as TwoRectangle } from 'two.js/src/shapes/rectangle';
import { Vector as TwoVector } from 'two.js/src/vector';

// The level frame original size
const frameWidth = 1140;
const frameHeight = 518;

// Use `Two` as a TypeScript namespace
const twoNS = Two as any;

export default class LevelView {
    private attached: boolean = false;

    private canvas: HTMLCanvasElement | undefined = undefined;
    private resizeListener: any = undefined;

    // Two 2D renderer
    private two: Two | undefined = undefined;

    attach() {
        this.attached = true;

        // Initialise canvas
        this.initialiseCanvas();

        // Initialize the Two instance
        this.two = new Two({
            fullscreen: false,
            fitted: false,
            domElement: this.canvas!,
        });

        // Resizing
        this.resizeListener = this.resizeFrame.bind(this);
        window.addEventListener('resize', this.resizeListener);
        this.resizeFrame();

        // Timeout for initial `Two` render
        this.initialTwoUpdate();
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

        // Discard `Two` instance
        this.two = undefined;

        // Detached
        this.attached = false;
    }

    renderLevel(world: World) {
        const two = this.two!;
        Two.Group.RemoveChildren(two.scene.children);
 
        // Sort Z index
        sortEntitiesByZ(world.entities);

        for (const entity of world.entities) {
            if (entity.type == "Car") {
                this.renderCar(entity);
            }
        }

        // Update Two to render shapes
        two.update();
    }

    private renderCar(car: Car) {
        const two = this.two!;

        // Orient the car
        const orient = (shape: TwoRectangle) => {
            shape.position = new twoNS.Vector(car.x, car.y);
            shape.rotation = car.rotationRadians;
        };

        // Create the shadow
        const shadow = two.makeSprite("assets/carShadow/car-shadow.png", 0, 0);
        shadow.scale = new twoNS.Vector(1.3, 1.6);
        orient(shadow);

        // Create the car shape
        const carBitmap = two.makeSprite("assets/carSkins/porsche-carrera-gt.png", car.x, car.y);
        orient(carBitmap);
    }

    private initialiseCanvas() {
        const canvas = document.createElement('canvas');
        canvas.style.backgroundColor = '#000';
        this.canvas = canvas;

        const container = document.getElementById('levelContainer')!;
        container.appendChild(this.canvas);
    }

    private initialTwoUpdate() {
        setTimeout(() => {
            this.two!.update();
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

        // Resize the `Two` instance
        const two = this.two!;
        two.width = frameWidth * ratio;
        two.height = frameHeight * ratio;
        two.scene.scale = ratio;

        two.update();
    }
}