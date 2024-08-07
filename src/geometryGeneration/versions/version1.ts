import { ExtrusionCategory } from '../extrusionProfiles/types/extrusionCategory';
import { FootprintCategory } from '../footprints/types/footprintCategory';
import { ProcessingMethodCategory } from '../processingMethods/types/processingMethodCategory';
import { DataEntryFactory } from '../../urlAsState/factory/factory';
import { DefinitionArrayObject, ParserForVersion } from '../../urlAsState/types/versionParser';
import { VersionParameterNames } from './parameterNames';
import { DataEntry } from '../../urlAsState/types/dataEntry';
import { Versions } from './versions';

const processingMethodTypes = [
  { value: ProcessingMethodCategory.IncrementalMethod, label: 'Incremental Method' },
  { value: ProcessingMethodCategory.Sin, label: 'Sin Method' },
  { value: ProcessingMethodCategory.None, label: 'None Method' },
];

const version1EnumSemantics = {
  [VersionParameterNames.extrusionType]: [
    // { value: ExtrusionCategory.Square, label: 'Square Extrusion' },
    { value: ExtrusionCategory.Arc, label: 'Arc Extrusion' },
    { value: ExtrusionCategory.Ellipse, label: 'Ellipse Extrusion' },
    { value: ExtrusionCategory.Gothic, label: 'Gothic Arc Extrusion' },
    { value: ExtrusionCategory.Nested, label: 'Nested Arc Extrusion' },
  ],
  [VersionParameterNames.footprintType]: [
    { value: FootprintCategory.Square, label: 'Square Footprint' },
    { value: FootprintCategory.SquareGrid, label: 'Square Grid Footprint' },
    { value: FootprintCategory.TriangleGrid, label: 'Triangle Grid Footprint' },
    { value: FootprintCategory.HexGrid, label: 'Hex Grid Footprint' },
    { value: FootprintCategory.Cylinder, label: 'Cylinder Footprint' },
    { value: FootprintCategory.MalculmiusOne, label: 'Malculmius One Footprint' },
  ],
  [VersionParameterNames.processingMethodType]: processingMethodTypes,
  [VersionParameterNames.shapePreProcessingTwistabsolute]: processingMethodTypes,
  [VersionParameterNames.shapePreProcessingWarpprocessingMethodType]: processingMethodTypes,
  [VersionParameterNames.shapePreProcessingTwistprocessingMethodType]: processingMethodTypes,
  [VersionParameterNames.shellThickness]: [
    { value: 0, label: 'Massive' },
    { value: 1, label: '1 Layer' },
    { value: 2, label: '2 Layers' },
    { value: 3, label: '3 Layers' },
  ],
  [VersionParameterNames.version]: Versions,
};

