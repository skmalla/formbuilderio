import React, { Component } from "react";

import { FormBuilder, FormEdit, FormGrid } from "react-formio";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRemove,
  faShareSquare,
  faSave,
  faPlus,
  faLongArrowAltLeft,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  createdFormBuilderJson,
  createFlowableJson,
} from "./CommonFunctionFormIO.js";
import { Modal } from "react-bootstrap";
import { Button, Label, Input } from "reactstrap";
import "./formIoBuilder.css";

const $ = require("jquery");

class FormBuilderIO extends Component {
  constructor() {
    super();

    this.finalJson = {};
    this.createNewForm = false;
    this.listOfForms = [];
    this.newFormJson = {};
    this.formKey = "";
    this.description = "";
    this.finaFormJson = [];
    this.addClassForm = false;
    this.createdFormBuilderJson = createdFormBuilderJson.bind(this);

    this.createFlowableJson = createFlowableJson.bind(this);
    this.formJson = {};
    this.flowableFormJson = {};

    //this.finaFormJson.push(this.formJson);
    //console.log(JSON.stringify(this.formJson));

    // this.formJson = this.createdFormBuilderJson(JSON.parse("{}"));
    this.forceUpdate();
  }

  componentDidMount() {
    this.formJson = {};
    this.newFormJson["formName"] = "";
    this.newFormJson["formKey"] = "";
    this.newFormJson["description"] = "";
    this.addClassForm = false;
    this.createNewForm = false;
    this.showAllForms();
  }

  showAllForms = async () => {
    try {
      this.formJson = {};
      this.createNewForm = false;
      const requestOptions = {
        method: "GET",
        credentials: "include",
      };
      var response = await /*fetch(
				localStorage.getItem("apiURL") + "flowable-modeler/app/rest/models?filter=forms&modelType=2&sort=modifiedDesc",
				requestOptions
			);*/
      fetch("https://data--three-default-rtdb.firebaseio.com/data.json");

      if (!response.ok) {
      } else if (response.status === 200) {
        var json = await response.json();
        console.log(json);
        this.listOfForms = json.data;
        this.forceUpdate();
      }
    } catch (error) {
      this.listOfForms = [];
      this.forceUpdate();
      alert("Error Occured");
    }
  };

  openForm = async (row) => {
    try {
      const requestOptions = {
        method: "GET",
        credentials: "include",
      };
      var response = await fetch(
        localStorage.getItem("apiURL") +
          "flowable-modeler/app/rest/form-models/" +
          row["id"],
        requestOptions
      );

      if (!response.ok) {
      } else if (response.status === 200) {
        var json = await response.json();
        this.flowableFormJson = json;
        this.createNewForm = true;
        if (
          json["formDefinition"]["formIoString"] !== null &&
          json["formDefinition"]["formIoString"] !== undefined &&
          json["formDefinition"]["formIoString"] != ""
        )
          this.formJson = JSON.parse(json["formDefinition"]["formIoString"]);
        else this.formJson = this.createdFormBuilderJson(json);
        this.forceUpdate();
      }
    } catch (error) {
      alert("Error Occured");
    }
  };

  handleChange = async (e) => {
    this.newFormJson[e.target.getAttribute("id")] = e.target.value;
    this.forceUpdate();
    console.log(e.target.getAttribute("id"));
  };

  updateForm = (e) => {
    // Formio.createForm(document.getElementById('formio'), 'https://examples.form.io/example');
    //console.log(e);
    var groupHeader = $(".form-builder-group-header");

    if (
      (groupHeader != null) & (groupHeader.length > 0) &&
      !this.addClassForm
    ) {
      $(".form-builder-group-header").next().toggleClass("form-builder-close");
      this.addClassForm = true;
      this.forceUpdate();

      $(document).on("click", ".form-builder-group-header", function (e) {
        // $(this).next().removeClass("form-builder-close");

        e.stopImmediatePropagation();
        $(this).next().toggleClass("form-builder-close");
      });
    }
    //console.log(JSON.stringify(e));
    this.finalJson = {};
    this.finalJson = e;
    this.forceUpdate();
  };

