import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Wing } from 'objects';
import { BasicLights } from 'lights';
import * as THREE from "three";

import POSX from "./textures/Skybox/posx.jpg";
import NEGX from "./textures/Skybox/negx.jpg";
import POSY from "./textures/Skybox/posy.jpg";
import NEGY from "./textures/Skybox/negy.jpg";
import POSZ from "./textures/Skybox/posz.jpg";
import NEGZ from "./textures/Skybox/negz.jpg";

// import * as DATA from "./data.json";
class MainScene extends Scene {
    constructor(color) {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            rotationSpeed: 1,
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x000000);


        var envMap = new THREE.CubeTextureLoader()
            .load([
                POSX, NEGX,
                POSY, NEGY,
                POSZ, NEGZ
            ]);

        // count should be multiple of 4 + 1
        // 3x + 4
        const wings = new Wing(this, color, envMap, 50, 26, 14);

        this.add(wings);


        const lights = new BasicLights();
        this.add(lights);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}

export default MainScene;