# ReactMapboxGl
Factory function that return a React Mapbox component. Parameters of the factory function are static, properties of your component are dynamic and get updated if they changes between rendering.

> To use the original Mapbox API use `onStyleLoad` property, the callback function will receive the map object as a first arguments, then you can add your own logic alongside react-mapbox-gl. [mapbox gl API](https://www.mapbox.com/mapbox-gl-js/api/).

### How to use
```jsx
import ReactMapboxGl from "react-mapbox-gl";

...

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoiZmFicmljOCIsImEiOiJjaWc5aTV1ZzUwMDJwdzJrb2w0dXRmc2d0In0.p6GGlfyV-WksaDV_KdN27A"
});

<Map style="mapbox://styles/mapbox/streets-v8"/>
```

### Factory parameters
- **accessToken** *(required)* : `String` Mapbox access token.
- **apiUrl**: `String` Define a custom URL to fetch the vector tiles.
- **minZoom** *(Default: `0`)*: `Number` Minimum zoom level. Must be between 0 and 20.
- **maxZoom** *(Default: `20`)*: `Number` Maximum zoom level. Must be between 0 and 20.
- **scrollZoom** *(Default: `true`)*: See [mapbox scrollZoom](https://www.mapbox.com/mapbox-gl-js/api/#Map)
- **hash** *(Default: `false`)*: `Boolean`, [See mapbox doc](https://www.mapbox.com/mapbox-gl-js/api/#Map)
- **preserveDrawingBuffer** *(Default: `false`)*: `Boolean`, [See mapbox doc](https://www.mapbox.com/mapbox-gl-js/api/#Map)
- **interactive** *(Default: `true`)*: `Boolean` Set to `false` to disable interaction with the map.
- **attributionControl** *(Default: `true`)*: `Boolean` Set to `false` to remove the attribution on the map.
- **logoPosition** *(Default: `bottom-left`)*: `string` Set the position of the mapbox logo. Possible values:
  - `top-left`
  - `top-right`
  - `bottom-right`
  - `bottom-left`
- **renderWorldCopies** *(Default: `true`)*: `Boolean` If `true`, multiple copies of the world will be rendered, when zoomed out.
- **dragRotate** *(Default: `true`)*: `Boolean` Set to `false` to disable drag rotation, see [mapbox DragRotateHandler](https://www.mapbox.com/mapbox-gl-js/api/#DragRotateHandler)
- **trackResize** *(Default: `true`)*: `boolean` If  `true`, the map will automatically resize when the browser window resizes.
- **touchZoomRotate** *(Default: `true`)*: `boolean` If  `true`, the "pinch to rotate and zoom" interaction is enabled. An  Object value is passed as options to TouchZoomRotateHandler#enable .
- **doubleClickZoom** *(Default: `true`)*: `boolean` If  `true`, the "double click to zoom" interaction is enabled (see DoubleClickZoomHandler).
- **keyboard** *(Default: `true`)*: `boolean` If  `true` , keyboard shortcuts are enabled (see KeyboardHandler).
- **dragPan** *(Default: `true`)*: `boolean` If  `true` , the "drag to pan" interaction is enabled (see DragPanHandler).
- **refreshExpiredTiles** *(Default: `true`)*: `boolean` If  `false` , the map won't attempt to re-request tiles once they expire per their HTTP cacheControl / expires headers.
- **failIfMajorPerformanceCaveat** *(Default: `false`)*: `boolean` If  `true` , map creation will fail if the performance of Mapbox GL JS would be dramatically worse than expected (i.e. a software renderer would be used).
- **classes**: `string[]` Mapbox style class names with which to initialize the map. Keep in mind that these classes are used for controlling a style layer's paint properties, so are not reflected in an HTML element's  class attribute. To learn more about Mapbox style classes, read about Layers in the style specification.
- **bearingSnap** *(Default: `7`)*: `number` The threshold, measured in degrees, that determines when the map's bearing (rotation) will snap to north. For example, with a  bearingSnap of 7, if the user rotates the map within 7 degrees of north, the map will automatically snap to exact north.
- **injectCss** *(Default: `true`)*: `boolean` If `false`, the factory will no try to inject the default CSS for the map into the `<head>` element.


### Component Properties
- **style** *(required)* : `string | Object`  Mapbox map style, if changed, the style will be updated using `setStyle`.
- **center** *(Default: `[ -0.2416815, 51.5285582 ]`)*: `[number, number]` Center the map at the position at initialisation
  - Must be in longitude, latitude coordinate order (as opposed to latitude, longitude) to match GeoJSON (source: https://www.mapbox.com/mapbox-gl-js/api/#lnglat). 
  - Re-center the map if the value change regarding the prev value or the actual center position [flyTo](https://www.mapbox.com/mapbox-gl-js/api/#Map.flyTo)
- **zoom** *(Default: `[11]`)*: `[number]` Zoom level of the map at initialisation wrapped in an array.
  - Check for reference equality between the previous value of zoom and the new one in order to update it or not.
- **maxBounds** : `LngLatBounds | Array<Array<number>>` If set, the map is constrained to the given bounds [SouthWest, NorthEast]
- **fitBounds** : `Array<Array<number>>` If set, the map will center on the given coordinates, [fitBounds](https://www.mapbox.com/mapbox-gl-js/api/#Map#fitBounds)
- **fitBoundsOptions** : `FitBoundsOptions` Options for [fitBounds](https://www.mapbox.com/mapbox-gl-js/api/#Map#fitBounds)
- **bearing**: `[number]` Bearing (rotation) of the map at initialisation measured in degrees counter-clockwise from north.
  - Check the previous value and the new one, if the value changed update the bearing value [flyTo](https://www.mapbox.com/mapbox-gl-js/api/#Map.flyTo)
- **pitch**: `[number]` Pitch (tilt) of the map at initialisation, range : `0 - 60`
- **containerStyle** : `Object` The style of the container of the map
- **ClassName** : `string` ClassName passed down to the container div
- **movingMethod** *(Default: `flyTo`)*: `String` define the method used when changing the center or zoom position. Possible value :
  - `jumpTo`
  - `easeTo`
  - `flyTo`
- **animationOptions** : `AnimationOptions` Options for moving animation [see](https://www.mapbox.com/mapbox-gl-js/api/#animationoptions)
- **flyToOptions** : `FlyToOptions` Options for flyTo animation [see](https://www.mapbox.com/mapbox-gl-js/api/#map#flyto)

### Events
All mapbox map events are implemented, see events section on mapbox documentation [api](https://www.mapbox.com/mapbox-gl-js/api). All the events have the following signature `(map: Mapbox.Map, evt: React.SyntheticEvent<any>) => void`.

The events name are transformed to camelcase:
```js

const events = {
  // Triggered when style of the map has loaded
  onStyleLoad,

  // mapbox-gl events
  onResize: 'resize',
  onDblClick: 'dblclick',
  onClick: 'click',
  onMouseMove: 'mousemove',
  onMouseOut: 'mouseout',
  onMoveStart: 'movestart',
  onMove: 'move',
  onMoveEnd: 'moveend',
  onMouseUp: 'mouseup',
  onMouseDown: 'mousedown',
  onDragStart: 'dragstart',
  onDrag: 'drag',
  onDragEnd: 'dragend',
  onZoomStart: 'zoomstart',
  onZoom: 'zoom',
  onZoomEnd: 'zoomend',
  onPitch: 'pitch',
  onPitchStart: 'pitchstart',
  onPitchEnd: 'pitchend',
  onWebGlContextLost: 'webglcontextlost',
  onWebGlContextRestored: 'webglcontextrestored',
  onRemove: 'remove',
  onContextMenu: 'contextmenu',
  onRender: 'render',
  onError: 'error',
  onSourceData: 'sourcedata',
  onDataLoading: 'dataloading',
  onStyleDataLoading: 'styledataloading',
  onTouchCancel: 'touchcancel',
  onData: 'data',
  onSourceDataLoading: 'sourcedataloading',
  onTouchMove: 'touchmove',
  onTouchEnd: 'touchend',
  onTouchStart: 'touchstart',
  onStyleData: 'styledata',
  onBoxZoomStart: 'boxzoomstart',
  onBoxZoomEnd: 'boxzoomend',
  onBoxZoomCancel: 'boxzoomcancel',
  onRotateStart: 'rotatestart',
  onRotate: 'rotate',
  onRotateEnd: 'rotateend'
};
```

----------
# Layer
Create a new Mapbox layer and create all the sources depending on the children `Feature` components.

If you change the value of the paint or the layout property of the layer, it will automatically update this property using respectively either `setLayoutProperty` or `setPaintProperty`.
> Only work with the first depth of the object.

### How to use
```jsx
import { Layer } from "react-mapbox-gl";

...

<Layer
  type="symbol"
  layout={{ "icon-image": "harbor-15" }}>
</Layer>
```

### Properties
- **id** : `String` The id of the layer or generate an incremented number as id
- **type** *(Default: `symbol`)* : `String` The type of the features childrens elements, possible values :
  - `symbol`, Include a Mapbox `symbol` (`Point` GeoJson)
  - `line`, Include a Mapbox `line` (`LineString` GeoJson)
  - `fill`, Include a Mapbox `polygon` (`Fill` GeoJson)
  - `circle`, Include a Mapbox `circle` (`Point` GeoJson)
  - `raster`, Include a Mapbox raster layer
  - `fill-extrusion`, Include a Mapbox fill extrusion layer
  - `background`, Include a Mapbox background layer
  - `heatmap`, Include a Mapbox heatmap layer
- **layout**: `Object` Mapbox layout object passed down to mapbox `map.addLayer` method [mapbox layout api](https://www.mapbox.com/mapbox-gl-style-spec/#layer-layout)
- **paint**: `Object` Mapbox paint object passed down to mapbox `map.addLayer` method [mapbox paint api](https://www.mapbox.com/mapbox-gl-style-spec/#layer-paint)
- **geoJSONSourceOptions**: `Object` Source options merged to object passed to `map.addSource`
- **metadata**: `Object` metadata parameter passed to `map.addLayer`
- **sourceLayer**: `String` source-layer parameter passed to `map.addLayer`
- **minZoom**: `Number` minzoom parameter passed to `map.addLayer`
- **maxZoom**: `Number` maxzoom parameter passed to `map.addLayer`
- **filter**: `Array` filter parameter passed to `map.addLayer`
- **sourceId**: `String` When passed to the layer, the source will not be created but only the layer and it will use the given source id.
- **before**: `String` Pass the id of a layer, it will display the current layer before the layer defined by the id. [mapbox api](https://www.mapbox.com/mapbox-gl-js/api/#Map#addLayer)
- **images**: `[imageKey: string, image: HTMLImageElement, options: Object]` Also accept array of the previous image tuple. Add images for use in layout with prop `icon-image`. The value should be the `imageKey` string of the tuple. Alternatively use mapbox studio to upload the image, it will be fetched with the map style object. (see [map.addImage](https://www.mapbox.com/mapbox-gl-js/api/#map#addimage) options for the tuple options).

----------
# Source
Add a source to the map (for layers to use, for example).

### How to use
```jsx
import { Source } from "react-mapbox-gl";

...

const RASTER_SOURCE_OPTIONS = {
  "type": "raster",
  "tiles": [
    "https://someurl.com/512/{z}/{x}/{y}",
  ],
  "tileSize": 512
};

<Source id="source_id" tileJsonSource={RASTER_SOURCE_OPTIONS} />
<Layer type="raster" id="layer_id" sourceId="source_id" />
```

### Properties
- **id** *(required)*: `String`
- **geoJsonSource** : `Object` GeoJson source, see [mapbox-gl GeoJson](https://www.mapbox.com/mapbox-gl-js/style-spec/#sources-geojson) for options
- **tileJsonSource** : `Object` TileJson source, see [mapbox-gl TileJson](https://www.mapbox.com/mapbox-gl-js/style-spec/#sources) for options
- **onSourceAdded** : `Function` Executed once the source is added to the map, the source is passed as a first argument.
- **onSourceLoaded** : `Function` Executed once the source data has been loaded for the first time (after [mapbox-gl map.event:load](https://www.mapbox.com/mapbox-gl-js/api/#map.event:load)), the source is passed as a first argument.

----------
# GeoJSONLayer
Display on the map all the informations contained in a geojson file.

_Note:_ GeoJSONLayer will not render any layers (`line`, `circle`, `fill`, etc...)
unless an associated `[layer]Layout` or `[layer]Paint` prop is provided.

### How to use
```jsx
import { GeoJSONLayer } from "react-mapbox-gl";

...

<GeoJSONLayer
  data={geojson}
  symbolLayout={{
    "text-field": "{place}",
    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
    "text-offset": [0, 0.6],
    "text-anchor": "top"
  }}/>
```

### Properties
- **data** *(required)* : `String | Object` The url to the geojson file or the geojson file itself.
- **lineLayout** | **symbolLayout** | **circleLayout** | **fillLayout** | **fillExtrusionLayout** : `Object` Layer layout informations. [mapbox layout api](https://www.mapbox.com/mapbox-gl-style-spec/#layer-layout)
- **linePaint** | **symbolPaint** | **circlePaint** | **fillPaint** | **fillExtrusionPaint** : `Object` Paint informations. [mapbox paint api](https://www.mapbox.com/mapbox-gl-style-spec/#layer-paint)
- **lineOnMouseDown** | **symbolOnMouseDown** | **circleOnMouseDown** | **fillOnMouseDown** | **fillExtrusionOnMouseDown** : `Function` Mouse down handler. [mapbox map mouse event](https://www.mapbox.com/mapbox-gl-js/api/#mapmouseevent)
- **lineOnMouseUp** | **symbolOnMouseUp** | **circleOnMouseUp** | **fillOnMouseUp** | **fillExtrusionOnMouseUp** : `Function` Mouse up handler. [mapbox map mouse event](https://www.mapbox.com/mapbox-gl-js/api/#mapmouseevent)
- **lineOnMouseMove** | **symbolOnMouseMove** | **circleOnMouseMove** | **fillOnMouseMove** | **fillExtrusionOnMouseMove** : `Function` Mouse move handler. [mapbox map mouse event](https://www.mapbox.com/mapbox-gl-js/api/#mapmouseevent)
- **lineOnMouseEnter** | **symbolOnMouseEnter** | **circleOnMouseEnter** | **fillOnMouseEnter** | **fillExtrusionOnMouseEnter** : `Function` Mouse enter handler. [mapbox map mouse event](https://www.mapbox.com/mapbox-gl-js/api/#mapmouseevent)
- **lineOnMouseLeave** | **symbolOnMouseLeave** | **circleOnMouseLeave** | **fillOnMouseLeave** | **fillExtrusionOnMouseLeave** : `Function` Mouse leave handler. [mapbox map api](https://www.mapbox.com/mapbox-gl-js/api/#mapmouseevent)
- **lineOnClick** | **symbolOnClick** | **circleOnClick** | **fillOnClick** | **fillExtrusionOnClick** : `Function` Mouse click handler. [mapbox map mouse event](https://www.mapbox.com/mapbox-gl-js/api/#mapmouseevent)
- **sourceOptions**: `Object` Options object merged to the object used when calling `GeoJSONSource` method
- **layerOptions**: `Object` Passed down to the layer object when setting it out.
- **before**:`String` Pass the id of a layer, it will display the current layer before the layer defined by the id. [mapbox api](https://www.mapbox.com/mapbox-gl-js/api/#Map#addLayer)

----------
# Feature
Display a feature on the map, can only be used when wrapped in a `Layer` component. The type of the feature is defined at the `Layer` level. If you want to create a new type, create an associated new layer.

### How to use
```jsx
import { Feature } from "react-mapbox-gl";

...

<Feature coordinates={[-0.13235092163085938,51.518250335096376]}/>
```

### Properties
- **coordinates** *(required)* : `Array<Number>` Display the feature at the given position.
- **properties** : `Object` Properties object passed down to the feature at the creation of the source.
- **onClick** : `(mapWithEvt: Object) => void` Triggered when user click on the feature
  - Args contain the feature object, the map object and the arguments passed by mapbox from the event `click`
- **onMouseEnter** : `(mapWithEvt: Object) => void` Triggered when the mouse enter the feature element
  - Args contain the feature object, the map object and the arguments passed by mapbox from the event `onmousemove`
- **onMouseLeave** : `(mapWithEvt: Object) => void` Triggered when the mouse leave the feature element
  - Args contain the map object and the arguments passed by Mapbox from the event `onmousemove`
- **draggable** *(Default: `false`)*: `boolean` Define wether the feature is draggable or not.
- **onDragEnd** : `(mapWithEvt: Object) => void` Triggered when the user stop dragging the feature.

----------
# ZoomControl
A custom react zoom control component.

### How to use
```jsx
import { ZoomControl } from "react-mapbox-gl";

...

<ZoomControl/>
```


### Properties
- **onControlClick** : `(map: Object, zoomDiff: Number) => void` triggered when user click on minus or plus button
- **style** : `Object` Style object merged with internal style into the container
- **className**: `String` Custom style using className for the container
- **zoomDiff** : `Number` The shift number passed to the callback `onControlClick`
- **position** *(Default: `topRight`)*: `String` The control position, Possible values :
  - `topRight`
  - `topLeft`
  - `bottomRight`
  - `bottomLeft`

----------
# ScaleControl
A custom react scale feedback control component.

### How to use
```jsx
import { ScaleControl } from "react-mapbox-gl";

...

<ScaleControl/>
```

### Properties
- **measurement** *(Default: `km`)*: `String`, Possible values :
  - `km`
  - `mi`
- **style** : `Object` Style object merged with internal style into the container
- **position** *(Default: `bottomRight`)*: `String` The control position, Possible values :
  - `topRight`
  - `topLeft`
  - `bottomRight`
  - `bottomLeft`

----------
# RotationControl
Display the current map rotation, also reset the rotation to it's origin value on click.

### How to use

```jsx
import { RotationControl } from "react-mapbox-gl";

...

<RotationControl/>
```

### Properties
- **style** : `Object` Style object merged with internal style into the container
- **className** : `string` Get passed to the container div
- **position** *(Default: `bottomRight`)*: `String` The control position, Possible values :
  - `topRight`
  - `topLeft`
  - `bottomRight`
  - `bottomLeft`

----------
# Popup
The popup component allow you to display a popup tooltip on top of the map using mapbox-gl-js.

### How to use
```jsx
import { Popup } from "react-mapbox-gl";

...

<Popup
  coordinates={[-0.13235092163085938,51.518250335096376]}
  offset={{
    'bottom-left': [12, -38],  'bottom': [0, -38], 'bottom-right': [-12, -38]
  }}>
  <h1>Popup</h1>
</Popup>
```

### Properties
- **coordinates** *(required)*: `Array<Number>` Display the popup at the given position.
- **anchor**: `String` Set the anchor point of the popup, Possible values :
  - `top`
  - `bottom`
  - `left`
  - `right`
  - `top-left`
  - `top-right`
  - `bottom-left`
  - `bottom-right`
  - `null | undefined`: When not set, the anchor is automatically calculated to keep the content of the popup visible.
- **offset** *(Default: 0)*: `Number | Array<Number> | Object` Set the offset of popup, where the tip of the popup will be pointing.
  - When `Number` is passed, the popup will be offset by that number for all anchor positions.
  - When an `Array<Number>` is passed (e.g. [-12, 30]), the popup will be offset by that point.
  - When `Object` is passed, it must contain keys for different anchor positions and values as the offset (`Number` or `Array<Number>`)
- **onClick**: `Function` Triggered whenever user click on the popup
- **style**: `Object` Apply style to the marker container
- **className**: `String` Apply the className to the container of the popup

----------
# Marker
Add an html marker to the map.

### How to use
```jsx
import { Marker } from "react-mapbox-gl";

...

<Marker
  coordinates={[-0.2416815, 51.5285582]}
  anchor="bottom">
  <img src={markerUrl}/>
</Marker>
```

### Properties
- **coordinates** *(required)*: `Array<Number>` Display the marker at the given position.
- **anchor**: `String` Same as Popup's anchor property.
- **offset**: `String` Same as Popup's offset property.
- **onClick**: `Function` Triggered whenever user click on the marker
- **style**: `Object` Apply style to the marker container
- **className**: `String` Apply the className to the container of the Marker

________
# Cluster
Create a cluster of `Marker`.

### How to use
```jsx
import { Cluster } from "react-mapbox-gl";

...

clusterMarker = (coordinates) => (
  <Marker coordinates={coordinates} style={styles.clusterMarker}>
    C
  </Marker>
);

...

<Cluster ClusterMarkerFactory={this.clusterMarker}>
  {
    places.features.map((feature, key) =>
      <Marker
        key={key}
        style={styles.marker}
        coordinates={feature.geometry.coordinates}
        onClick={this.onMarkerClick.bind(this, feature.geometry.coordinates)}>
        M
      </Marker>
    )
  }
</Cluster>
```

### Properties
- **ClusterMarkerFactory** *(required)*: `(coordinates: number[], pointCount: number, getLeaves: (limit?: number, offset?: number) => Array<React.ReactElement<any>>) => Marker` A function called for every cluster, the function must return a Marker component
  - `getLeaves()` return `Cluster` children of a cluster, with pagination support: limit is the number of points to return (set to Infinity for all points, default to 10), and offset is the amount of points to skip (for pagination).

- **radius**: *Default: 60*:`Number` Cluster radius, in pixels.
- **minZoom**: *Default: 0*:`Number` Minimum zoom level at which clusters are generated.
- **maxZoom**: *Default: 16*:`Number` Maximum zoom level at which clusters are generated.
- **extent**: *Default: 512*:`Number` (Tiles) Tile extent. Radius is calculated relative to this value.
- **nodeSize**: *Default: 64*:`Number` Size of the KD-tree leaf node. Affects performance.
- **log**: *Default: false*:`Boolean` Whether timing info should be logged.
- **zoomOnClick**: *Default: false*:`Boolean` Zoom to bounds of cluster on click.
- **zoomOnClickPadding**: *Default: 20*:`Number` The amount of padding in pixels to add to the cluster bounds for the zoom.
