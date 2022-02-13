import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { Container } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faArrowsRotate, faPlus, faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
async function getList() {
  try {
    let url = "http://localhost/crud/api.php?mode_get=read";
    const { data: response } = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log("No ashame : " + error);
  }
}
async function getListBySearch(search) {
  try {
    let url = "http://localhost/crud/api.php?mode_get=search&search=" + search;
    const { data: response } = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log("No ashame : " + error);
  }
}
function App() {

  // calling constructor to get some value 
  let [listDataFromServer, defineMeTheList] = useState([]);
  let [inputName, setName] = useState("");
  let [inputAge, setAge] = useState("");

  let [inputSearch, setSearch] = useState("");

  let nameRef = useRef(null);
  let ageRef = useRef(null);
  let searchRef = useRef(null);

  useEffect(() => {
    console.log("use effect");
    getList().then(items => {
      console.log(items);
      defineMeTheList(items);
    });
  }, []);

  const searchRecord = () => {
    console.log("searchRecord");
    getListBySearch(inputSearch).then(items => {
      console.log(items);
      defineMeTheList(items);
    });
  }
  const resetRecord = () => {
    console.log("Resetting record");
    searchRef.current.value = "";
    getList().then(items => {
      console.log(items);
      defineMeTheList(items);
    });
  }
  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  }
  const handleChangeName = (e) => {
    setName(e.target.value);
  }
  const handleChangeAge = (e) => {
    setAge(e.target.value);
  }
  const handleChangeNameRow = (e, rowCurrent) => {
    let newName = e.target.value;
    var data = [];
    listDataFromServer.map((row) => {
      if (row.personId === rowCurrent.personId && row.name !== newName) {
        var row = { personId: row.personId, name: newName, age: row.age };
        data.push(row);
      } else {
        data.push(row);
      }
    });
    defineMeTheList(data);
  }
  const handleChangeAgeRow = (e, rowCurrent) => {
    let newAge = e.target.value;
    var data = [];
    listDataFromServer.map((row) => {
      if (row.personId === rowCurrent.personId && row.age !== newAge) {
        var row = { personId: row.personId, name: row.name, age: newAge };
        data.push(row);
      } else {
        data.push(row);
      }
    });
    defineMeTheList(data);
  }
  const createRecord = () => {
    console.log("addRecord");
    var formData = new FormData();

    formData.append("mode", "create");
    formData.append("name", inputName);
    formData.append("age", inputAge);
    // copy axios url from prev list 
    let url = "http://localhost/crud/api.php";

    axios.post(url, formData).then(function (output) {
      if (output.data.success === true) {
        console.log("record added");

        var row = { personId: output.data.lastInsertId, name: inputName, age: inputAge };
        listDataFromServer.push(row);
        console.log(listDataFromServer);
        defineMeTheList([...listDataFromServer]);

        nameRef.current.value = "";
        ageRef.current.value = "";
        Swal.fire({
          title: 'Record Added',
          text: 'Please wait...',
          icon: 'info'
        })
      } else {
        console.log("Something odd " + output.data);
        Swal.fire({
          title: 'Server',
          text: 'We noted , server got some issue ',
          icon: 'warning'
        })
      }
    }).catch(function (error) {
      console.log(error);
      Swal.fire({
        title: 'Server',
        text: 'We noted , server got some issue ',
        icon: 'warning'
      })
    });


  }
  const updateRecord = (row) => {
    console.log("update record");

    var formData = new FormData();

    formData.append("mode", "update");
    formData.append("name", row.name);
    formData.append("age", row.age);
    formData.append("personId", row.personId);
    // copy axios url from prev list 
    let url = "http://localhost/crud/api.php";

    axios.post(url, formData).then(function (output) {
      if (output.data.success === true) {
        console.log("record added");
        Swal.fire({
          title: 'Record Added',
          text: 'Please wait...',
          icon: 'info'
        })
      } else {
        console.log("Something odd " + output.data);
        Swal.fire({
          title: 'Server',
          text: 'We noted , server got some issue ',
          icon: 'warning'
        })
      }
    }).catch(function (error) {
      console.log(error);
      Swal.fire({
        title: 'Server',
        text: 'We noted , server got some issue ',
        icon: 'warning'
      })
    });
  }
  const deleteRecord = (row) => {
    let url = "http://localhost/crud/api.php";
    console.log("deleteRecord");

    var formData = new FormData();

    formData.append("mode", "delete");
    formData.append("personId", row.personId);
    axios.post(url, formData).then(function (output) {
      if (output.data.success === true) {

        defineMeTheList(listDataFromServer.filter(item => item.personId !== row.personId));
        Swal.fire({
          title: 'Record Deleted',
          text: 'Please wait...',
          icon: 'info'
        })
      } else {
        console.log("Something odd " + output.data);
        Swal.fire({
          title: 'Server',
          text: 'We noted , server got some issue ',
          icon: 'warning'
        })
      }
    }).catch(function (error) {
      console.log(error);
      Swal.fire({
        title: 'Server',
        text: 'We noted , server got some issue ',
        icon: 'warning'
      })
    });
  }
  const anyData = () => {
    return (
      listDataFromServer.map((row) => {
        let name = row.personId + "-Name";
        let age = row.personId + "-Age";
        return (<tr id={row.personId} key={row.personId}>
          <td> {row.personId} </td>
          <td>
            <input type="text" placeholder="Name" id={name} className="form-control" defaultValue={row.name} onChange={(e) => handleChangeNameRow(e, row)} />
          </td>
          <td>
            <input type="text" placeholder="Age" id={age} className="form-control" defaultValue={row.age} onChange={(e) => handleChangeAgeRow(e, row)} />

          </td>
          <td>
            <button type="button" className="btn btn-warning" onClick={(e) => updateRecord(row)}>
              <FontAwesomeIcon icon={faPenToSquare} />&nbsp;
              UPDATE</button>
            &nbsp;
            <button type="button" className="btn btn-danger" onClick={() => deleteRecord(row)}>
              <FontAwesomeIcon icon={faTrash} />&nbsp;
              DELETE</button>
          </td>
        </tr>)
      }));
  }
  const emptyData = () => {
    return (<tr><td colSpan={4}>No Record Available</td></tr>);
  }
  return (
    <Container>
      <h1>This is sample react app with bootstrap inline</h1>
      <div className="card">
        <div className="card-body">
          <label>
            <input ref={searchRef} type="text" className="form-control" id="search" placeholder="Search Here" onChange={(e) => handleChangeSearch(e)} />
          </label>
        </div>
        <div className="card-footer">
          <button className="btn btn-info" onClick={searchRecord}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
      </div>
      <br />
      <table className="table table-striped">
        <thead>
          <tr>
            <th>
              <button type="button" onClick={resetRecord} className="btn btn-primary">
                <FontAwesomeIcon icon={faArrowsRotate} />
              </button>
            </th>
            <th><input type="text" ref={nameRef} id="name" placeholder="Name" className="form-control" onChange={(e) => handleChangeName(e)} /></th>
            <th><input type="text" ref={ageRef} id="age" placeholder="Age" className="form-control" onChange={(e) => handleChangeAge(e)} /> </th>
            <th>
              <button type="button" className="btn btn-primary" onClick={createRecord}>
                <FontAwesomeIcon icon={faPlus} />&nbsp;
                Create </button>
            </th>
          </tr>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Age</th>
            <th>Command</th>
          </tr>
        </thead>
        <tbody id="tbody">
          {(listDataFromServer?.length > 0) ? anyData() : emptyData()}
        </tbody>
      </table>
    </Container>
  );
}

export default App;
