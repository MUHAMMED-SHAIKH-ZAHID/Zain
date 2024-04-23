import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearHeading, setHeading } from "../../../redux/features/HeadingSlice";
import DataTable from "../../../components/table/DataTable";
import { suplierColumns } from "../../../components/table/columns/SupplierColumns";
import AddSupplier from "./AddSupplier";
import Modal from "../../../components/commoncomponents/Modal";
import EditSupplier from "./EditSupplier";
import DeleteSupplier from "./DeleteSupplier";
import { deleteSupplier, fetchAllSuppliers } from "../../../redux/features/SupplierSlice";



const Data = [
  {
    "name": "Thomas Gonzalez",
    "code": "FKC9619",
    "email": "gtorres@yahoo.com",
    "mobile": 5435550346,
    "mobile2": "7125608799",
    "address": "2440 Kristin Lights\nJamesside, DC 14287",
    "address2": null,
    "company": "Moore-Lopez",
    "gst": "02AAAA157543Z8A",
    "pannumber": "AAAAA9431A",
    "location": "New Caledonia"
  },
  {
    "name": "Joseph Alexander",
    "code": "XPS4757",
    "email": "frankjohnson@bradley.com",
    "mobile": 6176492194,
    "mobile2": "7523622152",
    "address": "868 Ortega Pike\nMartinburgh, NC 01054",
    "address2": "04349 Wong Lock\nHobbsport, NM 19174",
    "company": "Perkins, Griffin and King",
    "gst": "80AAAA717405Z4A",
    "pannumber": "AAAAA8788A",
    "location": "Iraq"
  },
  {
    "name": "Hannah Sharp",
    "code": "IFZ7407",
    "email": "yutoni@king.org",
    "mobile": 6966490888,
    "mobile2": "1258659461",
    "address": "322 Davis Springs Apt. 797\nMarkburgh, KS 06788",
    "address2": null,
    "company": "Long and Sons",
    "gst": "66AAAA775257Z5A",
    "pannumber": null,
    "location": "Honduras"
  },
  {
    "name": "Jeffrey Mcdonald",
    "code": "YZP3535",
    "email": "jonescesar@hamilton.com",
    "mobile": 9214614489,
    "mobile2": "4922387941",
    "address": "34829 Laura Extension Suite 182\nNorth Dennisport, DE 36833",
    "address2": "01024 Martin Field Suite 137\nWest Chad, OR 58375",
    "company": "Wells LLC",
    "gst": "83AAAA020436Z3A",
    "pannumber": "AAAAA1492A",
    "location": "Iraq"
  },
  {
    "name": "Michael Huerta",
    "code": "DMT1470",
    "email": "hallricky@yahoo.com",
    "mobile": 6136952233,
    "mobile2": "2632683336",
    "address": "451 Jeremy Lakes\nStonefurt, AZ 59247",
    "address2": null,
    "company": "Harrison, Wilson and Howard",
    "gst": "88AAAA233594Z1A",
    "pannumber": null,
    "location": "Antarctica "
  },
  {
    "name": "Amanda Flores DVM",
    "code": "QNU5826",
    "email": "kellykevin@moon.org",
    "mobile": 8277142788,
    "mobile2": "7149270529",
    "address": "69277 Gonzalez Pass Suite 937\nNorth Michaelmouth, VT 39809",
    "address2": "PSC 0176, Box 0347\nAPO AE 97195",
    "company": "Richardson and Sons",
    "gst": "22AAAA581363Z6A",
    "pannumber": null,
    "location": "South Africa"
  },
  {
    "name": "Johnny Osborne",
    "code": "DWR7725",
    "email": "cliffordperkins@hotmail.com",
    "mobile": 1630807719,
    "mobile2": "9329878395",
    "address": "86761 Fuller Court\nCheyenneton, CO 79501",
    "address2": null,
    "company": "King, Patterson and Hall",
    "gst": "50AAAA490441Z0A",
    "pannumber": null,
    "location": "Cocos (Keeling) Islands"
  },
  {
    "name": "Elizabeth Singleton",
    "code": "BHG4956",
    "email": "megan23@jenkins.com",
    "mobile": 1766952648,
    "mobile2": "5920840563",
    "address": "08274 Thomas MissionSuite 744\nBryanport, GA 69644",
"address2": null,
"company": "Hall, Cunningham and Wright",
"gst": "64AAAA249323Z6A",
"pannumber": null,
"location": "Cameroon"
},
{
"name": "Bradley Dennis",
"code": "KXU5926",
"email": "ronald22@carson-grant.com",
"mobile": 9544111820,
"mobile2": "8681593422",
"address": "7845 Sara Crest\nNew Meredith, PA 49225",
"address2": null,
"company": "Munoz Group",
"gst": "91AAAA326180Z3A",
"pannumber": null,
"location": "Liechtenstein"
},
{
"name": "Rodney Turner",
"code": "NSD0162",
"email": "richard43@jones.com",
"mobile": 9404832836,
"mobile2": "7856102528",
"address": "2025 Brown Falls Suite 175\nPort Fredericktown, DC 85703",
"address2": null,
"company": "Todd, Stein and Le",
"gst": "49AAAA406438Z4A",
"pannumber": "AAAAA8392A",
"location": "Pakistan"
}
]

const Suppliers = () => {




const [showEditModal, setShowEditModal] = useState(false);
const [editData, setEditData] = useState(null);
const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);


const editClickHandler = (rowData) => {
  console.log("Button clicked for row:", rowData);
  setEditData(rowData);
  setShowEditModal(true); // Open the modal when edit is clicked
};
const handleCloseEditModal = () => {
  setShowEditModal(false);
};
  
const deleteClickHandler = (rowData) => {
  setDeleteItemId(rowData.id); // Assuming `id` is the unique identifier
  setShowDeleteModal(true);
};

const handleDelete = (id) => {
  console.log("Deleting item with id:", id);
  dispatch(deleteSupplier(id))
};

const handleCloseDeleteModal = () => {
  setShowDeleteModal(false);
};
  const columns = suplierColumns(editClickHandler,deleteClickHandler);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHeading("Supplier"));

    // Optionally reset the heading when the component unmounts
    return () => {
      dispatch(clearHeading());
    };
  }, [dispatch]);

  const { suppliers, loading, error } = useSelector((state) => state?.supplier);

    useEffect(() => {
    // Dispatch the action to fetch dashboard data when the component mounts
    dispatch(fetchAllSuppliers());
  }, [dispatch]);
  return (
    <div>
   
      <DataTable
        data={suppliers}
        columns={columns}
        filterColumn="location"
        title={'supplier'}
      />
 
                  {showEditModal && (
                <EditSupplier
                    show={showEditModal}
                    handleClose={handleCloseEditModal}
                    data={editData}
                />
            )}
              <DeleteSupplier
        show={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        handleDelete={handleDelete}
        itemId={deleteItemId}
      />

    </div>
  )
}

export default Suppliers