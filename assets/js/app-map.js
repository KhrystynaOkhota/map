jQuery(function ($) {
  let activeLink = window.location.pathname;
  var maps = [],
      ibSize = 220,
      mapStyles = [
        {
          featureType: "all",
          elementType: "labels.text.fill",
          stylers: [
            {
              saturation: 36,
            },
            {
              color: "#000000",
            },
            {
              lightness: 40,
            },
          ],
        },
        {
          featureType: "all",
          elementType: "labels.text.stroke",
          stylers: [
            {
              visibility: "on",
            },
            {
              color: "#000000",
            },
            {
              lightness: 16,
            },
          ],
        },
        {
          featureType: "all",
          elementType: "labels.icon",
          stylers: [
            {
              visibility: "off",
            },
          ],
        },
        {
          featureType: "administrative",
          elementType: "geometry.fill",
          stylers: [
            {
              color: "#000000",
            },
            {
              lightness: 20,
            },
          ],
        },
        {
          featureType: "administrative",
          elementType: "geometry.stroke",
          stylers: [
            {
              color: "#000000",
            },
            {
              lightness: 17,
            },
            {
              weight: 1.2,
            },
          ],
        },
        {
          featureType: "administrative",
          elementType: "labels",
          stylers: [
            {
              visibility: "off",
            },
          ],
        },
        {
          featureType: "administrative.country",
          elementType: "all",
          stylers: [
            {
              visibility: "simplified",
            },
          ],
        },
        {
          featureType: "administrative.country",
          elementType: "geometry",
          stylers: [
            {
              visibility: "simplified",
            },
          ],
        },
        {
          featureType: "administrative.country",
          elementType: "labels.text",
          stylers: [
            {
              visibility: "simplified",
            },
          ],
        },
        {
          featureType: "administrative.province",
          elementType: "all",
          stylers: [
            {
              visibility: "off",
            },
          ],
        },
        {
          featureType: "administrative.locality",
          elementType: "all",
          stylers: [
            {
              visibility: "simplified",
            },
            {
              saturation: "-100",
            },
            {
              lightness: "30",
            },
          ],
        },
        {
          featureType: "administrative.neighborhood",
          elementType: "all",
          stylers: [
            {
              visibility: "off",
            },
          ],
        },
        {
          featureType: "administrative.land_parcel",
          elementType: "all",
          stylers: [
            {
              visibility: "off",
            },
          ],
        },
        {
          featureType: "landscape",
          elementType: "all",
          stylers: [
            {
              visibility: "simplified",
            },
            {
              gamma: "0.00",
            },
            {
              lightness: "74",
            },
          ],
        },
        {
          featureType: "landscape",
          elementType: "geometry",
          stylers: [
            {
              color: "#000000",
            },
            {
              lightness: 20,
            },
          ],
        },
        {
          featureType: "landscape.man_made",
          elementType: "all",
          stylers: [
            {
              lightness: "3",
            },
          ],
        },
        {
          featureType: "poi",
          elementType: "all",
          stylers: [
            {
              visibility: "off",
            },
          ],
        },
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [
            {
              color: "#000000",
            },
            {
              lightness: 21,
            },
          ],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [
            {
              visibility: "simplified",
            },
          ],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.fill",
          stylers: [
            {
              color: "#000000",
            },
            {
              lightness: 17,
            },
          ],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [
            {
              color: "#000000",
            },
            {
              lightness: 29,
            },
            {
              weight: 0.2,
            },
          ],
        },
        {
          featureType: "road.arterial",
          elementType: "geometry",
          stylers: [
            {
              color: "#000000",
            },
            {
              lightness: 18,
            },
          ],
        },
        {
          featureType: "road.local",
          elementType: "geometry",
          stylers: [
            {
              color: "#000000",
            },
            {
              lightness: 16,
            },
          ],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [
            {
              color: "#000000",
            },
            {
              lightness: 19,
            },
          ],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [
            {
              color: "#000000",
            },
            {
              lightness: 17,
            },
          ],
        },
      ],
      ibOptions = {
        alignBottom: true,
        content: "text",
        closeBoxURL: "http://moonart.net.ua/olehm/tobbi/img/icons/close.svg",
        pixelOffset:
            window.innerWidth > 767
                ? new google.maps.Size(-245, -40)
                : new google.maps.Size(-110, -45),
        boxStyle: {
          width: ibSize + "px",
        },
      },
      ib = new InfoBox(ibOptions),
      mapDefaulZoom;

  function Map(id, mapOptions) {
    this.map = new google.maps.Map(document.getElementById(id), mapOptions);
    this.markers = [];
    this.infowindows = [];
    this.clusters = null;
  }

  function addMarker(mapId, location, index, infobox, image, activeImage) {
    let markerInst = new google.maps.Marker({
      position: location,
      map: maps[mapId].map,
      icon: {
        url: image,
        scaledSize: new google.maps.Size(40, 40),
      },
      mainImage: image,
      activeIcon: activeImage,
      active: false,
    });

    if (infobox) {
      let phones = "";

      if (infobox.phones.length) {
        phones += "<div>";
        infobox.phones.forEach((phone) => {
          phones += `<a class="infobox-contact btn-link btn-link_inline" href="${phone.link}" >${phone.number}</a>`;
        });
        phones += "</div>";
      }

      let content = `<div class="info-box-wrapper">
        <img src="`+window.location.origin+`/wp-content/themes/kebabtsia/img/logo-text.svg" alt="" loading="lazy">
        ${infobox.address ? `<div>${infobox.address}</div> ` : ""}
        ${
          infobox.workingHours.length
              ? `<div>${infobox.workingHours.join("<br>")}</div>`
              : ""
          }
        ${phones} 
      
      </div>`;
      google.maps.event.addListener(markerInst, "click", function () {
        ib.setContent(content);
        ib.setPosition(location);

        ib.open(maps[mapId].map);
        if (window.innerWidth < 768) maps[mapId].map.panTo(this.getPosition());
        setTimeout(() => {
          if (window.innerWidth < 768) {
            maps[mapId].map.panBy(0, -100);
          } else {
            maps[mapId].map.panBy(0, 0);
          }
        }, 5);

        // this.setIcon(this.activeIcon);
        this.active = false;
        setTimeout(() => {
          _functions.initSwiper($(".search-map .swiper-container"));
        }, 200);
      });
    }
    return markerInst;
  }
  function constructPoligons(locationsData) {
    const redZones = locationsData.redZones;
    const yellowZones = locationsData.yellowZones;
    const greenZones = locationsData.greenZones;
    const polygons = {};

    if (redZones) {
      polygons.redZonesPolygons = [];
      redZones.zoneLocations.forEach(function (location) {
        const polygon = new google.maps.Polygon({
          paths: location.path,
          strokeColor: redZones.strokeColor,
          strokeOpacity: redZones.strokeOpacity,
          strokeWeight: redZones.strokeWeight,
          fillColor: redZones.fillColor,
          fillOpacity: redZones.fillOpacity,
        });
        polygons.redZonesPolygons.push(polygon);
      });
    }

    if (yellowZones) {
      polygons.yellowZonesPolygons = [];
      yellowZones.zoneLocations.forEach(function (location) {
        const polygon = new google.maps.Polygon({
          paths: location.path,
          strokeColor: yellowZones.strokeColor,
          strokeOpacity: yellowZones.strokeOpacity,
          strokeWeight: yellowZones.strokeWeight,
          fillColor: yellowZones.fillColor,
          fillOpacity: yellowZones.fillOpacity,
        });
        polygons.yellowZonesPolygons.push(polygon);
      });
    }

    if (greenZones) {
      polygons.greenZonesPolygons = [];
      greenZones.zoneLocations.forEach(function (location) {
        const polygon = new google.maps.Polygon({
          paths: location.path,
          strokeColor: greenZones.strokeColor,
          strokeOpacity: greenZones.strokeOpacity,
          strokeWeight: greenZones.strokeWeight,
          fillColor: greenZones.fillColor,
          fillOpacity: greenZones.fillOpacity,
        });
        polygons.greenZonesPolygons.push(polygon);
      });
    }

    //console.log('polygons: ', polygons);
    return polygons;
  }

  function GMap($mapInst) {
    let markersArr = [];
    var lat = $mapInst.attr("data-lat"),
        lng = $mapInst.attr("data-lng"),
        setZoom =
            window.innerWidth < 767
                ? parseInt($mapInst.attr("data-xs-zoom"))
                : parseInt($mapInst.attr("data-zoom")),
        mapId = $mapInst.attr("id"),
        clusterImg =
            $mapInst.attr("data-cluster-img") || $mapInst.data("map-marker"),
        zoomControl = typeof $mapInst.data("disable-zoom") == "undefined",
        markerImage = $mapInst.data("map-marker");

    if (window.innerWidth < 767) {
      if (!$mapInst.attr("data-xs-zoom") == "") {
        mapDefaulZoom = setZoom;
      } else {
        mapDefaulZoom = 10;
      }
    } else {
      if (!$mapInst.attr("data-zoom") == "") {
        mapDefaulZoom = setZoom;
      } else {
        mapDefaulZoom = 12;
      }
    }

    var mapOptions = {
      zoom: mapDefaulZoom,
      disableDefaultUI: true,
      scrollwheel: false,
      zoomControl: zoomControl,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL,
        position: google.maps.ControlPosition.RIGHT_BOTTOM,
      },
      streetViewControl: false,
      fullscreenControl: false,
      styles: mapStyles,
      minZoom: 2,
    };

    function renderMarkers(data) {
      for (let i = 0; i < data.length; i++) {
        var markerInst = addMarker(
            data[i].dataRel,
            new google.maps.LatLng(data[i].dataLat, data[i].dataLng),
            i,
            data[i].infobox,
            data[i].dataImg,
            data[i].dataImgActive
        );
        markersArr.push(markerInst);
      }

      // const renderer = {
      //   render: ({ count, position }) =>
      //     new google.maps.Marker({
      //       icon: clusterImg,
      //       label: {
      //         text: String(count),
      //         color: "0x090919",
      //         fontSize: "16px",
      //       },
      //       position,
      //       // adjust zIndex to be above other markers
      //       zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
      //     }),
      // };
      // maps[mapId].markerClusterer = new markerClusterer.MarkerClusterer({
      //   map: maps[mapId].map,
      //   markers: markersArr,
      //   renderer,
      // });

      markersArr.forEach(function (marker, index) {
        maps[mapId].bounds.extend(marker.getPosition());
      });

      if (markersArr.length == 1) {
        maps[mapId].map.setCenter({
          lat: parseFloat(markersArr[0].position.lat()),
          lng: parseFloat(markersArr[0].position.lng()),
        });
        maps[mapId].map.setZoom(mapDefaulZoom);
      } else {
        maps[mapId].map.fitBounds(maps[mapId].bounds, {
          top: 10,
          left: 80,
          right: 80,
          bottom: 10,
        });
      }
    }

    maps[mapId] = new Map(mapId, mapOptions);
    maps[mapId].bounds = new google.maps.LatLngBounds();
    if (!lat == "" && !lng == "") {
      maps[mapId].map.setCenter({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      });
    }
    // .length
    if ($mapInst.data("link")) {
      let mapDataLink = $mapInst.data("link");
      $.ajax({
        url: mapDataLink,
        type: "get",
        dataType: "json",
        error: (data) => console.log(data),
        success: (data) => {
          renderMarkers(data);
        },
      });
    }
    if ($mapInst.nextAll(".map-marker").length) {
      let markersData = [];
      $mapInst.nextAll(".map-marker").each(function () {
        markersData.push($(this).data("marker-params"));
      });
      renderMarkers(markersData);
    }
    if ($mapInst.attr("data-polygons-url")) {
      $.ajax({
        url: $mapInst.attr("data-polygons-url"),
        type: "get",
        dataType: "json",
        error: (data) => console.log(data),
        success: (data) => {
          console.log(data);
          const polygons = constructPoligons(data);
          for (let key in polygons) {
            polygons[key].forEach(function (polygon) {
              polygon.setMap(maps[mapId].map);
            });
          }
        },
      });
    }

    ib.addListener("closeclick", function () {
      markersArr.forEach(function (marker) {
        marker.active = false;
        // marker.setIcon(marker.mainImage);
      });
    });

    //click on map
    maps[mapId].map.addListener("click", function () {
      ib.close();
      markersArr.forEach(function (marker) {
        marker.active = false;
        // marker.setIcon(marker.mainImage);
      });
    });

    this.update = function (data) {
      // clear old markers
      ib.close();
      markersArr.forEach((marker) => marker.setMap(null));
      maps[mapId].markerClusterer.clearMarkers();
      markersArr = [];
      // add new
      renderMarkers(data);
    };

    function filterMarkers(filterVal) {
      const visibleMarkers = [];
      maps[mapId].bounds = new google.maps.LatLngBounds();
      markersArr.map((marker) => {
        const isVisible = filterVal == marker.filter;
        marker.setVisible(isVisible);
        if (isVisible) {
          visibleMarkers.push(marker);
          maps[mapId].bounds.extend(marker.getPosition());
        }
      });
      if (visibleMarkers.length) {
        maps[mapId].map.fitBounds(maps[mapId].bounds, {
          top: 80,
          left: 80,
          right: 80,
          bottom: 80,
        });
      }
    }

    if ($mapInst.closest("section").find(`[data-map-filter]`).length) {
      $mapInst
          .closest("section")
          .find(`[data-map-filter]`)
          .on("click", function () {
            $(this).addClass("active").siblings().removeClass("active");
            filterMarkers($(this).attr("data-map-filter"));
          });
      if ($mapInst.closest("section").find(`.active[data-map-filter]`).length) {
        setTimeout(() => {
          filterMarkers(
              $mapInst
                  .closest("section")
                  .find(`.active[data-map-filter]`)
                  .attr("data-map-filter")
          );
        }, 100);
      }
    }

    if (markersArr.length && Boolean($mapInst.attr("data-show-infobox"))) {
      setTimeout(() => {
        google.maps.event.trigger(markersArr[0], "click");
      }, 500);
    }
    return this;
  }

  $(".map").each(function () {
    GMap($(this));
  });
});
