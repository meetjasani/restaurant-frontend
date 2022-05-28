import { GET_NOTIFICATION } from "../types";
import { ApiGet } from "../../helper/API/ApiData";
import { GET_NOTIFICATION_ERROR } from "../types";

export const getNotification = () => (dispatch) => {

  ApiGet("general/getAllNotification")
    .then((res) => {
      dispatch({
        type: GET_NOTIFICATION,
        payload: res.data,
      });
    })
    .catch((error) => {
      dispatch({
        type: GET_NOTIFICATION_ERROR,
        payload: error.message,
      });
    });

  // const date = firebase.firestore.Timestamp.fromDate(new Date(moment(new Date()).subtract(30, 'd').format('YYYY-MM-DD'))).toDate()

  // const unsubscribe = db
  //   .collection("notification")
  //   .orderBy("timestamp", "desc")
  //   .where("reciever", "==", id)
  //   .where('timestamp', '>=', date)
  //   .onSnapshot(
  //     (snapshot) => {
  //       if (snapshot.docs) {
  //         let data = snapshot.docs.map((doc: any) => ({
  //           id: doc.id,
  //           data: doc.data(),
  //         }));

  //         dispatch({
  //           type: GET_NOTIFICATION,
  //           payload: data
  //         });
  //       }
  //     },
  //     (err: any) => {
  //       console.log("Error in getNotification: ", err);
  //     }
  //   );
  // return unsubscribe;
};