import React, { useState, useEffect, useRef} from "react";
import Swal from "sweetalert2";
import locationIcon from "../components/location-icon-png-4250.png";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "../components/axios";
import "../App.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

function MapComponent(props) {
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    if (mapRef.current && props.position) {
      mapRef.current.flyTo(props.position, 15);
    }
  }, [props.position]);

  const toggleDraggable = () => {
    props.setDraggable((d) => !d);
  };
//drag function 
  const eventHandlers = {
    dragend(event) {
      const latLng = event.target.getLatLng(); // Use event.target to access the marker
      props.setMovingPosition(latLng);

      props.setPositionToEdit((prevState) => ({
        ...prevState,
        LAT: latLng.lat,
        LNG: latLng.lng,
      }));
    },
  };

  // delete function
  const handleDelete = async (id) => {
    
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      // Add 'async' here
      if (result.isConfirmed) {
        try {
          await axios.delete(`locations/${id}`);
          props.Fetch();

          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        } catch {
          Swal.fire("Oops!", "Cannot delete your location.", "warning");
        }
      }
    });
  };

  const customIcon = new Icon({
    iconUrl: locationIcon,
    iconSize: [38, 38],
  });

  return (
    <>
      {!props.loading ? (
        <MapContainer
          center={props.position}
          zoom={15}
          scrollWheelZoom={true}
          style={{ height: "400px", width: "100%" }}
          ref={mapRef}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[31.9516, 35.93935]} icon={customIcon}>
            <Popup>
              <h4>Roman Theatre</h4> <br /> AMMAN
            </Popup>
          </Marker>
          {userLocation && props.model && (
            <Marker icon={customIcon} position={userLocation}>
              <Popup>User Location</Popup>
            </Marker>
          )}

          {props.markers.map((marker, index) => {
          

            return (
              <Marker
                key={marker.ID}
                icon={customIcon}
                draggable={props.draggable}
                eventHandlers={eventHandlers}
                position={
                  props.movingposition
                    ? props.movingposition
                    : [marker.LAT, marker.LNG]
                }>
                <Popup>
                  {props.draggable ? (
                    <p>drage your location to a new location</p>
                  ) : (
                    <>
                      <h4>{marker.Name}</h4>
                      <p>{marker.Notes}</p>
                      <button
                        className="btn btn_theme btn_md mx-1 px-2 py-1"
                        onClick={() => handleDelete(marker.ID)}>
                        delete
                      </button>
                      <button
                        className="btn btn_theme btn_md mx-1 px-2 py-1"
                        onClick={() => {
                          props.handleEdit(marker);
                          toggleDraggable();
                        }}>
                        edit
                      </button>
                    </>
                  )}
                </Popup>
              </Marker>
            );
          })}

          {props.model ? (
            <LocationButton
              setUserLocation={setUserLocation}
              userLocation={userLocation}
              {...props}
            />
          ) : null}
        </MapContainer>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
function LocationButton(props) {
  const map = useMap();

  useEffect(() => {
    map.on("click", (e) => {
      props.setPositionToAdd({
        ...props.positionToAdd,
        LAT: e.latlng.lat,
        LNG: e.latlng.lng,
      });
      const { lat, lng } = e.latlng;

      props.setUserLocation([lat, lng]);
     
    });
  }, [props.positionToAdd]);

  return null;
}

export default MapComponent;
