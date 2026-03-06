/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useReducer, useEffect, useContext } from "react";
import axios from "axios";

const initialState = {
  transactions: [],
  goals: [],
  isLoading: true,
  error: null,
};

const AppReducer = (state, action) => {
  switch (action.type) {
    case "GET_TRANSACTIONS":
      return {
        ...state,
        isLoading: false,
        transactions: action.payload,
      };

    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };

    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };

    case "GET_GOALS":
      return {
        ...state,
        isLoading: false,
        goals: action.payload,
      };

    case "ADD_GOAL":
      return {
        ...state,
        goals: [action.payload, ...state.goals],
      };

    case "DELETE_GOAL":
      return {
        ...state,
        goals: state.goals.filter((g) => g.id !== action.payload),
      };

    case "TRANSACTION_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    default:
      return state;
  }
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // API endpoints
  const TRANSACTION_API = "http://localhost:5000/api/v1/transactions";
  const GOALS_API = "http://localhost:5000/api/v1/goals";

  // ===============================
  // TRANSACTIONS
  // ===============================

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(TRANSACTION_API);

      dispatch({
        type: "GET_TRANSACTIONS",
        payload: res.data.data,
      });
    } catch (err) {
      dispatch({
        type: "TRANSACTION_ERROR",
        payload: err.response?.data?.error || "Lỗi kết nối backend",
      });
    }
  };

  const addTransaction = async (transaction) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post(TRANSACTION_API, transaction, config);

      dispatch({
        type: "ADD_TRANSACTION",
        payload: res.data.data,
      });
    } catch (err) {
      dispatch({
        type: "TRANSACTION_ERROR",
        payload: err.response?.data?.error || "Không thể lưu giao dịch",
      });
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${TRANSACTION_API}/${id}`);

      dispatch({
        type: "DELETE_TRANSACTION",
        payload: id,
      });
    } catch (err) {
      dispatch({
        type: "TRANSACTION_ERROR",
        payload: "Không thể xóa giao dịch",
      });
    }
  };

  // ===============================
  // GOALS
  // ===============================

  const fetchGoals = async () => {
    try {
      const res = await axios.get(GOALS_API);

      dispatch({
        type: "GET_GOALS",
        payload: res.data.data,
      });
    } catch (err) {
      dispatch({
        type: "GET_GOALS",
        payload: [],
      });
    }
  };

  const addGoal = async (goal) => {
    try {
      const res = await axios.post(GOALS_API, goal);

      dispatch({
        type: "ADD_GOAL",
        payload: res.data.data,
      });
    } catch (err) {
      dispatch({
        type: "TRANSACTION_ERROR",
        payload: "Không thể thêm mục tiêu",
      });
    }
  };

  const deleteGoal = async (id) => {
    try {
      await axios.delete(`${GOALS_API}/${id}`);

      dispatch({
        type: "DELETE_GOAL",
        payload: id,
      });
    } catch (err) {
      dispatch({
        type: "TRANSACTION_ERROR",
        payload: "Không thể xóa mục tiêu",
      });
    }
  };

  // ===============================
  // LOAD DATA WHEN APP START
  // ===============================

  useEffect(() => {
    fetchTransactions();
    fetchGoals();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        transactions: state.transactions,
        goals: state.goals,
        isLoading: state.isLoading,
        error: state.error,

        fetchTransactions,
        addTransaction,
        deleteTransaction,

        fetchGoals,
        addGoal,
        deleteGoal,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
