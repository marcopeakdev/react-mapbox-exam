import * as React from 'react';
const PropTypes = require('prop-types'); // tslint:disable-line

import { Map, LngLatBounds } from 'mapbox-gl';
import { Props as MarkerProps } from './marker';
const supercluster = require('supercluster'); // tslint:disable-line
import * as GeoJSON from 'geojson';
import { Feature } from './util/types';
import * as bbox from '@turf/bbox';
import { polygon, featureCollection } from '@turf/helpers';

export interface Props {
  ClusterMarkerFactory(
    coordinates: GeoJSON.Position,
    pointCount: number,
    getLeaves: (
      limit?: number,
      offset?: number
    ) => Array<React.ReactElement<MarkerProps>>
  ): React.ReactElement<MarkerProps>;
  radius?: number;
  maxZoom?: number;
  minZoom?: number;
  extent?: number;
  nodeSize?: number;
  log?: boolean;
  zoomOnClick?: boolean;
  zoomOnClickPadding?: number;
  children?: Array<React.Component<MarkerProps, {}>>;
}

export interface State {
  superC: any;
  clusterPoints: Array<GeoJSON.Feature<GeoJSON.Point>>;
}

export interface Context {
  map: Map;
}

export default class Cluster extends React.Component<Props, State> {
  public context: Context;

  public static contextTypes = {
    map: PropTypes.object
  };

  public static defaultProps = {
    radius: 60,
    minZoom: 0,
    maxZoom: 16,
    extent: 512,
    nodeSize: 64,
    log: false,
    zoomOnClick: false,
    zoomOnClickPadding: 20
  };

  public state: State = {
    superC: supercluster({
      radius: this.props.radius,
      maxZoom: this.props.maxZoom,
      minZoom: this.props.minZoom,
      extent: this.props.extent,
      nodeSize: this.props.nodeSize,
      log: this.props.log
    }),
    clusterPoints: []
  };

  private featureClusterMap = new WeakMap<
    Feature,
    React.Component<MarkerProps, any>
  >();

  public componentWillMount() {
    const { map } = this.context;
    const { children } = this.props;

    if (children) {
      this.childrenChange(children);
    }

    // TODO: Debounce ?
    map.on('move', this.mapChange);
    map.on('zoom', this.mapChange);
    this.mapChange();
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { children } = this.props;

    if (children !== nextProps.children) {
      this.childrenChange(nextProps.children);
      this.mapChange(true);
    }
  }

  private childrenChange = (newChildren: any) => {
    const { superC } = this.state;
    this.featureClusterMap = new WeakMap<
      Feature,
      React.Component<MarkerProps, {}>
    >();
    const features = this.childrenToFeatures(newChildren);
    superC.load(features);
  };

  private mapChange = (forceSetState: boolean = false) => {
    const { map } = this.context;
    const { superC, clusterPoints } = this.state;

    const zoom = map.getZoom();
    const canvas = map.getCanvas();
    const w = canvas.width;
    const h = canvas.height;
    const upLeft = map.unproject([0, 0]).toArray();
    const upRight = map.unproject([w, 0]).toArray();
    const downRight = map.unproject([w, h]).toArray();
    const downLeft = map.unproject([0, h]).toArray();
    const newPoints = superC.getClusters(
      bbox(polygon([[upLeft, upRight, downRight, downLeft, upLeft]])),
      Math.round(zoom)
    );
    if (newPoints.length !== clusterPoints.length || forceSetState) {
      this.setState({ clusterPoints: newPoints });
    }
  };

  private feature(coordinates: GeoJSON.Position): Feature {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates
      },
      properties: {}
    };
  }

  private childrenToFeatures = (
    children: Array<React.Component<MarkerProps, any>>
  ) =>
    children.map(child => {
      const feature = this.feature(child && child.props.coordinates);
      this.featureClusterMap.set(feature, child);
      return feature;
    });

  private getLeaves = (feature: Feature) => {
    const { superC } = this.state;
    return superC
      .getLeaves(feature.properties.cluster_id)
      .map((leave: Feature) => this.featureClusterMap.get(leave));
  };

  public zoomToClusterBounds = (event: React.MouseEvent<HTMLElement>) => {
    const markers = Array.prototype.slice.call(event.currentTarget.children);
    const marker = this.findMarkerElement(
      event.currentTarget,
      event.target as HTMLElement
    );
    const index = markers.indexOf(marker);
    const cluster = this.state.clusterPoints[index] as Feature;
    if (!cluster.properties.cluster_id) {
      return;
    }
    const children = this.state.superC.getLeaves(
      cluster.properties.cluster_id,
      Infinity
    );
    const childrenBbox = bbox(featureCollection(children));
    // https://github.com/mapbox/mapbox-gl-js/issues/5249
    this.context.map.fitBounds(LngLatBounds.convert(childrenBbox as any), {
      padding: this.props.zoomOnClickPadding!
    });
  };

  private findMarkerElement(
    target: HTMLElement,
    element: HTMLElement
  ): HTMLElement {
    if (element.parentElement === target) {
      return element;
    }
    return this.findMarkerElement(target, element.parentElement!);
  }

  public render() {
    const { ClusterMarkerFactory } = this.props;
    const { clusterPoints } = this.state;

    return (
      <div
        onClick={this.props.zoomOnClick ? this.zoomToClusterBounds : undefined}
      >
        {// tslint:disable-line:jsx-no-multiline-js
        clusterPoints.map((feature: Feature) => {
          if (feature.properties.cluster) {
            return ClusterMarkerFactory(
              feature.geometry.coordinates,
              feature.properties.point_count,
              this.getLeaves.bind(this, feature)
            );
          }
          return this.featureClusterMap.get(feature);
        })}
      </div>
    );
  }
}
