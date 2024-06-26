/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { ArcRotateCamera, Vector3, HemisphericLight, Color4, Mesh, PointLight, Scene, TransformNode } from '@babylonjs/core';
import './SceneRendering.css';
import '@babylonjs/loaders/glTF';
import SceneComponent from './configurator/SceneComponent';
import { GeometryBaseData, getHeightAndRadius } from '../geometryGeneration/baseGeometry';
import { AddLampGeometryToScene, RenderMethod } from '../geometryGeneration/geometryEntry';
import { CameraParameters } from './configurator/ViewCube';
/* eslint-disable */

// import model from "./assets/model2/scene.gltf";
export const BABYLON_CANVAS_ID = 'my-canvas';

type IAppProps = {
  gBD: GeometryBaseData;
  renderMethod?: RenderMethod;
  rerender: boolean;
  completedRerender: () => void;
  setActiveName: (s: string) => void;
  lastCameraParameters?: CameraParameters;
  scene: Scene | null;
  setScene: (scene: Scene) => void;
};

const App: React.FC<IAppProps> = ({ gBD, rerender, completedRerender, renderMethod, setActiveName, lastCameraParameters, scene, setScene }) => {
  const [mesh, setMesh] = useState<null | Mesh | TransformNode>(null);
  const [camera, setCamera] = useState<null | ArcRotateCamera>(null);

  const updateGeometry = (gBD: GeometryBaseData, mesh: Mesh | TransformNode | null, renderMethod?: RenderMethod) => {
    if (!scene?.isReady()) return;

    try {
      setMesh(AddLampGeometryToScene(gBD, scene, renderMethod));
    } catch (e) {
      console.error(e);
    }

    completedRerender();
  };

  const onClickWindowClearActiveName = () => (window.innerWidth < 800 || window.innerHeight < 800) && setActiveName('');

  const onSceneReady = (scene: any) => {
    const [targetHeight, radius] = getHeightAndRadius(gBD);

    const camera = new ArcRotateCamera('camera1', 1, 1, radius, new Vector3(0, targetHeight, 0), scene);
    camera.lowerRadiusLimit = 0.6;
    camera.upperRadiusLimit = 1000.0;
    camera.panningSensibility = 1000;

    setCamera(camera);

    const node = document.getElementById(BABYLON_CANVAS_ID);
    if (node) {
      node.addEventListener('click', onClickWindowClearActiveName);
      node.addEventListener('mousedown', onClickWindowClearActiveName);
      node.addEventListener('touchstart', onClickWindowClearActiveName);
    }

    const canvas = scene.getEngine().getRenderingCanvas();

    camera.attachControl(canvas, true);
    const light = new HemisphericLight('light', new Vector3(1, 1, 1), scene);
    light.intensity = 0.2;

    const lampLight = new PointLight('lampLight', new Vector3(0, 0.75, 0), scene);
    lampLight.intensity = 0.2;

    scene.clearColor = new Color4(0, 0, 0, 0);

    setScene(scene);

    updateGeometry(gBD, mesh, renderMethod);
  };

  useEffect(() => {
    if (camera && lastCameraParameters) {
      const [targetHeight, radius] = getHeightAndRadius(gBD);

      camera.alpha = lastCameraParameters.alfa;
      camera.beta = lastCameraParameters.beta;
      camera.radius = radius;
      camera.setTarget(new Vector3(lastCameraParameters.target.x, targetHeight, lastCameraParameters.target.z));
    }
  }, [lastCameraParameters]);

  const onRender = (scene: Scene) => {};

  useEffect(() => {
    if (rerender) updateGeometry(gBD, mesh, renderMethod);
  }, [rerender, gBD, mesh, renderMethod]);

  return (
    <SceneComponent
      antialias
      onSceneReady={onSceneReady}
      onRender={onRender}
      id={BABYLON_CANVAS_ID}
      engineOptions={{ adaptToDeviceRatio: true, antialias: true }}
    />
  );
};

export default App;
