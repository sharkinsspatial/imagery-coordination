'use strict';
import React, { PropTypes as T } from 'react';
import mapboxgl from 'mapbox-gl';
import extent from '@turf/bbox';
import _ from 'lodash';

const DisplayMap = React.createClass({
  displayName: 'DisplayMap',

  propTypes: {
    mapId: T.string,
    results: T.object,
    className: T.string
  },

  componentDidMount: function () {
    this.map = new mapboxgl.Map({
      container: this.props.mapId,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [0, 20],
      zoom: 1
    });

    this.map.on('load', () => {
      this.setupFeature();
    });
  },

  setupFeature: function () {
    if (this.map.loaded() && this.props.results) {
      let feat = this.props.results;
      this.addFeature(feat);
      this.zoomToFeature(feat);
    }
  },

  componentWillReceiveProps: function (nextProps) {
    let nextFeat = nextProps.results;
    if (nextFeat && !_.isEqual(this.props.results, nextFeat)) {
      this.setupFeature();
    }
  },

  addFeature: function (feat) {
    this.map.addSource('task', {
      type: 'geojson',
      data: feat
    });
    this.map.addLayer({
      'id': 'task',
      'type': 'fill',
      'source': 'task',
      'paint': {
        'fill-color': '#088',
        'fill-opacity': 0.8
      }
    });
  },

  zoomToFeature: function (feat) {
    this.map.fitBounds(extent(feat), {
      padding: 15,
      // ease-in-out quint
      easing: (t) => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
    });
  },

  render: function () {
    return <div className={this.props.className} id={this.props.mapId}></div>;
  }
});

module.exports = DisplayMap;