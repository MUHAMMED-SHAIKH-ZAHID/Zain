// hooks/usePurchaseData.js
import { useSelector } from 'react-redux';

const usePurchaseData = () => {
  const { suppliers, loading, error } = useSelector(state => state.purchases);
  return { suppliers, loading, error };
};

export default usePurchaseData;
