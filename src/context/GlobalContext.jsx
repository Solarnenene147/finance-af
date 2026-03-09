/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
} from "react";

import { supabase } from "../supabaseClient";
import { useAuth } from "./AuthContext";

const GlobalContext = createContext();

const initialState = {
  transactions: [],
  goals: [],
  lastUpdated: null,
};

const AppReducer = (state, action) => {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        transactions: action.payload.transactions,
        goals: action.payload.goals,
        lastUpdated: Date.now(),
      };

    case "RESET":
      return initialState;

    case "ADD_T":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };

    case "DEL_T":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };

    case "ADD_G":
      return {
        ...state,
        goals: [action.payload, ...state.goals],
      };

    case "DEL_G":
      return {
        ...state,
        goals: state.goals.filter((g) => g.id !== action.payload),
      };

    default:
      return state;
  }
};

export const GlobalProvider = ({ children }) => {
  const { user } = useAuth();

  const [state, dispatch] = useReducer(AppReducer, initialState);

  const lastFetchedId = useRef(null);

  /*
  ==========================
  FETCH DATA
  ==========================
  */

  const fetchData = useCallback(async (uid) => {
    if (!uid || lastFetchedId.current === uid) return;

    try {
      const tRes = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", uid)
        .order("created_at", { ascending: false });

      const gRes = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", uid)
        .order("created_at", { ascending: false });

      if (tRes.error) throw tRes.error;
      if (gRes.error) throw gRes.error;

      dispatch({
        type: "SET_DATA",
        payload: {
          transactions: (tRes.data || []).map((t) => ({
            id: t.id,
            text: t.description,
            amount: t.amount,
            date: new Date(t.created_at).toLocaleDateString("vi-VN"),
            category: t.category,
          })),
          goals: gRes.data || [],
        },
      });

      lastFetchedId.current = uid;
    } catch (err) {
      console.error("FETCH DATA ERROR:", err.message);
    }
  }, []);

  /*
  ==========================
  ADD TRANSACTION
  ==========================
  */

  const addTransaction = async (transaction) => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        description: transaction.text,
        amount: transaction.amount,
        category: transaction.category,
      })
      .select()
      .single();

    if (error) {
      console.error("Insert transaction lỗi:", error);
      throw error;
    }

    dispatch({
      type: "ADD_T",
      payload: {
        id: data.id,
        text: data.description,
        amount: data.amount,
        category: data.category,
        date: new Date(data.created_at).toLocaleDateString("vi-VN"),
      },
    });
  };

  /*
  ==========================
  DELETE TRANSACTION
  ==========================
  */

  const deleteTransaction = async (id) => {
    const { error } = await supabase.from("transactions").delete().eq("id", id);

    if (error) {
      console.error("Delete transaction lỗi:", error);
      return;
    }

    dispatch({
      type: "DEL_T",
      payload: id,
    });
  };

  /*
  ==========================
  ADD GOAL
  ==========================
  */

  const addGoal = async (goal) => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from("goals")
      .insert({
        user_id: user.id,
        title: goal.title,
        target_amount: goal.target_amount,
        deadline: goal.deadline, // ⭐ thêm dòng này
      })
      .select()
      .single();

    if (error) {
      console.error("Insert goal lỗi:", error);
      return;
    }

    dispatch({
      type: "ADD_G",
      payload: data,
    });
  };
  /*
  ==========================
  DELETE GOAL
  ==========================
  */

  const deleteGoal = async (id) => {
    const { error } = await supabase.from("goals").delete().eq("id", id);

    if (error) {
      console.error("Delete goal lỗi:", error);
      return;
    }

    dispatch({
      type: "DEL_G",
      payload: id,
    });
  };

  /*
  ==========================
  FETCH WHEN USER CHANGE
  ==========================
  */

  useEffect(() => {
    if (user?.id) {
      fetchData(user.id);
    } else {
      dispatch({ type: "RESET" });
      lastFetchedId.current = null;
    }
  }, [user?.id, fetchData]);

  /*
  ==========================
  PROVIDER
  ==========================
  */

  return (
    <GlobalContext.Provider
      value={{
        transactions: state.transactions,
        goals: state.goals,
        lastUpdated: state.lastUpdated,

        addTransaction,
        deleteTransaction,

        addGoal,
        deleteGoal,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

/*
==========================
HOOK
==========================
*/

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error("useGlobalContext phải nằm trong GlobalProvider");
  }

  return context;
};
