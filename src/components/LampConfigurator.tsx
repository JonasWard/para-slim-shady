import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DisplayType, SemanticsRenderObject } from './configurator/semantics/SemanticsRenderObject';
import { getDefaultObject, updateDataEntry } from '../urlAsState/objectmap/versionUpdate';
import { parserObjects } from '../geometryGeneration/versions/parserObjects';
import { getValueObjectFrom, globalDataAttributeMapper } from '../geometryGeneration/versions/globalDataAttributeMapper';
import { SemanticlyNestedDataEntry } from '../urlAsState/types/semanticlyNestedDataEntry';
import { DataEntry } from '../urlAsState/types/dataEntry';
import BabylonScene from './SceneRendering';
import { GeometryBaseData } from '../geometryGeneration/baseGeometry';
import { RenderMethod } from '../geometryGeneration/geometryEntry';
import { UndoRedo } from './configurator/semantics/UndoRedo';
import { ViewSettings } from './configurator/ViewSettings';
import { CameraParameters, ViewCube, ViewCubePosition } from './configurator/ViewCube';
import { TopNavigation } from './configurator/TopNavigation';
import '../LandingPage.css';
import { getURLForData, parseUrlMethod } from '../urlAsState/objectmap/versionReading';
import { Scene } from '@babylonjs/core';
import { getHeights } from '../geometryGeneration/geometry';

const displayTypeMap =
  window.innerHeight < 800
    ? {
        ['extrusion']: DisplayType.DRAWER,
        ['footprint']: DisplayType.DRAWER,
        ['heights']: DisplayType.DRAWER,
        ['version']: DisplayType.DRAWER,
        ['settings']: DisplayType.DRAWER,
        ['base']: DisplayType.DRAWER,
        ['shapePostProcessing']: DisplayType.DRAWER,
      }
    : {
        ['extrusion']: DisplayType.POPOVER,
        ['footprint']: DisplayType.POPOVER,
        ['heights']: DisplayType.POPOVER,
        ['version']: DisplayType.POPOVER,
        ['settings']: DisplayType.POPOVER,
        ['base']: DisplayType.POPOVER,
        ['shapePostProcessing']: DisplayType.POPOVER,
      };

const commingSoon = ['shapePostProcessing'];

const tryParse = (s: string): SemanticlyNestedDataEntry => {
  try {
    return parseUrlMethod(s, parserObjects);
  } catch (e) {
    console.warn(e);
    const data = getDefaultObject(parserObjects, 0);
    return data;
  }
};

export const LampConfigurator: React.FC = () => {
  const { stateString } = useParams();
  const [scene, setScene] = useState<null | Scene>(null);

  const [sliderInput, setSliderInput] = useState<boolean>(true);
  const [rerender, setRerender] = useState<boolean>(false);
  const [lastURLFromData, setLastURLFromData] = useState<string>('');
  const [renderMethod, setRenderMethod] = useState<RenderMethod>(RenderMethod.NORMAL);
  const [activeName, setActiveName] = useState<string>('');
  const [lastCameraParameters, setLastCameraParameters] = useState<CameraParameters | undefined>();

  const updateURLFromData = (data: SemanticlyNestedDataEntry) => {
    const newUrl = getURLForData(data);
    window.history.replaceState(null, 'Same Page Title', `/para-slim-shady/#configurator/${newUrl}`);
    if (lastURLFromData !== newUrl) setRerender(true);
    setLastURLFromData(newUrl);
  };

  const [data, setData] = useState<SemanticlyNestedDataEntry>(tryParse(stateString ?? ''));

  const tryToHandelUndoRedo = (url: string) => {
    try {
      setData(parseUrlMethod(url, parserObjects));
    } catch (e) {
      console.warn(e);
    }
  };

  const updateData = (dataEntry: DataEntry) => setData(updateDataEntry(data, dataEntry, parserObjects));

  useEffect(() => {
    updateURLFromData(data);
  }, [data]);

  const resetData = (versionNumber: number) => setData(getDefaultObject(parserObjects, versionNumber));
  const viewCubePosition = window.innerWidth < 600 ? ViewCubePosition.AllCorners : ViewCubePosition.LeftBottomCorner;

  return (
    <>
      <TopNavigation activeName={activeName} setActiveName={setActiveName} />
      <BabylonScene
        setActiveName={setActiveName}
        gBD={getValueObjectFrom(data, globalDataAttributeMapper) as unknown as GeometryBaseData}
        rerender={rerender}
        completedRerender={() => setRerender(false)}
        renderMethod={renderMethod}
        lastCameraParameters={lastCameraParameters}
        scene={scene}
        setScene={setScene}
      />
      <div style={{ position: 'absolute', top: viewCubePosition === ViewCubePosition.AllCorners ? 30 : 0, right: 0, padding: 8 }}>
        <SemanticsRenderObject
          asSlider={sliderInput}
          semantics={data}
          name={''} // name is not used in this context
          updateEntry={updateData}
          versionEnumSemantics={parserObjects[0].versionEnumSemantics}
          activeName={activeName}
          setActiveName={setActiveName}
          displayTypeMap={displayTypeMap}
          updateVersion={(versionNumber) => resetData(versionNumber)}
          disabled={commingSoon}
        />
        <ViewSettings
          activeName={activeName}
          setActiveName={setActiveName}
          renderMethod={renderMethod}
          setRerender={setRerender}
          sliderInput={sliderInput}
          setSliderInput={setSliderInput}
          setRenderMethod={setRenderMethod}
          displayTypeMap={displayTypeMap}
          disabled={commingSoon}
          scene={scene}
          data={data}
        />
      </div>
      <UndoRedo activeUrl={lastURLFromData} setActiveUrl={tryToHandelUndoRedo} />
      {import.meta.env.DEV ? (
        <div style={{ position: 'absolute', left: 150, bottom: 20 }}>
          height:
          {getHeights((getValueObjectFrom(data, globalDataAttributeMapper) as unknown as GeometryBaseData).heights)
            .sort((a, b) => b - a)[0]
            .toFixed(3)}
          mm
        </div>
      ) : null}
      <ViewCube size={20} viewCubePosition={viewCubePosition} onSideChange={setLastCameraParameters} />
    </>
  );
};
