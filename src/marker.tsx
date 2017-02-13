import * as React from 'react';
import ProjectedLayer from './projected-layer';
import * as GeoJSON from 'geojson';

export interface Props {
  coordinates: GeoJSON.Position;
  anchor?: any;
  offset?: any;
  children?: JSX.Element;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  style?: React.CSSProperties;
}

const Marker: React.StatelessComponent<Props> = (props) => (
  <ProjectedLayer
    {...{ ...props, children: undefined}}
    className="mapboxgl-marker"
  >
    {props.children}
  </ProjectedLayer>
);

export default Marker;
