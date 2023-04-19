import React, { Fragment, useEffect, useState } from "react";
import Button from "devextreme-react/button";
import DataGrid, {
  Column,
  GridColumn,
  Editing,
  Paging,
  Lookup,
  SearchPanel,
  Item,
} from "devextreme-react/data-grid";

import { Navbar, ListGroup } from "react-bootstrap";
import axios from "axios";
import { API_BASE_URL } from "../../appconfig/config.js";

import notify from "devextreme/ui/notify";

const LeaveApproval = (props) => {
  const [leaveApproval, setLeaveApproval] = useState([]);
  const [isLoadingData, setIsdataLoading] = useState(true);
  const [pageProperties, setPageProperties] = useState({
    EmployeeID: 0,
    DataLoading: false,
    isDocReadonly: false,
    UpdateMode: false,
  });

  //update button
  /*  const onSaveBtnClick = (e) => {
      try {
        pageProperties.UpdateMode ? updateLeave() : LeaveApproval();
      } catch (error) {
        console.error(error);
      }
    };
*/
  const showErrorAlert = (errorMsg) => {
    notify(
      {
        message: errorMsg.toString(),
        width: 450,
      },
      "error",
      3000
    );
  };

  const showSuccessAlert = (successMsg) => {
    notify(
      {
        message: successMsg.toString(),
        width: 450,
      },
      "success",
      3000
    );
  };

  /*  const updateLeave = () => {
      try {
        if (pageProperties.EmployeeID > 0)
          axios
            .put(`${API_BASE_URL}/api/employee/leave-request-approval`, {
              EmployeeID: pageProperties.EmployeeID,
              LeaveInfo: JSON.stringify(leaveApproval),
             
            })
            .then((response) => {
              console.log(response);
              if (response.data.affectedRows === 1) {
                showSuccessAlert(`Leave Requests updated`);
              }
            })
            .catch((error) => {
              showErrorAlert(error);
            });
      } catch (error) {
        console.error(error);
        showErrorAlert(error);
      }
    };*/

  const [statusList, setStatusList] = useState([]);

  const fetchURL = `${API_BASE_URL}/api/employee/leave-approval`;

  useEffect(() => {
    if (isLoadingData) {
      axios.get(fetchURL).then((response) => {
        console.log(response);
        setLeaveApproval(response.data);
        setIsdataLoading(false);
      });
    }
  }, []);

  const onRowUpdated = (e) => {
    if (e.data) {
      updateLeaveStatus(e.data.EmployeeID, e.data.Status);
    }
  };

  const updateLeaveStatus = (employeeID, status) => {
    axios
      .put(`${API_BASE_URL}/api/employee/leave-request-approval`, {
        EmployeeID: employeeID,
        Status: status,
      })
      .then((response) => {
        console.log(response);
        if (response.data.affectedRows > 0) {
          //has to change
          showSuccessAlert(`Leave Request Status updated`);
        }
      })
      .catch((error) => {
        showErrorAlert(error);
      });
  };

  const onSaveBtnClick = (e) => {
    try {
      let putRequestBody = [];
      leaveApproval.forEach((element) => {
        putRequestBody.push({
          EmployeeID: element.EmployeeID,
          Status: element.Status,
        });
      });

      console.log("###", putRequestBody);
      axios
        .put(`${API_BASE_URL}/api/employee/leave-request-approval`, {
          LeaveInfo: JSON.stringify(putRequestBody),
        })
        .then((response) => {
          console.log(response);
          if (response.data.affectedRows >= 1) {
            //has to change
            showSuccessAlert(`Leave Requests updated`);
            setPageProperties({
              ...pageProperties,
              UpdateMode: false,
            });
          }
        })
        .catch((error) => {
          showErrorAlert(error);
        });
    } catch (error) {
      console.error(error);
      showErrorAlert(error);
    }
  };

  const leaveStatusList = [
    { ID: 0, Name: "Pending" },
    { ID: 1, Name: "Accepted" },
    { ID: 2, Name: "Rejected" },
  ];

  return (
    <Fragment>
      <div className={"content-block"}>
        <h5>Leave Approval</h5>

        <DataGrid
          id="grid-list"
          dataSource={leaveApproval}
          keyExpr="AutoID"
          showBorders={true}
          wordWrapEnabled={true}
          allowSearch={true}
          selection={{ mode: "single" }}
          hoverStateEnabled={true}
          onRowUpdated={onRowUpdated}
        >
          <Editing mode="cell" allowUpdating={true} />
          <SearchPanel visible={true} />
          <Paging enabled={true} />
          <Column dataField="AutoID" visible={false} />
          <Column dataField="FirstName" allowEditing={false} />
          <Column dataField="LastName" allowEditing={false} />
          <Column dataField="EmployeeID" allowEditing={false} /*width={130}*/ />
          <Column dataField="Position" allowEditing={false} />
          <Column
            dataField="LeaveCategory"
            caption="Category"
            allowEditing={false}
          />
          <Column
            dataField="LeaveType"
            caption="Leave Type"
            allowEditing={false}
          />
          <Column dataField="LeaveFrom" caption="From" allowEditing={false} />
          <Column dataField="LeaveTo" caption="To" allowEditing={false} />
          <Column dataField="DayCount" caption="Days" allowEditing={false} />
          <Column dataField="Status">
            <Lookup
              value={1}
              dataSource={leaveStatusList}
              displayExpr="Name"
              valueExpr="ID"
            />
          </Column>
        </DataGrid>

        <Navbar bg="light" variant="light" className="crud_panel_buttons">
          <Button
            className="crud_panel_buttons"
            stylingMode="contained"
            type="success"
            onClick={onSaveBtnClick}
          >
            {pageProperties.UpdateMode ? "Save Changes" : "Save Changes"}
          </Button>
        </Navbar>
      </div>
    </Fragment>
  );
};

export default LeaveApproval;