const extrusionTypeParser = (extrusionDataEntry: DataEntry): DefinitionArrayObject => {
  switch (extrusionDataEntry.value) {
    case ExtrusionCategory.Square:
      return [
        extrusionDataEntry,
        DataEntryFactory.createFloat(0.25, 0.01, 0.45, 2, VersionParameterNames.insetTop),
        DataEntryFactory.createFloat(0.25, 0.01, 0.45, 2, VersionParameterNames.insetBottom),
        DataEntryFactory.createFloat(0.25, 0.01, 0.45, 2, VersionParameterNames.insetSides),
      ];
    case ExtrusionCategory.Arc:
      return [
        extrusionDataEntry,
        DataEntryFactory.createFloat(0.35, 0.2, 1.0, 2, VersionParameterNames.radiusTop),
        DataEntryFactory.createFloat(0.25, 0.01, 0.45, 2, VersionParameterNames.insetTop),
        DataEntryFactory.createFloat(0.25, 0.01, 0.45, 2, VersionParameterNames.insetBottom),
        DataEntryFactory.createFloat(0.25, 0.01, 0.45, 2, VersionParameterNames.insetSides),
      ];
    case ExtrusionCategory.Ellipse:
      return [
        extrusionDataEntry,
        DataEntryFactory.createFloat(0.35, 0.2, 0.8, 2, VersionParameterNames.radiusTop),
        DataEntryFactory.createFloat(0.25, 0.01, 0.45, 2, VersionParameterNames.insetTop),
        DataEntryFactory.createFloat(0.25, 0.01, 0.45, 2, VersionParameterNames.insetBottom),
        DataEntryFactory.createFloat(0.25, 0.01, 0.45, 2, VersionParameterNames.insetSides),
      ];
    case ExtrusionCategory.Gothic:
      return [
        extrusionDataEntry,
        DataEntryFactory.createFloat(0.35, 0.2, 0.8, 2, VersionParameterNames.radiusTop),
        DataEntryFactory.createFloat(0.25, 0.01, 0.45, 2, VersionParameterNames.insetTop),
        DataEntryFactory.createFloat(0.25, 0.01, 0.45, 2, VersionParameterNames.insetBottom),
        DataEntryFactory.createFloat(0.25, 0.01, 0.45, 2, VersionParameterNames.insetSides),
        DataEntryFactory.createFloat(0.25, 0.1, 0.5, 2, VersionParameterNames.pointedness),
      ];
    case ExtrusionCategory.Nested:
      return [
        extrusionDataEntry,
        DataEntryFactory.createFloat(0.35, 0.2, 1.0, 2, VersionParameterNames.radiusTop),
        DataEntryFactory.createFloat(0.25, 0.01, 0.45, 2, VersionParameterNames.insetTop),
        DataEntryFactory.createFloat(0.25, 0.01, 0.45, 2, VersionParameterNames.insetBottom),
        DataEntryFactory.createFloat(0.25, 0.01, 0.45, 2, VersionParameterNames.insetSides),
        DataEntryFactory.createFloat(1, 0, 1, 2, VersionParameterNames.pointedness),
        DataEntryFactory.createFloat(1, 0, 1, 2, VersionParameterNames.divisionPointedness),
        DataEntryFactory.createInt(1, 1, 10, VersionParameterNames.divisionCount),
        DataEntryFactory.createInt(1, 1, 32, VersionParameterNames.divisionResolution),
      ];
    default:
      throw new Error('Extrusion type not found');
  }
};

const footprintTypeParser = (footprintDataEntry: DataEntry): DefinitionArrayObject => {
  switch (footprintDataEntry.value) {
    case FootprintCategory.Square:
      return [footprintDataEntry, DataEntryFactory.createFloat(50, 40, 120, 0, VersionParameterNames.size)];
    case FootprintCategory.SquareGrid:
    case FootprintCategory.TriangleGrid:
    case FootprintCategory.HexGrid:
      return [
        footprintDataEntry,
        DataEntryFactory.createFloat(20, 8, 120, 0, VersionParameterNames.size),
        DataEntryFactory.createInt(3, 1, 16, VersionParameterNames.xCount),
        DataEntryFactory.createInt(0, 0, 8, VersionParameterNames.yCount),
        DataEntryFactory.createEnum(0, 3, VersionParameterNames.shellThickness),
        DataEntryFactory.createFloat(2, 0, 10, 1, VersionParameterNames.bufferInside),
        DataEntryFactory.createFloat(2, 0, 10, 1, VersionParameterNames.bufferOutside),
      ];
    case FootprintCategory.Cylinder:
      return [
        footprintDataEntry,
        DataEntryFactory.createFloat(2, 0, 10, 1, VersionParameterNames.bufferInside),
        DataEntryFactory.createFloat(12, 8, 40, 1, VersionParameterNames.radius0),
        DataEntryFactory.createFloat(12, 0, 40, 1, VersionParameterNames.radius1),
        DataEntryFactory.createFloat(12, 0, 40, 1, VersionParameterNames.radius2),
        DataEntryFactory.createFloat(2, 0, 10, 1, VersionParameterNames.bufferOutside),
        DataEntryFactory.createInt(5, 3, 20, VersionParameterNames.segments),
      ];

    case FootprintCategory.MalculmiusOne:
      return [
        footprintDataEntry,
        DataEntryFactory.createFloat(35, 10, 55, 1, VersionParameterNames.circleRadius),
        DataEntryFactory.createInt(5, 3, 20, VersionParameterNames.circleDivisions),
        DataEntryFactory.createFloat(0.5, 0.1, 0.9, 2, VersionParameterNames.angleSplit),
        DataEntryFactory.createFloat(0, -20, 20, 1, VersionParameterNames.offsetA),
        DataEntryFactory.createFloat(0, -20, 20, 1, VersionParameterNames.offsetB),
        DataEntryFactory.createFloat(5, 4, 40, 1, VersionParameterNames.innerRadius),
      ];
    default:
      throw new Error('Footprint type not found');
  }
};

