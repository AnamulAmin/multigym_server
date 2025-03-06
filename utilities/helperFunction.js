import crypto from "crypto";

export function getPurchaseID() {
  const date_ob = new Date();
  const date = ("0" + date_ob.getDate()).slice(-2);
  const month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  const year = date_ob.getFullYear();
  const newDate = year + month + date;
  const purchaseID = newDate + crypto.randomUUID().slice(0, 4);

  return purchaseID;
}

export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
  return otp;
};
