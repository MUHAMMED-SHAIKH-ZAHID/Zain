import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { clearHeading, setHeading } from '../../../redux/features/HeadingSlice';
import { CustomerColumns } from '../../../components/table/columns/CustomerColumns';
import DataTable from '../../../components/table/DataTable';
import DeleteCustomer from './DeleteCustomer';

const Data = [
  {
    "name": "John Doe",
    "code": "AB123",
    "address": "123 Main St",
    "address2": "Suite 100",
    "state": "CA",
    "gmap": "https://maps.example.com/q=123",
    "mobile": "555-1234",
    "mobile2": "555-5678",
    "email": "john.doe@example.com",
    "route": "/users/1",
    "companyName": "Acme Corp",
    "salesPersonAssigned": "Jane Smith"
  },
  {
    "name": "Jane Smith",
    "code": "",
    "address": "456 Elm St",
    "address2": "",
    "state": "NY",
    "gmap": "",
    "mobile": "555-9876",
    "mobile2": "",
    "email": "jane.smith@example.com",
    "route": "",
    "companyName": "",
    "salesPersonAssigned": ""
  },
  {
    "name": "Alice Johnson",
    "code": "CD456",
    "address": "789 Pine St",
    "address2": "Apt 2",
    "state": "TX",
    "gmap": "https://maps.example.com/q=456",
    "mobile": "555-6543",
    "mobile2": "555-3210",
    "email": "alice.johnson@example.com",
    "route": "/users/3",
    "companyName": "Beta Inc",
    "salesPersonAssigned": "John Doe"
  },
    {
        "name": "Tyler Kennedy",
        "code": "1150f8aa-b87f-4605-a9fa-b66b5d83b729",
        "address": "696 Simmons Glen",
        "address2": "Apt. 137",
        "state": "Alabama",
        "gmap": "https://maps.google.com/?q=23.787214,-98.173266",
        "mobile": "914.840.9667x4236",
        "mobile2": "863-773-3678x659",
        "email": "daltondavis@yahoo.com",
        "route": "http://foster.com/",
        "companyName": "Moody-Schroeder",
        "salesPersonAssigned": ""
    },
    {
        "name": "Kelsey Moore",
        "code": "",
        "address": "3686 Morales Springs Suite 167",
        "address2": "",
        "state": "Michigan",
        "gmap": "",
        "mobile": "+1-103-941-4163",
        "mobile2": "",
        "email": "eboone@salinas.com",
        "route": "http://stewart.com/",
        "companyName": "",
        "salesPersonAssigned": "Sandra Franklin"
    },
    {
        "name": "Joseph Hartman",
        "code": "",
        "address": "46162 Brown Mount",
        "address2": "",
        "state": "Indiana",
        "gmap": "https://maps.google.com/?q=-67.595951,-44.315576",
        "mobile": "(600)829-9265",
        "mobile2": "001-670-821-5976x11448",
        "email": "laurahansen@flores.com",
        "route": "",
        "companyName": "Barber, Williams and Vazquez",
        "salesPersonAssigned": ""
    },
    {
        "name": "Jerome Perry",
        "code": "",
        "address": "7491 Lauren Lake",
        "address2": "",
        "state": "Louisiana",
        "gmap": "https://maps.google.com/?q=19.5837295,72.599576",
        "mobile": "522-450-9257",
        "mobile2": "(737)174-5248",
        "email": "tamarawood@hotmail.com",
        "route": "",
        "companyName": "Hill-Nelson",
        "salesPersonAssigned": "Dale Wall"
    },
    {
        "name": "Tami Reid",
        "code": "a05dac52-90d7-4876-b8c3-cec37bb62358",
        "address": "079 Robert Pike",
        "address2": "",
        "state": "Kentucky",
        "gmap": "",
        "mobile": "219.081.9115",
        "mobile2": "",
        "email": "david62@hooper.com",
        "route": "https://rose-nelson.com/",
        "companyName": "Howell PLC",
        "salesPersonAssigned": "Nicholas James"
    },
    {
        "name": "Sierra Thomas",
        "code": "",
        "address": "38134 Perkins Springs Suite 690",
        "address2": "Apt. 520",
        "state": "Tennessee",
        "gmap": "",
        "mobile": "(213)914-9650x782",
        "mobile2": "",
        "email": "harrisonjennifer@yahoo.com",
        "route": "",
        "companyName": "Jones, King and Smith",
        "salesPersonAssigned": "Christine Lee"
    },
    {
        "name": "Gregory Clark",
        "code": "4e6bef4d-8eac-46f5-bec0-9e2a5e4d27e4",
        "address": "3029 Jennifer Walks",
        "address2": "Apt. 998",
        "state": "Washington",
        "gmap": "https://maps.google.com/?q=45.123541,-122.123521",
        "mobile": "561-994-8876",
        "mobile2": "555-294-9876",
        "email": "clarkgregory@baker.com",
        "route": "http://gregoryclark.com/",
        "companyName": "Clark Enterprises",
        "salesPersonAssigned": "Jennifer Baker"
    },
    {
        "name": "Melissa Torres",
        "code": "",
        "address": "8406 Vanessa Drive",
        "address2": "Suite 450",
        "state": "Virginia",
        "gmap": "",
        "mobile": "+1-895-688-0599",
        "mobile2": "139.549.0795x7363",
        "email": "victormorrow@williams-bishop.com",
        "route": "",
        "companyName": "",
        "salesPersonAssigned": "Kaylee Stone"
        },
        {
        "name": "Kayla Villanueva",
        "code": "",
        "address": "3329 Veronica Ports",
        "address2": "",
        "state": "Wisconsin",
        "gmap": "",
        "mobile": "001-314-797-7673x7119",
        "mobile2": "",
        "email": "qkane@guerra.com",
        "route": "http://wolf.com/",
        "companyName": "Waller, Guerrero and Collins",
        "salesPersonAssigned": ""
        },
        {
        "name": "Debra Nicholson",
        "code": "",
        "address": "996 Angelica Crest Suite 216",
        "address2": "",
        "state": "Oregon",
        "gmap": "",
        "mobile": "001-884-363-7530x02170",
        "mobile2": "+1-049-045-5934x268",
        "email": "cmurphy@yahoo.com",
        "route": "",
        "companyName": "",
        "salesPersonAssigned": "Jacob Velasquez"
        },
        {
        "name": "Danielle Marshall",
        "code": "21f47020-23ac-4892-85a3-2027fc4c142d",
        "address": "407 Baker Drive Apt. 043",
        "address2": "Suite 242",
        "state": "New Jersey",
        "gmap": "https://maps.google.com/?q=-7.4934535,-27.598283",
        "mobile": "004.278.2767x35574",
        "mobile2": "",
        "email": "waltersjulie@torres-diaz.biz",
        "route": "https://www.collier.com/",
        "companyName": "",
        "salesPersonAssigned": ""
        },
        {
        "name": "Zachary Benson",
        "code": "",
        "address": "41730 Caldwell Forge Suite 989",
        "address2": "",
        "state": "Illinois",
        "gmap": "https://maps.google.com/?q=-7.899737,73.064101",
        "mobile": "768-809-8913x7617",
        "mobile2": "",
        "email": "wintersamanda@gmail.com",
        "route": "https://www.murphy.com/",
        "companyName": "",
        "salesPersonAssigned": "David Torres"
        },
        {
        "name": "Miss Lisa Jones",
        "code": "",
        "address": "107 Krause Trail Suite 939",
        "address2": "Suite 908",
        "state": "Missouri",
        "gmap": "",
        "mobile": "001-168-605-5386x337",
        "mobile2": "",
        "email": "knixon@gmail.com",
        "route": "",
        "companyName": "Norton and Sons",
        "salesPersonAssigned": "Jared Hughes"
        },
        {
        "name": "Heather Garcia",
        "code": "d44f19a0-3def-4f19-af47-033d7a8419b8",
        "address": "1590 Jessica Turnpike",
        "address2": "Suite 222",
        "state": "Florida",
        "gmap": "https://maps.google.com/?q=28.213456,-81.654321",
        "mobile": "555-1234-5678",
        "mobile2": "555-9876-5432",
        "email": "hgarcia@example.com",
        "route": "https://hgarcia-enterprises.com",
        "companyName": "Garcia Enterprises",
        "salesPersonAssigned": "Carlos Ruiz"
        },
        {
        "name": "Brian Nguyen",
        "code": "",
        "address": "6842 Michael Unions",
        "address2": "Apt. 789",
        "state": "Texas",
        "gmap": "",
        "mobile": "+1-555-678-9012",
        "mobile2": "+1-555-234-5678",
        "email": "bnguyen@examples.com",
        "route": "",
        "companyName": "Nguyen Ltd",
        "salesPersonAssigned": "Samantha Lee"
        },


];
const Customer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHeading("SalesExecutive"));
    
    // Optionally reset the heading when the component unmounts
    return () => {
      dispatch(clearHeading());
    };
  }, [dispatch]);

  //   const [showEditModal, setShowEditModal] = useState(false);
// const [editData, setEditData] = useState(null);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleteItemId, setDeleteItemId] = useState(null);


const editClickHandler = (rowData) => {
// console.log("Button clicked for row:", rowData);
// setEditData(rowData);
// setShowEditModal(true); // Open the modal when edit is clicked
};
const handleCloseEditModal = () => {
// setShowEditModal(false);
};

const deleteClickHandler = (rowData) => {
setDeleteItemId(rowData.id); // Assuming `id` is the unique identifier
setShowDeleteModal(true);
};

const handleDelete = (id) => {
console.log("Deleting item with id:", id);
// Perform your delete operation here
};

const handleCloseDeleteModal = () => {
setShowDeleteModal(false);
};
const columns = CustomerColumns(editClickHandler,deleteClickHandler);
  return (
    <div>
    <DataTable
  data={Data}
  columns={columns}
  filterColumn="state"
  title={'Customer'}
/>
  <DeleteCustomer
  show={showDeleteModal}
  handleClose={handleCloseDeleteModal}
  handleDelete={handleDelete}
  itemId={deleteItemId}
/>
</div>
  )
}

export default Customer