const heightMethodTypeParser = (heightMethodDataEntry: DataEntry): DefinitionArrayObject => [
  DataEntryFactory.createFloat(150, 50, 300, 0, VersionParameterNames.totalHeight),
  DataEntryFactory.createInt(7, 1, 20, VersionParameterNames.storyCount),
  [
    VersionParameterNames.heightProcessingMethod,
    heightMethodDataEntry,
    (heightMethodDataEntry: DataEntry): DefinitionArrayObject => {
      switch (heightMethodDataEntry.value) {
        case ProcessingMethodCategory.IncrementalMethod:
          return [
            heightMethodDataEntry,
            DataEntryFactory.createFloat(20, 10, 200, -1, VersionParameterNames.total),
            DataEntryFactory.createFloat(5, 0, 15, 2, VersionParameterNames.linearTwist),
          ];
        case ProcessingMethodCategory.Sin:
          return [
            heightMethodDataEntry,
            DataEntryFactory.createFloat(1, 0, 4, 1, VersionParameterNames.maxAmplitude),
            DataEntryFactory.createFloat(1, 0, 4, 2, VersionParameterNames.minAmplitude),
            DataEntryFactory.createFloat(1, 0.2, 200, 1, VersionParameterNames.period),
            DataEntryFactory.createFloat(0, 0, 360, 0, VersionParameterNames.phaseShift),
          ];
        case ProcessingMethodCategory.None:
          return [heightMethodDataEntry];
        default:
          throw new Error('Height processing method not found');
      }
    },
  ],
];

const shapePostProcessingMethodParser = (shapePostProcessingDataEntry: DataEntry): DefinitionArrayObject => {
  switch (shapePostProcessingDataEntry.value) {
    case ProcessingMethodCategory.IncrementalMethod:
      return [
        shapePostProcessingDataEntry,
        DataEntryFactory.createFloat(20, 10, 200, -1, VersionParameterNames.shapePostProcessingtotal),
        DataEntryFactory.createFloat(5, 0, 15, 2, VersionParameterNames.shapePostProcessinglinearTwist),
      ];
    case ProcessingMethodCategory.Sin:
      return [
        shapePostProcessingDataEntry,
        DataEntryFactory.createFloat(1, 0, 4, 1, VersionParameterNames.shapePostProcessingmaxAmplitude),
        DataEntryFactory.createFloat(1, 0, 4, 2, VersionParameterNames.shapePostProcessingminAmplitude),
        DataEntryFactory.createFloat(1, 0.2, 200, 1, VersionParameterNames.shapePostProcessingperiod),
        DataEntryFactory.createFloat(4, 0, 90, 1, VersionParameterNames.shapePostProcessingphaseShift),
      ];
    case ProcessingMethodCategory.None:
      return [shapePostProcessingDataEntry];
    default:
      throw new Error('Height processing method not found');
  }
};

const shapePreProcessingWarpMethod = (shapePreProcessingWarpDataEntry: DataEntry): DefinitionArrayObject => {
  switch (shapePreProcessingWarpDataEntry.value) {
    case ProcessingMethodCategory.IncrementalMethod:
      return [
        shapePreProcessingWarpDataEntry,
        DataEntryFactory.createBoolean(false, VersionParameterNames.shapePreProcessingWarpabsolute),
        DataEntryFactory.createFloat(20, 10, 200, -1, VersionParameterNames.shapePreProcessingWarptotal),
        DataEntryFactory.createFloat(5, 0, 15, 2, VersionParameterNames.shapePreProcessingWarplinearTwist),
      ];
    case ProcessingMethodCategory.Sin:
      return [
        shapePreProcessingWarpDataEntry,
        DataEntryFactory.createBoolean(false, VersionParameterNames.shapePreProcessingWarpabsolute),
        DataEntryFactory.createFloat(1, 0, 4, 1, VersionParameterNames.shapePreProcessingWarpmaxAmplitude),
        DataEntryFactory.createFloat(1, 0, 4, 2, VersionParameterNames.shapePreProcessingWarpminAmplitude),
        DataEntryFactory.createFloat(500, 2, 2000, 0, VersionParameterNames.shapePreProcessingWarpperiod),
        DataEntryFactory.createFloat(0, 0, 1, 2, VersionParameterNames.shapePreProcessingWarpphaseShift),
      ];
    case ProcessingMethodCategory.None:
      return [shapePreProcessingWarpDataEntry];
    default:
      throw new Error('Warp processing method not found');
  }
};

