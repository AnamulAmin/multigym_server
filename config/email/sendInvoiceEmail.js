import moment from "moment";
import Branch from "../../app/modules/Branch/Branch.model.js";
import { sendEmailWithResend } from "./sendEmailWithResend.js";

async function sendInvoiceEmail({ recipients, data }) {
  const profileData = await Branch.findOne({ branch: data.branch });

  console.log(profileData, "profileData", data, "data");
  const template = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Multigympremium</title>
</head>

<body style="width: 100%; height: 100%; background: #f2f2f2; margin: 0; overflow-x: hidden; font-size: 16px;">
    <div>
        <div className=" p-4 w-[58mm] mx-auto bg-white" id={"print-template"}>
            <div className="text-center mb-2">
                <h2 className="font-bold text-xs">${profileData?.name}</h2>
                <p className="text-xs">${profileData?.address}</p>
                <p className="text-xs">${profileData?.mobile}</p>
                <p className="text-xs">${profileData?.email}</p>
                <hr className="my-2" />
            </div>

            <div className="text-center mb-2">
                <p className="text-xs">
                    Receipt No: <strong>${data?.receipt_no}</strong>
                </p>
                <p className="text-xs">
                    Date: <strong>${data?.transaction_date}</strong>
                </p>
                <p className="text-xs">
                    Member:{" "}
                    <strong>
                        ${data?.member_name} - {data?.member_id}
                    </strong>
                </p>
            </div>

            <table className="w-full mb-2">
                <thead>
                    <tr className="text-xs">
                        <th className="border-b text-left">#</th>
                        <th className="border-b text-left">Particulars</th>
                        <th className="border-b text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="text-xs">
                        <td className="border-b text-left">1</td>
                        <td className="border-b text-left">Admission Fee</td>
                        <td className="border-b text-right">${
                          data?.admissionFee
                        }</td>
                    </tr>
                    <tr className="text-xs">
                        <td className="border-b text-left">2</td>
                        <td className="border-b text-left">Package Fee</td>
                        <td className="border-b text-right">${
                          data?.packageFee
                        }</td>
                    </tr>
                </tbody>
            </table>

            <div className="text-right mb-2 text-xs">
                <p>
                    Subtotal: <strong>${data?.amount}</strong>
                </p>
                <p>
                    Discount: <strong>${data?.discount}</strong>
                </p>
                <p>
                    Received:{" "}
                    <strong>${
                      parseInt(data?.amount) - parseInt(data?.discount)
                    }</strong>
                </p>
                <p>
                    Paid: <strong>PAID</strong>
                </p>
            </div>

            <hr className="my-2" />

            <div className="text-center mb-2 text-xs">
                <p>${data?.package_name}</p>
                <p>
                    ${data?.start_date} to ${data?.end_date}
                </p>
            </div>

            <table className="w-full mb-2">
                <tbody>
                    <tr className="text-xs">
                        <td className="text-left">Admission Fee</td>
                        <td className="text-right">${data?.admissionFee}</td>
                    </tr>
                    <tr className="text-xs">
                        <td className="text-left">Package Fee</td>
                        <td className="text-right">${data?.packageFee}</td>
                    </tr>
                    <tr className="text-xs">
                        <td className="text-left">Installment</td>
                        <td className="text-right">0</td>
                    </tr>
                    <tr className="text-xs font-bold">
                        <td className="text-left">Total Cost</td>
                        <td className="text-right">
                            ${
                              parseInt(data?.packageFee) +
                              parseInt(data?.admissionFee)
                            }
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className="text-center text-xs text-gray-700">
                <p>User: ${data?.member_name}</p>
                <p>Email: ${data?.member_email}</p>
                <p>
                    Creation Time: ${moment(data?.created_at).format(
                      "DD-MM-YYYY-HH:mm"
                    )}
                </p>
                <p>Received with thanks</p>
            </div>
        </div>

        
    </div>
</body>

</html>`;

  await sendEmailWithResend(
    recipients,
    `${profileData?.name} - Invoice`,
    template
  );
}

export default sendInvoiceEmail;
