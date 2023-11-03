import React from "react";
import axios from "../components/axios";
import Swal from "sweetalert2";
export default function search(props) {
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    props.setPositionToEdit({
      ...props.positionToEdit,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Fix the typo here
    try {
      await axios.put(
        `locations/${props.positionToEdit.ID}`,
        props.positionToEdit
      );
      props.Fetch();
      Swal.fire("Updated!", "Your location has been updated.", "success");
      props.setEdit(!props.edit);
      props.setMovingPosition(null)
      props.setDraggable()
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Oops!", "Cannot update your location.", "error");
    }
  };

  return (
    <>
      <section id="theme_search_form_tour">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="theme_search_form_area">
                <div className="tab-content" id="myTabContent">
                  <div
                    className="tab-pane fade show active"
                    id="tours"
                    role="tabpanel"
                    aria-labelledby="tours-tab">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="tour_search_form">
                          <form method="post" onSubmit={handleSubmit}>
                            <div className="row">
                              <div className="col-lg-3 col-md-12 col-sm-12 col-12">
                                <div className="flight_Search_boxed">
                                  <p>Name</p>
                                  <input
                                    value={props.positionToEdit.Name}
                                    name="Name"
                                    type="text"
                                    placeholder="Add the location name ..."
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-lg-5 col-md-6 col-sm-12 col-12">
                                <div className="form_search_date">
                                  <div className="flight_Search_boxed">
                                    <p>Notes</p>
                                    <input
                                      value={props.positionToEdit.Notes}
                                      required
                                      name="Notes"
                                      type="text"
                                      placeholder="Add the location note ..."
                                      onChange={handleInputChange}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-2  col-md-6 col-sm-12 col-12">
                                <div className="flight_Search_boxed dropdown_passenger_area">
                                  <p>LAT</p>

                                  <input
                                    required
                                    name="LAT"
                                    type="text"
                                    onChange={handleInputChange}
                                    value={props.positionToEdit.LAT}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-2  col-md-6 col-sm-12 col-12">
                                <div className="flight_Search_boxed dropdown_passenger_area">
                                  <p>LNG</p>

                                  <input
                                    required
                                    name="LNG"
                                    type="text"
                                    value={props.positionToEdit.LNG}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="top_form_search_button">
                                <button
                                  type="submit"
                                  className="btn btn_theme btn_md">
                                  Update
                                </button>
                                <button
                                  type="button"
                                  className="btn btn_warning btn_md"
                                  onClick={() => {
                                    props.handleEdit()
                                    props.setDraggable()
                                    props.setMovingPosition(null)
                                  }}>
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
