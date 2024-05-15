import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AccountForm } from './AccountForm';
import Modal from '../../../../components/commoncomponents/Modal';
import { createAccount, deleteAccount, fetchAccountById, fetchAccounts, updateAccount } from '../../../../redux/features/AccountSlice';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { clearHeading, setHeading } from '../../../../redux/features/HeadingSlice';

const AccountComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accounts, loading, error } = useSelector(state => state?.account);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    const filtered = accounts?.filter(account => account.account_name.toLowerCase().includes(value.toLowerCase()));
    setFilteredAccounts(filtered);
  };

  const handleCreate = () => {
    setSelectedAccount({ account_name: '', account_balance: '' });
    setIsEditMode(false);
    setModalVisible(true);
  };

  const handleAccountBook = (account) => {
    dispatch(fetchAccountById(account.id));
    navigate('/account/view');
  };

  const handleSubmit = (data) => {
    if (isEditMode) {
      dispatch(updateAccount({ id: selectedAccount.id, ...data }));
    } else {
      dispatch(createAccount(data));
    }
    setModalVisible(false);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    handleSearch({ target: { value: searchTerm } });
  }, [accounts]);

  useEffect(() => {
    dispatch(setHeading("Account"));
  
    // Optionally reset the heading when the component unmounts
    return () => {
      dispatch(clearHeading());
    };
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <h1 className="text-xl font-medium text-center py-4">Account Management</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      <div className="py-4 flex justify-between mb-4">
        <div className="relative w-[20rem]">
          <FaSearch className="absolute text-gray-400 left-3  top-5  transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by account name..."
            value={searchTerm}
            onChange={handleSearch}
            className="border rounded py-2 pl-10 pr-4 w-full "
          />
        </div>
        <button onClick={handleCreate} className="bg-blue-500 hover:bg-blue-700 text-white px-2 leading-none  rounded">
          Add Account
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredAccounts?.map(account => (
          <div key={account.id} className="bg-gray-100 p-4 rounded shadow-lg flex flex-col items-center">
            <div className="bg-white p-4 shadow rounded-full w-40 h-40 flex items-center justify-center">
              <span className="text-xl font-bold">Rs.{account.opening_balance}</span>
            </div>
            <p className="text-lg font-bold mt-4">{account.account_name}</p>
            <div className="mt-4">
              <button onClick={() => handleAccountBook(account)} className="text-blue-500 hover:text-blue-700 px-2">
                View Account 
              </button>
            </div>
          </div>
        ))}
      </div>
      {modalVisible && (
        <Modal
          visible={modalVisible}
          onClose={handleClose}
          title={isEditMode ? 'Edit Account' : 'Add Account'}
          content={<AccountForm initialData={selectedAccount} onSubmit={handleSubmit} onCancel={handleClose} />}
        />
      )}
    </div>
  );
};

export default AccountComponent;