  createNewFormFunction = async () => {
    try {
      var formData = {};
      console.log(this.newFormJson);
      formData["name"] = this.newFormJson["formName"];
      formData["key"] = this.newFormJson["formKey"];
      formData["description"] = this.newFormJson["description"];
      formData["modelType"] = 2;

      let requestHeaders = {
        "Content-Type": "application/json",
      };
      var response = await fetch(
        localStorage.getItem("apiURL") + "flowable-modeler/app/rest/models",
        {
          method: "POST",
          headers: requestHeaders,
          dataType: "json",
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );
      if (response.status === 500) {
        // console.log("error");
        alert("Server Down Check with network Administrator");
      } else if (response.status === 200) {
        var json = await response.json();
        this.createNewForm = true;

        this.closeNewFormDialogFunction();

        alert("Saved SuccessFully");
        this.flowableFormJson = json;
        this.forceUpdate();
      } else if (response.status === 409) {
        alert("Duplicate Form");
      }
    } catch (error) {
      alert("error");
    }
  };

  openNewFormDialogFunction = () => {
    this.newFormJson = {};
    this.openNewFormDialog = true;
    this.forceUpdate();
  };
  closeNewFormDialogFunction = () => {
    this.openNewFormDialog = false;
    this.forceUpdate();
  };
  submitForm = async () => {
    try {
      var r = window.confirm(
        "Do you want to Save form " + this.flowableFormJson["name"] + "!"
      );
      if (r == true) {
        // Formio.createForm(document.getElementById('formio'), 'https://examples.form.io/example');
        //console.log(this.finalJson);
        //localStorage.setItem("renderJson",JSON.stringify(this.finalJson));
        var flowableJson = this.createFlowableJson(this.finalJson);
        console.log(this.flowableFormJson);
        var flowableFinalJson = {};
        flowableFinalJson["reusable"] = false;
        flowableFinalJson["newVersion"] = false;
        flowableFinalJson["comment"] = "";
        flowableFinalJson["formImageBase64"] =
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABxCAYAAABvGp7oAAADW0lEQVR4Xu3UwQkAMAwDsWb/ifNqoVscKBMYOXh29x5HgACBgMAYrEBLIhIg8AUMlkcgQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQGAQECBCoCBqvSlJwECByD5QkIEMgIGKxMVYISIGCw/AABAhkBg5WpSlACBAyWHyBAICNgsDJVCUqAgMHyAwQIZAQMVqYqQQkQMFh+gACBjIDBylQlKAECBssPECCQETBYmaoEJUDAYPkBAgQyAgYrU5WgBAgYLD9AgEBGwGBlqhKUAAGD5QcIEMgIGKxMVYISIGCw/AABAhkBg5WpSlACBAyWHyBAICNgsDJVCUqAgMHyAwQIZAQMVqYqQQkQMFh+gACBjIDBylQlKAECBssPECCQETBYmaoEJUDAYPkBAgQyAgYrU5WgBAgYLD9AgEBGwGBlqhKUAAGD5QcIEMgIGKxMVYISIGCw/AABAhkBg5WpSlACBAyWHyBAICNgsDJVCUqAgMHyAwQIZAQMVqYqQQkQMFh+gACBjIDBylQlKAECBssPECCQETBYmaoEJUDAYPkBAgQyAgYrU5WgBAgYLD9AgEBGwGBlqhKUAAGD5QcIEMgIGKxMVYISIGCw/AABAhkBg5WpSlACBAyWHyBAICNgsDJVCUqAgMHyAwQIZAQMVqYqQQkQMFh+gACBjIDBylQlKAECBssPECCQETBYmaoEJUDAYPkBAgQyAgYrU5WgBAgYLD9AgEBGwGBlqhKUAAGD5QcIEMgIGKxMVYISIGCw/AABAhkBg5WpSlACBAyWHyBAICNgsDJVCUqAgMHyAwQIZAQMVqYqQQkQMFh+gACBjIDBylQlKAECBssPECCQETBYmaoEJUDAYPkBAgQyAg/YVYWGCnf2JwAAAABJRU5ErkJggg==";
        var formRepresentation = {};
        formRepresentation["id"] = this.flowableFormJson["id"];
        formRepresentation["name"] = this.flowableFormJson["name"];
        formRepresentation["key"] = this.flowableFormJson["key"];
        formRepresentation["description"] = this.flowableFormJson[
          "description"
        ];
        formRepresentation["version"] = 1;
        formRepresentation["lastUpdatedBy"] = this.flowableFormJson[
          "lastUpdatedBy"
        ];
        formRepresentation["lastUpdated"] = this.flowableFormJson[
          "lastUpdated"
        ];
        flowableFinalJson["formRepresentation"] = formRepresentation;
        var formDefinition = {};
        formDefinition["key"] = this.flowableFormJson["key"];
        formDefinition["name"] = this.flowableFormJson["name"];
        formDefinition["outcomes"] = [];
        formDefinition["fields"] = flowableJson;
        formDefinition["formIoString"] = JSON.stringify(this.finalJson);
        formRepresentation["formDefinition"] = formDefinition;
        console.log(this.finalJson);

        console.log(flowableFinalJson);

        let requestHeaders = {
          "Content-Type": "application/json",
        };
        var response = await fetch(
          localStorage.getItem("apiURL") +
            "flowable-modeler/app/rest/form-models/" +
            this.flowableFormJson["id"],
          {
            method: "PUT",
            headers: requestHeaders,
            dataType: "json",
            credentials: "include",
            body: JSON.stringify(flowableFinalJson),
          }
        );
        if (response.status === 500) {
          // console.log("error");
          alert("Server Down Check with network Administrator");
        } else if (response.status === 200) {
          var json = await response.json();

          alert("Saved SuccessFully");
          this.flowableFormJson = json;
          this.forceUpdate();
        } else if (response.status === 409) {
          alert("Duplicate Form");
        }
      }
    } catch (error) {
      alert("error");
    }
  };

  deleteForm = async () => {
    try {
      var r = window.confirm(
        "Do you really want to Delete form " +
          this.flowableFormJson["name"] +
          "!"
      );
      if (r == true) {
        const requestOptions = {
          method: "DELETE",
          credentials: "include",
        };
        var response = await fetch(
          localStorage.getItem("apiURL") +
            "flowable-modeler/app/rest/models/" +
            this.flowableFormJson["id"] +
            "?cascade=false",
          requestOptions
        );

        if (response.status === 500) {
          // console.log("error");
          alert("Server Down Check with network Administrator");
        } else if (response.status === 200) {
          //var json = await response.json();

          alert("SuccessFully Deleted Form " + this.flowableFormJson["name"]);
          this.flowableFormJson = {};
          this.showAllForms();
          this.forceUpdate();
        }
      }
    } catch (error) {
      alert("error");
    }
  };

  render() {
    return (
      <div>
        <Modal
          show={this.openNewFormDialog}
          onHide={this.closeNewFormDialogFunction}
        >
          <Modal.Body className='custom-ui-body'>
            <div id='addApplicationDiv' className='form-group'>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <Label for='formName'>Form Name</Label>
                    </td>
                    <td>
                      <Input
                        name='formName'
                        type='text'
                        placeholder='Form Name'
                        id='formName'
                        value={this.newFormJson["formName"]}
                        onChange={this.handleChange}
                        className='form-control'
                      ></Input>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Label for='formKey'>Form Key</Label>
                    </td>
                    <td>
                      <Input
                        name='formKey'
                        type='text'
                        placeholder='Form Key'
                        id='formKey'
                        value={this.newFormJson["formKey"]}
                        onChange={this.handleChange}
                        className='form-control'
                      ></Input>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Label for='description'>Description</Label>
                    </td>
                    <td>
                      <textarea
                        name='description'
                        type='text'
                        placeholder='Description'
                        id='description'
                        value={this.newFormJson["description"]}
                        onChange={this.handleChange}
                        className='form-control'
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Modal.Body>
          <Modal.Footer className='custom-ui-footer'>
            <Button className='popupclose' onClick={this.createNewFormFunction}>
              Create Form
            </Button>
            <Button
              className='popupclose'
              onClick={this.closeNewFormDialogFunction}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <div className='icons'>
          {this.createNewForm ? (
            <div>
              <h3>{this.flowableFormJson["name"]}</h3>
              <FontAwesomeIcon
                icon={faSave}
                color='dodgerblue'
                style={{ marginTop: "2%" }}
                onClick={this.submitForm}
                size='2x'
                title='Save to Flowable'
                className='pointerForIcon'
              />

              <FontAwesomeIcon
                icon={faTrashAlt}
                style={{ marginLeft: "4%" }}
                color='dodgerblue'
                onClick={this.deleteForm}
                size='3x'
                title='Delete Form'
                className='pointerForIcon'
              />

              <FontAwesomeIcon
                icon={faLongArrowAltLeft}
                style={{ marginLeft: "4%" }}
                color='dodgerblue'
                onClick={this.showAllForms}
                size='3x'
                title='Go Back'
                className='pointerForIcon'
              />
            </div>
          ) : (
            <FontAwesomeIcon
              icon={faPlus}
              color='dodgerblue'
              onClick={this.openNewFormDialogFunction}
              size='3x'
              title='Open New Form'
              className='pointerForIcon'
            />
          )}
          <label>Click On Plus Icon To Create Form</label>
        </div>
        <div style={{ marginTop: "2%" }}>
          {!this.createNewForm ? (
            this.listOfForms.map((row, index) => (
              <div className='mycards'>
                <div
                  style={{
                    backgroundImage:
                      "url(" +
                      localStorage.getItem("apiURL") +
                      "flowable-modeler/app/rest/models/" +
                      row["id"] +
                      "/thumbnail" +
                      ")",
                    backgroundPosition: "center 20px",
                    overflow: "hidden",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "auto",
                  }}
                  className='containers'
                  onClick={this.openForm.bind(this, row)}
                >
                  <div className='imgContainer'>
                    <div className='background'>
                      <h3 title={row["name"]}>{row["name"]} </h3>
                      <span>{row["createdBy"]} </span>
                      <br />
                      <span>{row["lastUpdated"]}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>
              <FormBuilder
                form={this.formJson}
                onChange={(schema) => this.updateForm(schema)}
              />
            </div>
          )}
        </div>

        {/*PAGINATION IS HARDCODED*/}
        <div class='pagination'>
          <a href='#'>&laquo;</a>
          <a href='#'>1</a>
          <a class='active' href='#'>
            2
          </a>
          <a href='#'>3</a>
          <a href='#'>&raquo;</a>
        </div>
        {/*PAGINATION IS HARDCODED*/}
      </div>
    );
  }
}

export default FormBuilderIO;
