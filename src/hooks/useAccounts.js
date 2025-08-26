// hooks/useAccounts.js
import { useState } from 'react';
import { 
  getAccounts, 
  updateAccounts as updateAccountsInDB
} from '../utils/storage';

export const useAccounts = () => {
  const [data, setData] = useState({ checking: 0, savings: 0 });

  const loadData = async () => {
    try {
      const accounts = await getAccounts();
      setData(accounts);
    } catch (error) {
      console.error('Error loading accounts:', error);
      setData({ checking: 0, savings: 0 });
    }
  };

  const updateBalance = async (accountType, amount) => {
    try {
      const updatedAccounts = {
        ...data,
        [accountType]: parseFloat(amount) || 0
      };
      
      await updateAccountsInDB(updatedAccounts);
      setData(updatedAccounts);
    } catch (error) {
      console.error('Error updating account balance:', error);
    }
  };

  const updateBothBalances = async (checkingAmount, savingsAmount) => {
    try {
      const updatedAccounts = {
        checking: parseFloat(checkingAmount) || 0,
        savings: parseFloat(savingsAmount) || 0
      };
      
      await updateAccountsInDB(updatedAccounts);
      setData(updatedAccounts);
    } catch (error) {
      console.error('Error updating account balances:', error);
    }
  };

  const getTotalFunds = () => {
    return data.checking + data.savings;
  };

  const getFormattedBalance = (accountType, balanceVisible = true) => {
    if (!balanceVisible) return 'RM•••••';
    
    const amount = data[accountType] || 0;
    return `RM${amount.toLocaleString('en-MY', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  return {
    data,
    loadData,
    updateBalance,
    updateBothBalances,
    getTotalFunds,
    getFormattedBalance
  };
};