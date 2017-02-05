import * as MapboxGl from 'mapbox-gl/dist/mapbox-gl';
import * as React from 'react';
const isEqual = require('deep-equal'); // tslint:disable-line

const events = {
  onStyleLoad: 'style.load', // Should remain first
  onResize: 'resize',
  onDblClick: 'dblclick',
  onClick: 'click',
  onMouseMove: 'mousemove',
  onMoveStart: 'mousestart',
  onMove: 'move',
  onMoveEnd: 'moveend',
  onMouseUp: 'mouseup',
  onDragStart: 'dragstart',
  onDrag: 'drag',
  onDragEnd: 'dragend',
  onZoomStart: 'zoomstart',
  onZoom: 'zoom',
  onZoomEnd: 'zoomend'
};

export interface Events {
  onStyleLoad: Function;
  onResize: Function;
  onDblClick: Function;
  onClick: Function;
  onMouseMove: Function;
  onMoveStart: Function;
  onMove: Function;
  onMoveEnd: Function;
  onMouseUp: Function;
  onDragStart: Function;
  onDragEnd: Function;
  onDrag: Function;
  onZoomStart: Function;
  onZoom: Function;
  onZoomEnd: Function;
}

export interface FitBoundsOptions {
  linear?: boolean;
  easing?: Function;
  padding?: number;
  offset?: MapboxGl.Point | number[];
  maxZoom?: number;
}

export interface Props {
  style: string | MapboxGl.Style;
  accessToken: string;
  center?: number[];
  zoom?: number[];
  minZoom?: number;
  maxZoom?: number;
  maxBounds?: MapboxGl.LngLatBounds | number[][];
  fitBounds?: number[][];
  fitBoundsOptions?: FitBoundsOptions;
  bearing?: number;
  pitch?: number;
  containerStyle?: React.CSSProperties;
  hash?: boolean;
  preserveDrawingBuffer?: boolean;
  scrollZoom?: boolean;
  interactive?: boolean;
  dragRotate?: boolean;
  movingMethod?: 'jumpTo' | 'easeTo' | 'flyTo';
  attributionControl?: boolean;
  children?: JSX.Element;
}

export interface State {
  map?: MapboxGl.Map;
}

// Satisfy typescript pitfall with defaultProps
const defaultZoom = [11];
const defaultMovingMethod = 'flyTo';

export default class ReactMapboxGl extends React.Component<Props & Events, State> {
  public static defaultProps = {
    hash: false,
    onStyleLoad: (...args: any[]) => args,
    preserveDrawingBuffer: false,
    center: [
      -0.2416815,
      51.5285582
    ],
    zoom: defaultZoom,
    minZoom: 0,
    maxZoom: 20,
    bearing: 0,
    scrollZoom: true,
    movingMethod: defaultMovingMethod,
    pitch: 0,
    attributionPosition: 'bottom-right',
    interactive: true,
    dragRotate: true
  };

  public static childContextTypes = {
    map: React.PropTypes.object
  };

  public state = {
    map: undefined
  };

  public getChildContext = () => ({
    map: this.state.map
  })

  private container: HTMLElement;

  public componentDidMount() {
    const {
      style,
      hash,
      preserveDrawingBuffer,
      accessToken,
      center,
      pitch,
      zoom,
      minZoom,
      maxZoom,
      maxBounds,
      fitBounds,
      fitBoundsOptions,
      bearing,
      scrollZoom,
      attributionControl,
      interactive,
      dragRotate
    } = this.props;

    (MapboxGl as any).accessToken = accessToken;

    const map = new MapboxGl.Map({
      preserveDrawingBuffer,
      hash,
      // Duplicated default because Typescript can't figure out there is a defaultProps and zoom will never be undefined
      zoom: zoom ? zoom[0] : defaultZoom[0],
      minZoom,
      maxZoom,
      maxBounds,
      bearing,
      container: this.container,
      center,
      pitch,
      style,
      scrollZoom,
      attributionControl,
      interactive,
      dragRotate
    });

    if (fitBounds) {
      map.fitBounds(fitBounds, fitBoundsOptions);
    }

    Object.keys(events).forEach((event, index) => {
      const propEvent = this.props[event];

      if (propEvent) {
        map.on(events[event], (...args: any[]) => {
          propEvent(map, ...args);

          if (index === 0) {
            this.setState({ map });
          }
        });
      }
    });
  }

  public componentWillUnmount() {
    const { map } = this.state as State;

    if (map) {
      // Remove all events attached to the map
      map.off();

      // NOTE: We need to defer removing the map to after all children have unmounted
      setTimeout(() => {
        map.remove();
      });
    }
  }

  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    return (
      nextProps.children !== this.props.children ||
      nextProps.containerStyle !== this.props.containerStyle ||
      nextState.map !== this.state.map ||
      nextProps.style !== this.props.style ||
      nextProps.fitBounds !== this.props.fitBounds
    );
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { map } = this.state as State;
    if (!map) {
      return null;
    }

    const center = map.getCenter();
    const zoom = map.getZoom();
    const bearing = map.getBearing();
    const pitch = map.getPitch();

    const didZoomUpdate = (
      this.props.zoom !== nextProps.zoom &&
      (nextProps.zoom && nextProps.zoom[0]) !== zoom
    );

    const didCenterUpdate = (
      this.props.center !== nextProps.center &&
      (
        (nextProps.center && nextProps.center[0]) !== center.lng ||
        (nextProps.center && nextProps.center[1]) !== center.lat
      )
    );

    const didBearingUpdate = (
      this.props.bearing !== nextProps.bearing &&
      nextProps.bearing !== bearing
    );

    const didPitchUpdate = (
      this.props.pitch !== nextProps.pitch &&
      nextProps.pitch !== pitch
    );

    if (nextProps.fitBounds) {
      const { fitBounds } = this.props;

      const didFitBoundsUpdate = (
        fitBounds !== nextProps.fitBounds || // Check for reference equality
        nextProps.fitBounds.length !== (fitBounds && fitBounds.length) || // Added element
        !!fitBounds.find((c, i) => { // Check for equality
          const nc = nextProps.fitBounds && nextProps.fitBounds[i];
          return c[0] !== (nc && nc[0]) || c[1] !== (nc && nc[1]);
        })
      );

      if (didFitBoundsUpdate) {
        map.fitBounds(nextProps.fitBounds, nextProps.fitBoundsOptions);
      }
    }

    if (didZoomUpdate || didCenterUpdate || didBearingUpdate || didPitchUpdate) {
      const mm: string = this.props.movingMethod || defaultMovingMethod;
      map[mm]({
        zoom: (didZoomUpdate && nextProps.zoom) ? nextProps.zoom[0] : zoom,
        center: didCenterUpdate ? nextProps.center : center,
        bearing: didBearingUpdate ? nextProps.bearing : bearing,
        pitch: didPitchUpdate ? nextProps.pitch : pitch
      });
    }

    if (!isEqual(this.props.style, nextProps.style)) {
      map.setStyle(nextProps.style);
    }

    return null;
  }

  private setRef = (x: HTMLElement) => {
    this.container = x;
  }

  public render() {
    const { containerStyle, children } = this.props;
    const { map } = this.state;

    return (
      <div ref={this.setRef} style={containerStyle}>
        {map && children}
      </div>
    );
  }
}