const shapePreProcessingTwistMethod = (shapePreProcessingTwistDataEntry: DataEntry): DefinitionArrayObject => {
  switch (shapePreProcessingTwistDataEntry.value) {
    case ProcessingMethodCategory.IncrementalMethod:
      return [
        shapePreProcessingTwistDataEntry,
        DataEntryFactory.createBoolean(false, VersionParameterNames.shapePreProcessingTwistabsolute),
        DataEntryFactory.createFloat(20, 10, 200, -1, VersionParameterNames.shapePreProcessingTwisttotal),
        DataEntryFactory.createFloat(5, 0, 15, 2, VersionParameterNames.shapePreProcessingTwistlinearTwist),
      ];
    case ProcessingMethodCategory.Sin:
      return [
        shapePreProcessingTwistDataEntry,
        DataEntryFactory.createBoolean(false, VersionParameterNames.shapePreProcessingTwistabsolute),
        DataEntryFactory.createFloat(1, 0, 4, 1, VersionParameterNames.shapePreProcessingTwistmaxAmplitude),
        DataEntryFactory.createFloat(1, 0, 4, 2, VersionParameterNames.shapePreProcessingTwistminAmplitude),
        DataEntryFactory.createFloat(500, 2, 2000, 0, VersionParameterNames.shapePreProcessingTwistperiod),
        DataEntryFactory.createFloat(0, 0, 1, 2, VersionParameterNames.shapePreProcessingTwistphaseShift),
      ];
    case ProcessingMethodCategory.None:
      return [shapePreProcessingTwistDataEntry];
    default:
      throw new Error('Twist processing method not found');
  }
};

const getMax = (
  v:
    | VersionParameterNames.extrusionType
    | VersionParameterNames.footprintType
    | VersionParameterNames.processingMethodType
    | VersionParameterNames.shapePreProcessingTwistabsolute
    | VersionParameterNames.shapePreProcessingWarpprocessingMethodType
    | VersionParameterNames.shapePreProcessingTwistprocessingMethodType
    | VersionParameterNames.shellThickness
    | VersionParameterNames.version
) => (version1EnumSemantics.hasOwnProperty(v) ? Math.max(...version1EnumSemantics[v].map(({ value }) => value)) : 3);

const version1objectGenerationDescriptor: DefinitionArrayObject = [
  DataEntryFactory.createVersion(1, 8, VersionParameterNames.version, 0),
  [
    VersionParameterNames.extrusion,
    DataEntryFactory.createEnum(ExtrusionCategory.Gothic, getMax(VersionParameterNames.extrusionType), VersionParameterNames.extrusionType),
    extrusionTypeParser,
  ],
  [
    VersionParameterNames.footprint,
    DataEntryFactory.createEnum(FootprintCategory.MalculmiusOne, getMax(VersionParameterNames.footprintType), VersionParameterNames.footprintType),
    footprintTypeParser,
  ],
  [
    VersionParameterNames.heights,
    DataEntryFactory.createEnum(
      ProcessingMethodCategory.IncrementalMethod,
      getMax(VersionParameterNames.processingMethodType),
      VersionParameterNames.processingMethodType
    ),
    heightMethodTypeParser,
  ],
  [
    VersionParameterNames.base,
    [
      DataEntryFactory.createFloat(20, 10, 100, 0, VersionParameterNames.sideHeight),
      DataEntryFactory.createFloat(5, 0, 20, 1, VersionParameterNames.sideInnerRadius),
    ],
  ],
  [
    VersionParameterNames.shapePreProcessing,
    [
      [
        VersionParameterNames.shapePreProcessingWarp,
        DataEntryFactory.createEnum(ProcessingMethodCategory.None, 2, VersionParameterNames.shapePreProcessingWarpprocessingMethodType),
        shapePreProcessingWarpMethod,
      ],
      [
        VersionParameterNames.shapePreProcessingTwist,
        DataEntryFactory.createEnum(ProcessingMethodCategory.None, 2, VersionParameterNames.shapePreProcessingTwistprocessingMethodType),
        shapePreProcessingTwistMethod,
      ],
    ],
  ],
];

export const parserVersion1: ParserForVersion = {
  version: 1,
  versionName: 'beta',
  versionEnumSemantics: version1EnumSemantics,
  objectGeneratorParameters: version1objectGenerationDescriptor,
};
