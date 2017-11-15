import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as MapboxGL from 'mapbox-gl';
const isEqual = require('deep-equal'); //tslint:disable-line
import diff from './util/diff';
import * as GeoJSON from 'geojson';
import { Sources, Feature, Context } from './util/types';

export type Paint = any;
export type Layout = any;
export interface ImageOptions {
  width?: number;
  height?: number;
  pixelRatio?: number;
}
export type ImageDefinition = [string, HTMLImageElement];
export type ImageDefinitionWithOptions = [
  string,
  HTMLImageElement,
  ImageOptions
];

export interface LayerCommonProps {
  type?: 'symbol' | 'line' | 'fill' | 'circle' | 'raster';
  sourceId?: string;
  images?:
    | ImageDefinition
    | ImageDefinition[]
    | ImageDefinitionWithOptions
    | ImageDefinitionWithOptions[];
  before?: string;
  sourceOptions?: Sources;
  paint?: Paint;
  layout?: Layout;
  layerOptions?: Partial<MapboxGL.Layer>;
  children?: JSX.Element | JSX.Element[];
}

export interface OwnProps {
  id: string;
  draggedChildren?: JSX.Element[];
}

export type Props = LayerCommonProps & OwnProps;

export default class Layer extends React.Component<Props, {}> {
  public context: Context;

  public static contextTypes = {
    map: PropTypes.object
  };

  public static defaultProps = {
    type: 'symbol' as 'symbol',
    layout: {},
    paint: {}
  };

  private source: Sources = {
    type: 'geojson',
    ...this.props.sourceOptions,
    data: {
      type: 'FeatureCollection',
      features: []
    }
  };

  private geometry = (coordinates: GeoJSON.Position) => {
    switch (this.props.type) {
      case 'symbol':
      case 'circle':
        return {
          type: 'Point',
          coordinates
        };

      case 'fill':
        return {
          type: coordinates.length > 1 ? 'MultiPolygon' : 'Polygon',
          coordinates
        };

      case 'line':
        return {
          type: 'LineString',
          coordinates
        };

      default:
        return {
          type: 'Point',
          coordinates
        };
    }
  };

  private makeFeature = (props: any, id: number): Feature => ({
    type: 'Feature',
    geometry: this.geometry(props.coordinates),
    properties: { ...props.properties, id }
  });

  private initialize = () => {
    const {
      type,
      layout,
      paint,
      layerOptions,
      sourceId,
      before,
      images,
      id
    } = this.props;
    const { map } = this.context;

    const layer = {
      id,
      source: sourceId || id,
      type,
      layout,
      paint,
      ...layerOptions
    };

    if (images) {
      const normalizedImages = !Array.isArray(images[0]) ? [images] : images;
      (normalizedImages as ImageDefinitionWithOptions[]).forEach(image => {
        map.addImage(image[0], image[1], image[2]);
      });
    }

    if (!sourceId) {
      map.addSource(id, this.source);
    }

    map.addLayer(layer, before);
  };

  private onStyleDataChange = () => {
    // if the style of the map has been updated and we don't have layer anymore,
    // add it back to the map and force re-rendering to redraw it
    if (!this.context.map.getLayer(this.props.id)) {
      this.initialize();
      this.forceUpdate();
    }
  };

  public componentWillMount() {
    const { map } = this.context;

    this.initialize();

    map.on('styledata', this.onStyleDataChange);
  }

  public componentWillUnmount() {
    const { map } = this.context;
    const { images, id } = this.props;

    if (!map || !map.getStyle()) {
      return;
    }

    map.removeLayer(id);
    // if pointing to an existing source, don't remove
    // as other layers may be dependent upon it
    if (!this.props.sourceId) {
      map.removeSource(id);
    }

    if (images) {
      const normalizedImages = !Array.isArray(images[0]) ? [images] : images;
      (normalizedImages as ImageDefinitionWithOptions[])
        .map(([key, ...rest]) => key)
        .forEach(map.removeImage);
    }

    map.off('styledata', this.onStyleDataChange);
  }

  public componentWillReceiveProps(props: Props) {
    const { paint, layout, before, layerOptions, id } = this.props;
    const { map } = this.context;

    if (!isEqual(props.paint, paint)) {
      const paintDiff = diff(paint, props.paint);

      Object.keys(paintDiff).forEach(key => {
        map.setPaintProperty(id, key, paintDiff[key]);
      });
    }

    if (!isEqual(props.layout, layout)) {
      const layoutDiff = diff(layout, props.layout);

      Object.keys(layoutDiff).forEach(key => {
        map.setLayoutProperty(id, key, layoutDiff[key]);
      });
    }

    if (
      props.layerOptions &&
      layerOptions &&
      !isEqual(props.layerOptions.filter, layerOptions.filter)
    ) {
      map.setFilter(id, props.layerOptions.filter as any);
    }

    if (before !== props.before) {
      map.moveLayer(id, props.before);
    }
  }

  public render() {
    const { map } = this.context;
    const { sourceId, draggedChildren } = this.props;
    let { children } = this.props;

    if (!children) {
      children = [] as JSX.Element[];
    }

    if (draggedChildren) {
      children = draggedChildren;
    } else {
      children = Array.isArray(children)
        ? (children as JSX.Element[][]).reduce(
            (arr, next) => arr.concat(next),
            [] as JSX.Element[]
          )
        : [children] as JSX.Element[];
    }

    const features = (children! as Array<React.ReactElement<any>>)
      .map(({ props }, id) => this.makeFeature(props, id))
      .filter(Boolean);

    const source = map.getSource(
      sourceId || this.props.id
    ) as MapboxGL.GeoJSONSource;

    if (source && !sourceId && source.setData) {
      source.setData({
        type: 'FeatureCollection',
        features
      });
    }

    return null;
  }
}
