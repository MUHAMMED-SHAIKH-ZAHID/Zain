import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearHeading, setHeading } from "../../../redux/features/HeadingSlice";
import { salesColumns } from "../../../components/table/columns/SalesColumns";
import DataTable from "../../../components/table/DataTable";
import DeleteSales from "./DeleteSales";

const Data = [
  { orderID: '001', invoice: 'INV-1000', generatedDate: '2023-01-11', dealername: 'Dealer A',  totalamount: 531, totalinclgst: 2035 },
  { orderID: '002', invoice: 'INV-1001', generatedDate: '2023-01-13', dealername: 'Dealer B',  totalamount: 1748, totalinclgst: 898 },
  { orderID: '003', invoice: 'INV-1002', generatedDate: '2023-03-22', dealername: 'Dealer C',  totalamount: 1151, totalinclgst: 772 },
  { orderID: '004', invoice: 'INV-1003', generatedDate: '2023-01-30', dealername: 'Dealer D',  totalamount: 898, totalinclgst: 1268 },
  { orderID: '005', invoice: 'INV-1004', generatedDate: '2023-02-20', dealername: 'Dealer E',  totalamount: 533, totalinclgst: 769 },
  { orderID: '006', invoice: 'INV-1005', generatedDate: '2023-02-22', dealername: 'Dealer F',  totalamount: 840, totalinclgst: 820 },
  { orderID: '007', invoice: 'INV-1006', generatedDate: '2023-03-11', dealername: 'Dealer G',  totalamount: 1665, totalinclgst: 646 },
  { orderID: '008', invoice: 'INV-1007', generatedDate: '2023-02-17', dealername: 'Dealer H',  totalamount: 1234, totalinclgst: 1199 },
  { orderID: '009', invoice: 'INV-1008', generatedDate: '2023-02-07', dealername: 'Dealer I',  totalamount: 1098, totalinclgst: 2115 },
  { orderID: '010', invoice: 'INV-1009', generatedDate: '2023-01-28', dealername: 'Dealer J',  totalamount: 1979, totalinclgst: 1484 },
  { orderID: '011', invoice: 'INV-1010', generatedDate: '2023-01-28', dealername: 'Dealer K',  totalamount: 1382, totalinclgst: 665 },
  { orderID: '012', invoice: 'INV-1011', generatedDate: '2023-01-01', dealername: 'Dealer L',  totalamount: 1894, totalinclgst: 1437 },
  { orderID: '013', invoice: 'INV-1012', generatedDate: '2023-02-08', dealername: 'Dealer M',  totalamount: 1631, totalinclgst: 1970 },
  { orderID: '014', invoice: 'INV-1013', generatedDate: '2023-01-16', dealername: 'Dealer N',  totalamount: 1390, totalinclgst: 1002 },
  { orderID: '015', invoice: 'INV-1014', generatedDate: '2023-01-08', dealername: 'Dealer O',  totalamount: 1217, totalinclgst: 822 },
  { orderID: '016', invoice: 'INV-1015', generatedDate: '2023-01-05', dealername: 'Dealer P',  totalamount: 1016, totalinclgst: 1285 },
  { orderID: '017', invoice: 'INV-1016', generatedDate: '2023-02-20', dealername: 'Dealer Q',  totalamount: 1168, totalinclgst: 1632 },
  { orderID: '018', invoice: 'INV-1017', generatedDate: '2023-03-01', dealername: 'Dealer R',  totalamount: 1971, totalinclgst: 1589 },
  { orderID: '019', invoice: 'INV-1018', generatedDate: '2023-02-18', dealername: 'Dealer S',  totalamount: 656, totalinclgst: 1720 },
  { orderID: '020', invoice: 'INV-1019', generatedDate: '2023-01-22', dealername: 'Dealer T',  totalamount: 1154, totalinclgst: 1318 }
];
const Sales = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHeading("Sales"));

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
const columns = salesColumns(editClickHandler,deleteClickHandler);
  return (
    <div>
    <DataTable
  data={Data}
  columns={columns}
  filterColumn="dealername"
  title={'Sales'}
/>
  <DeleteSales
  show={showDeleteModal}
  handleClose={handleCloseDeleteModal}
  handleDelete={handleDelete}
  itemId={deleteItemId}
/>
</div>
  )
}

export default Sales