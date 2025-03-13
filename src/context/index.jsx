import { db } from "../utils/dbConfig";
import { Users, Records } from "../utils/schema";
import { eq } from "drizzle-orm";
import { createContext, useCallback, useContext, useState } from "react";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  const [records, setRecords] = useState([]);

  const [currentUser, setCurrentUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      const result = await db.select().from(Users).execute(); //get all the users from user records
      setUsers(result);
    } catch (error) {
      console.error("Error in fetching user from the records", error);
    }
  }, []);

  const fetchUserByEmail = useCallback(async (email) => {
    try {
      const result = await db
        .select()
        .from(Users)
        .where(eq(Users.createdBy, email));

      if (result.length > 0) {
        setCurrentUser(result[0]);
      }
    } catch (error) {
      console.error("Error in fetching user by email", error);
    }
  }, []);

  const createUser = useCallback(async (userData) => {
    try {
      const newUser = await db
        .insert(Users)
        .values(userData)
        .returning()
        .execute();

      setUsers((prevUser) => [...prevUser, newUser[0]]);
    } catch (error) {
      console.error("Error in creating user", error);
      return null;
    }
  }, []);

  const fetchUserRecords = useCallback(async (userEmail) => {
    try {
      const result = await db
        .select()
        .from(Records)
        .where(eq(Records.createdBy, userEmail))
        .execute();

      setRecords(result);
    } catch (error) {
      console.error("Error in fetching user records", error);
    }
  }, []);

  const createRecord = useCallback(async (recordData) => {
    try {
      const newRecord = await db
        .insert(Records)
        .values(recordData)
        .returning({ id: Records.id })
        .execute();

      setRecords((prevRecords) => [...prevRecords, newRecord[0]]);
      return newRecord[0];
    } catch (error) {
      console.error("Error in creating record", error);
      return null;
    }
  }, []);

  const updateRecord = useCallback(async (recordData) => {
    try {
      const { documentId, ...dataToUpdate } = recordData;
      const updateRecords = await db
        .update(Records)
        .set(dataToUpdate)
        .where(eq(Records.id, documentId))
        .returning();

      setRecords((prevRecords) =>
        prevRecords.map((record) =>
          record.id === documentId ? updateRecords[0] : record,
        ),
      );
    } catch (error) {
      console.error("Error in creating record", error);
      return null;
    }
  }, []);

  return (
    <StateContext.Provider
      value={{
        users,
        records,
        currentUser,
        fetchUsers,
        fetchUserByEmail,
        createUser,
        fetchUserRecords,
        createRecord,
        updateRecord,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
