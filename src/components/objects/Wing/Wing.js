//ORIG

import { Group, Scene } from "three";
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import * as THREE from "three";

class Wing extends Group {
    constructor(parent, color, envMap, size, numPoints_top, numPoints_bottom) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            count: 0,
            rotDirection: 1

        };

        this.tubeMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(color),
            emissive: 0x000000,
            metalness: 1.5, // between 0 and 1
            roughness: 0, // between 0 and 1
            envMap: envMap,
            envMapIntensity: 1.6
        });

        this.vectors_tr = [];
        this.vectors_tl = [];
        this.vectors_br = [];
        this.vectors_bl = [];

        this.left = new THREE.Group();
        this.right = new THREE.Group();
        this.butterfly = new THREE.Group();

        parent.addToUpdateList(this);
        this.get_random_top_point = this.get_random_top_point.bind(this);
        this.get_random_bottom_point = this.get_random_bottom_point.bind(this);
        this.draw_catmull_rom = this.draw_catmull_rom.bind(this);
        this.draw_bezier_curve_top = this.draw_bezier_curve_top.bind(this);
        this.draw_bezier_curve_bottom = this.draw_bezier_curve_bottom.bind(this);

        this.vectors_tr.push(new THREE.Vector3(0, 0, 0));
        this.vectors_tl.push(new THREE.Vector3(0, 0, 0));

        for (let i = 0; i < numPoints_top; i++) {
            this.get_random_top_point(0, size, 0, size);
        }
        this.vectors_tr.push(new THREE.Vector3(0, 0, 0));
        this.vectors_tl.push(new THREE.Vector3(0, 0, 0));


        this.vectors_br.push(new THREE.Vector3(0, 0, 0));
        this.vectors_bl.push(new THREE.Vector3(0, 0, 0));
        for (let i = 0; i < numPoints_bottom; i++) {
            this.get_random_bottom_point(0, -size / 2, 0, -size / 2);
        }
        this.vectors_br.push(new THREE.Vector3(0, 0, 0));
        this.vectors_bl.push(new THREE.Vector3(0, 0, 0));

        for (let i = 0; i < numPoints_top - 1; i = i + 3) {
            this.draw_bezier_curve_top(i);
        }
        console.log(this.vectors_bl);
        for (let i = 0; i < numPoints_bottom - 1; i = i + 3) {
            this.draw_bezier_curve_bottom(i);
        }

        this.add(this.left);
        this.add(this.right);

        this.butterfly.add(this.left);
        this.butterfly.add(this.right);

        this.add(this.butterfly);

        this.butterfly.translateY(-15);
        this.butterfly.rotateX(Math.PI / 8);
        this.butterfly.rotateZ(Math.PI / 6);

    }

    get_random_top_point(xMin, xMax, yMin, yMax) {
        let x = Math.random() * (xMax - xMin) + xMin;
        let y = Math.random() * (yMax - yMin) + yMin;
        this.vectors_tr.push(new THREE.Vector3(x, y, 0));
        this.vectors_tl.push(new THREE.Vector3(-x, y, 0));
    }

    get_random_bottom_point(xMin, xMax, yMin, yMax) {
        let x = Math.random() * (xMax - xMin) + xMin;
        let y = Math.random() * (yMax - yMin) + yMin;
        this.vectors_br.push(new THREE.Vector3(x, y, 0));
        this.vectors_bl.push(new THREE.Vector3(-x, y, 0));
    }

    draw_catmull_rom() {

        const curve = new THREE.SplineCurve(this.vectors);
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

        // Create the final object to add to the scene
        const curveObject = new THREE.Line(geometry, material);
        this.add(curveObject);
    }


    draw_bezier_curve_top(index) {
        // right side
        let curve = new THREE.CubicBezierCurve3(
            this.vectors_tr[index],
            this.vectors_tr[index + 1],
            this.vectors_tr[index + 2],
            this.vectors_tr[index + 3]
        );

        let curveGeometry = new THREE.TubeGeometry(curve, 200, 1, 8, false);
        let curveMesh = new THREE.Mesh(curveGeometry, this.tubeMaterial);
        this.add(curveMesh);

        this.right.add(curveMesh);

        let geometry = new THREE.SphereGeometry(1, 32, 16);
        let sphere = new THREE.Mesh(geometry, this.tubeMaterial);
        sphere.position.set(this.vectors_tr[index].x, this.vectors_tr[index].y, this.vectors_tr[index].z);
        this.add(sphere);
        this.right.add(sphere);

        // left side
        curve = new THREE.CubicBezierCurve3(
            this.vectors_tl[index],
            this.vectors_tl[index + 1],
            this.vectors_tl[index + 2],
            this.vectors_tl[index + 3]
        );


        curveGeometry = new THREE.TubeGeometry(curve, 200, 1, 8, false);
        curveMesh = new THREE.Mesh(curveGeometry, this.tubeMaterial);
        this.add(curveMesh);

        this.left.add(curveMesh);

        geometry = new THREE.SphereGeometry(1, 32, 16);
        sphere = new THREE.Mesh(geometry, this.tubeMaterial);
        sphere.position.set(this.vectors_tl[index].x, this.vectors_tl[index].y, this.vectors_tl[index].z);
        this.add(sphere);
        this.left.add(sphere);
    }

    draw_bezier_curve_bottom(index) {
        // right side
        let curve = new THREE.CubicBezierCurve3(
            this.vectors_br[index],
            this.vectors_br[index + 1],
            this.vectors_br[index + 2],
            this.vectors_br[index + 3]
        );


        let curveGeometry = new THREE.TubeGeometry(curve, 200, 1, 8, false);
        let curveMesh = new THREE.Mesh(curveGeometry, this.tubeMaterial);
        this.add(curveMesh);
        // l and r switched for some reason
        this.left.add(curveMesh);

        let geometry = new THREE.SphereGeometry(1, 32, 16);
        let sphere = new THREE.Mesh(geometry, this.tubeMaterial);
        sphere.position.set(this.vectors_br[index].x, this.vectors_br[index].y, this.vectors_br[index].z);
        this.add(sphere);
        this.left.add(sphere);


        // left side
        curve = new THREE.CubicBezierCurve3(
            this.vectors_bl[index],
            this.vectors_bl[index + 1],
            this.vectors_bl[index + 2],
            this.vectors_bl[index + 3]
        );


        curveGeometry = new THREE.TubeGeometry(curve, 200, 1, 8, false);
        curveMesh = new THREE.Mesh(curveGeometry, this.tubeMaterial);
        this.add(curveMesh);
        this.right.add(curveMesh);

        geometry = new THREE.SphereGeometry(1, 32, 16);
        sphere = new THREE.Mesh(geometry, this.tubeMaterial);
        sphere.position.set(this.vectors_bl[index].x, this.vectors_bl[index].y, this.vectors_bl[index].z);
        this.add(sphere);
        this.right.add(sphere);
    }


    draw_bezier() {
        let data;
        let radius;
        for (let i in this.corners) {
            // 7 5
            if (i == 0) {
                radius = 1 / 7;
            } else {
                radius = i / 5;
            }
            data = this.corners[i];
            const path = new THREE.QuadraticBezierCurve3(
                new THREE.Vector3(data[0], data[1] + this.y_offset, data[2]), // start
                new THREE.Vector3(data[6], data[7] + this.y_offset, data[8]), // control
                new THREE.Vector3(data[3], data[4] + this.y_offset, data[5]) // end
            );
            const points = path.getPoints(3);
            this.points.push(points[1]);
            this.points.push(points[2]);
            this.points.push(points[3]);
            // path, tubularSsegments, radius, radialsegments
            const curveGeometry = new THREE.TubeGeometry(path, 20, radius, 8, false);
            const curveMesh = new THREE.Mesh(curveGeometry, this.tubeMaterial);
            this.add(curveMesh);
            this.bezier_curves.push(curveMesh);
            this.curveGroup.add(curveMesh);

            path = new THREE.QuadraticBezierCurve3(
                new THREE.Vector3(-data[0], -(data[1] + this.y_offset), data[2]), // start
                new THREE.Vector3(-data[6], -(data[7] + this.y_offset), data[8]), // control
                new THREE.Vector3(-data[3], -(data[4] + this.y_offset), data[5]) // end
            );
            points = path.getPoints(3);
            this.points.push(points[1]);
            this.points.push(points[2]);
            this.points.push(points[3]);

            curveGeometry = new THREE.TubeGeometry(path, 20, radius, 8, false);
            curveMesh = new THREE.Mesh(curveGeometry, this.tubeMaterial);
            this.add(curveMesh);
            this.bezier_curves.push(curveMesh);
            this.curveGroup.add(curveMesh);
        }
        this.add(this.curveGroup);
    }



    update(timeStamp) {
        const { count, rotDirection } = this.state;

        if (count % 50 == 0) {
            this.state.rotDirection *= -1;
        }


        this.left.rotateY(Math.PI / 200 * rotDirection);
        this.right.rotateY(Math.PI / 200 * -rotDirection);
        this.state.count++;

    }
}

export default Wing;