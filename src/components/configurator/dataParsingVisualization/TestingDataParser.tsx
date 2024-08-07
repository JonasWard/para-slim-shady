import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SemanticlyNestedDataEntry } from '../../../urlAsState/types/semanticlyNestedDataEntry';
import React from 'react';
import { DataEntry, DataEntryArray, VersionDescriptionWithValueType } from '../../../urlAsState/types/dataEntry';
import { parserObjects } from '../../../geometryGeneration/versions/parserObjects';
import { getTestStringValues, parseDownNestedDataDescription, parseUrlMethod } from '../../../urlAsState/objectmap/versionReading';
import { dataBitsStringifier } from '../../../urlAsState/parsers/parsers';
import { DisplayType, SemanticsRenderObject } from '../semantics/SemanticsRenderObject';
import { getDefaultObject, updateDataEntry } from '../../../urlAsState/objectmap/versionUpdate';
import { allTests } from '../../../urlAsState/test/dataParserTests';
import { Button } from 'antd';
import { FaArrowLeft } from 'react-icons/fa';

const renderDataAttributes = ['bits', 'min', 'max', 'precision'];

const RenderDataEntry: React.FC<{ dataEntry: DataEntry }> = ({ dataEntry }) => (
  <span style={{ padding: '0 10px' }}>
    <span key='value'>{`${dataEntry.value}`}</span>
    <span key='type' style={{ marginLeft: 12 }}>{`(${dataEntry.name} - ${dataEntry.index})`}</span>
    <span key='other values' style={{ marginLeft: 12 }}>
      {renderDataAttributes
        .map((aN) => (dataEntry.hasOwnProperty(aN) ? `${aN}: ${(dataEntry as any)[aN] as number | boolean | string}` : undefined))
        .filter((x) => x !== undefined)
        .join(', ')}
    </span>
    <span key='bits' style={{ marginLeft: 12 }}>
      bits: {dataBitsStringifier(dataEntry)}
    </span>
  </span>
);

const RendererSemanticlyNestedDataEntry: React.FC<{ data: SemanticlyNestedDataEntry }> = ({ data }) => (
  <div>
    {'{'}
    {Object.entries(data).map(([key, value]) => (
      <div key={key} style={{ padding: '0 10px' }}>
        <span>{`${key} -`}</span>
        {value.hasOwnProperty('type') ? (
          <RenderDataEntry dataEntry={value as DataEntry} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', padding: '0 10px' }}>
            <RendererSemanticlyNestedDataEntry data={value as SemanticlyNestedDataEntry} />
          </div>
        )}
      </div>
    ))}
    {'},'}
  </div>
);

const RendereDataArray: React.FC<{ data: DataEntry[] }> = ({ data }) => (
  <div>
    <span>DataArray: </span>
    {'['}
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {data.map((dataEntry, i) => (
        <span key={i}>
          <span>{i}</span> <RenderDataEntry key={dataEntry.name} dataEntry={dataEntry} />
        </span>
      ))}
    </div>
    {']'}
  </div>
);

const displayTypeMap = {
  ['extrusion']: DisplayType.POPOVER,
  ['footprint']: DisplayType.POPOVER,
  ['heights']: DisplayType.POPOVER,
  ['version']: DisplayType.POPOVER,
  ['settings']: DisplayType.POPOVER,
  ['base']: DisplayType.POPOVER,
  ['shapePreProcessing']: DisplayType.POPOVER,
};

const getSecondaryData = (url: string) => {
  try {
    return parseUrlMethod(url, parserObjects);
  } catch (e) {
    console.error(e);
    return {};
  }
};

export const TestingDataParser: React.FC = () => {
  const [data, setData] = useState<SemanticlyNestedDataEntry>(getDefaultObject(parserObjects, 0));
  const [activeName, setActiveName] = useState<string>('');
  const navigate = useNavigate();

  const { bitsString, base64BitString, base64SplitString, base64String, raw } = getTestStringValues(data);

  const updateData = (dataEntry: DataEntry) => setData(updateDataEntry(data, dataEntry, parserObjects));

  const secondaryData = getSecondaryData(base64String);

  allTests();

  return (
    <>
      <div style={{ overflowY: 'auto', height: '100vh', padding: '20px' }}>
        <Button onClick={() => navigate('/')}>
          <FaArrowLeft /> Back
        </Button>
        <span>NestedData: </span>
        <RendererSemanticlyNestedDataEntry data={data} />
        <hr />
        <RendereDataArray data={parseDownNestedDataDescription(data) as DataEntryArray} />
        <hr />
        <div style={{ fontFamily: 'monospace', fontSize: 10 }}>url: {base64String}</div>
        <div style={{ fontFamily: 'monospace', fontSize: 10 }}>bit: {bitsString}</div>
        <div style={{ fontFamily: 'monospace', fontSize: 10 }}>x64: {base64BitString}</div>
        <div style={{ fontFamily: 'monospace', fontSize: 10 }}>url: {base64SplitString}</div>
        <div style={{ fontFamily: 'monospace', fontSize: 10 }}>raw: {raw}</div>
        <hr />
        <div>Reading out the data:</div>

        {JSON.stringify(secondaryData) === JSON.stringify(data) ? (
          <div>data is the same</div>
        ) : (
          <div style={{ color: 'red' }}>
            <span>data is not the same</span>
            <RendererSemanticlyNestedDataEntry data={secondaryData} />
          </div>
        )}
      </div>
      <div style={{ position: 'absolute', top: 0, right: 0, padding: 10, width: 120 }}>
        <SemanticsRenderObject
          semantics={data}
          name={''}
          updateEntry={updateData}
          versionEnumSemantics={parserObjects[(data.version as VersionDescriptionWithValueType).value].versionEnumSemantics}
          displayTypeMap={displayTypeMap}
          activeName={activeName}
          setActiveName={setActiveName}
        />
      </div>
    </>
  );
};
