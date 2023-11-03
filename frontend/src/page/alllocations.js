import React, { useEffect, useState } from "react";
import axios from "../components/axios";
import Add from "./add";
import Update from "./update";
import MapComponent from "./MapComponent";
import locationIcon from "../components/location-icon-png-4250.png";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

const Products = () => {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [position, setposition] = useState([31.9516, 35.93935]);
  const [draggable, setDraggable] = useState(false);
  const [movingposition, setMovingPosition] = useState(null);
  const [positionToAdd, setPositionToAdd] = useState({
    Name: "",
    Notes: "",
    LAT: "",
    LNG: "",
  });
  const [positionToEdit, setPositionToEdit] = useState({
    Name: "",
    Notes: "",
    LAT: "",
    LNG: "",
  });

  const Fetch = async () => {
    try {
      const response = await axios.get("/locations");
      setMarkers(response.data);
      setLoading(false);
      
    } catch (error) {
      console.error(error);
    }
  };


  const [model, setModel] = useState(false);
  const [edit, setEdit] = useState(false);
  const handleAdd = () => {
    setModel(!model);
  };

  const handleEdit = (marker) => {
    
    setPositionToEdit(marker);
    
    setEdit(!edit);
  };

  const customIcon = new Icon({
    iconUrl: locationIcon,
    iconSize: [38, 38],
  });

  useEffect(() => {
    Fetch();
  }, []);





  return (
    <>
      <MapComponent
        markers={markers}
        Fetch={Fetch}
        loading={loading}
        position={position}
        positionToAdd={positionToAdd}
        setPositionToAdd={setPositionToAdd}
        positionToEdit={positionToEdit}
        setPositionToEdit={setPositionToEdit}
        model={model}
        edit={edit}
        setEdit={setEdit}
        handleEdit={handleEdit}
        movingposition={movingposition}
        setMovingPosition={setMovingPosition}
        draggable={draggable}
        setDraggable={setDraggable}
      />

      <button onClick={handleAdd} className="btn btn_theme btn_md my-4">
        Add location
      </button>

      {model ? (
        <Add
          Fetch={Fetch}
          handleAdd={handleAdd}
          positionToAdd={positionToAdd}
          setPositionToAdd={setPositionToAdd}
        />
      ) : null}
      {edit ? (
        <Update
          Fetch={Fetch}
          handleEdit={handleEdit}
          edit={edit}
          setEdit={setEdit}
          positionToEdit={positionToEdit}
          setPositionToEdit={setPositionToEdit}
          movingposition={movingposition}
        setMovingPosition={setMovingPosition}
        draggable={draggable}
        setDraggable={setDraggable}
        />
      ) : null}

      {!loading ? (
        <section id="explore_area" className="section_padding">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                <div className="section_heading_center">
                  <h2>{markers.length} LATocations found</h2>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <div className="row">
                  {markers.map((marker) => (
                    <div
                      className='col-lg-3 col-md-6 col-sm-6 col-12 '
                       
                      key={marker.ID}>
                      <div
                        className="theme_common_box_two img_hover"
                        onClick={() => {
                          window.scrollTo(0, 0);
                          setposition([marker.LAT, marker.LNG]);
                        }}>
                        <div className="theme_two_box_img">
                          <MapContainer
                            center={[marker.LAT, marker.LNG]}
                            zoom={10}
                            scrollWheelZoom={false}
                            style={{ height: "200px", width: "100%" }}>
                            <TileLayer
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker
                              position={[marker.LAT, marker.LNG]}
                              icon={customIcon}></Marker>
                          </MapContainer>
                          <p>
                            <i className="fas fa-map-marker-alt"></i>
                            {marker.Name}
                          </p>
                        </div>
                        <div className="theme_two_box_content">
                          <h4>{marker.Name}</h4>
                          <p>{marker.Notes}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
};

export default Products;
