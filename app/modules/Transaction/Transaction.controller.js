import moment from "moment";
import Transaction from "./Transaction.model.js";
import {
  generateMonthlyData,
  generateMonthlyTransactionData,
} from "../../helpers/generateDailyAndMonthlyData.js";
import currentMonthlyDate from "../../helpers/currentMonthlyDate.js";
import { GetCumulativeBalance } from "../../helpers/GetCumulativeBalance.js";
import Invoice from "../Invoice/Invoice.model.js";

export async function createTransaction(req, res) {
  try {
    const transactionData = req.body;

    const result = await Transaction.create(transactionData);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getAllTransactions(req, res) {
  const branch = req.query;
  console.log(branch, "branch");

  try {
    const result = await Transaction.find().sort({
      transaction: -1,
    });
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// export async function getAllTransaction(req, res) {
//   const { branch, start_date, end_date, transaction_type } = req.query;
//   console.log(branch, "branch", start_date, end_date, transaction_type);

//   const startDate = start_date
//     ? moment(start_date).format("YYYY-MM-DD")
//     : moment().format("YYYY-MM-DD");
//   const endDate = end_date
//     ? moment(end_date).format("YYYY-MM-DD")
//     : moment(startDate).format("YYYY-MM-DD");

//   try {
//     const result = await Transaction.find({
//       branch: branch,
//       transaction_date: { $gte: startDate, $lte: endDate },
//     }).sort({
//       created_at: -1,
//     });
//     const summary = await Transaction.aggregate([
//       {
//         $match: {
//           transaction_date: {
//             $gte: startDate,
//             $lte: endDate,
//           },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalIncome: {
//             $sum: {
//               $cond: [
//                 { $eq: ["$transaction_type", "income_service"] },
//                 { $toDouble: "$amount" }, // Convert amount to double (float)
//                 0,
//               ],
//             },
//           },
//           totalExpense: {
//             $sum: {
//               $cond: [
//                 { $ne: ["$transaction_type", "income_service"] },
//                 { $toDouble: "$amount" }, // Convert amount to double (float)
//                 0,
//               ],
//             },
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           cumulativeBalance: { $subtract: ["$totalIncome", "$totalExpense"] },
//           income: "$totalIncome",
//           expense: "$totalExpense",
//         },
//       },
//     ]);

//     res.json({ data: result, summary });
//   } catch (err) {
//     res.status(500).send({ error: err.message });
//   }
// }

export async function getAllTransaction(req, res) {
  const {
    branch,
    start_date,
    end_date,
    time_frame,
    receiver,
    search,
    isAddFilterWithSearch,
  } = req.query;

  const startDate = start_date
    ? moment(start_date).format("YYYY-MM-DD")
    : moment().format("YYYY-MM-DD");
  const endDate = end_date
    ? moment(end_date).format("YYYY-MM-DD")
    : moment(startDate).format("YYYY-MM-DD");

  const currentStartEndDate = currentMonthlyDate();

  console.log(
    currentStartEndDate.startDate,
    currentStartEndDate.endDate,
    "startDate, endDate"
  );

  let dailyReports;
  let monthlyReports;

  let filter = { branch: branch };

  if (
    (startDate && endDate && !search) ||
    (startDate && endDate && isAddFilterWithSearch === "true")
  ) {
    filter = {
      ...filter,
      transaction_date: { $gte: startDate, $lte: endDate },
    };
  }

  if ((receiver && !search) || (receiver && isAddFilterWithSearch === "true")) {
    filter = { ...filter, login_email: receiver };
  }
  if (search) {
    filter.$or = [
      { login_email: { $regex: new RegExp(search, "i") } },
      {
        login_name: { $regex: new RegExp(search, "i") },
      },
      {
        receipt_no: { $regex: new RegExp(search, "i") },
      },
    ];
  }

  try {
    if (time_frame === "daily") {
      console.log(filter, "dailyReports");
      dailyReports = await Transaction.find({
        ...filter,
      }).sort({
        created_at: -1,
      });
    } else if (time_frame === "monthly") {
      console.log(filter, "monthlyReports");
      const invoiceMonthlyData = await Transaction.aggregate([
        {
          $match: {
            ...filter,
          },
        },

        {
          $group: {
            _id: "$transaction_date",
            totalIncome: {
              $sum: {
                $cond: [
                  { $eq: ["$transaction_type", "income"] },
                  { $toDouble: "$amount" }, // Convert amount to double (float)
                  0,
                ],
              },
            },
            totalExpense: {
              $sum: {
                $cond: [
                  { $eq: ["$transaction_type", "expense"] },
                  { $toDouble: "$amount" }, // Convert amount to double (float)
                  0,
                ],
              },
            },
            totalPackageFees: {
              $sum: { $toDouble: "$packageFee" }, // Summing package fees
            },
            totalAdmissionFees: {
              $sum: { $toDouble: "$admissionFee" }, // Summing admission fees
            },
            discount: {
              $sum: { $toDouble: "$discount" }, // Summing admission fees
            },
          },
        },
        {
          $project: {
            _id: "$_id",
            totalExpense: "$totalExpense",
            totalIncome: "$totalIncome",
            totalAdmissionFees: "$totalAdmissionFees",
            totalPackageFees: "$totalPackageFees",

            discount: "$discount",
          },
        },
      ]);

      console.log(invoiceMonthlyData, "invoiceMonthlyData");

      monthlyReports = invoiceMonthlyData
        ? generateMonthlyTransactionData({
            data: invoiceMonthlyData,
            startDate,
            endDate,
          })
        : [];
    }

    const summary = await Transaction.aggregate([
      {
        $match: {
          ...filter,
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [
                { $eq: ["$transaction_type", "income"] },
                { $toDouble: "$amount" }, // Convert amount to double (float)
                0,
              ],
            },
          },
          totalExpense: {
            $sum: {
              $cond: [
                { $eq: ["$transaction_type", "expense"] },
                { $toDouble: "$amount" }, // Convert amount to double (float)
                0,
              ],
            },
          },
          totalPackageFees: {
            $sum: { $toDouble: "$packageFee" }, // Summing package fees
          },
          totalAdmissionFees: {
            $sum: { $toDouble: "$admissionFee" }, // Summing admission fees
          },
          totalDiscount: {
            $sum: { $toDouble: "$discount" }, // Summing admission fees
          },
        },
      },
      {
        $project: {
          _id: 0,
          total: {
            $subtract: [
              {
                $add: [
                  "$totalIncome",
                  "$totalPackageFees",
                  "$totalAdmissionFees",
                ],
              },
              { $add: ["$totalExpense", "$totalDiscount"] },
            ],
          },
          income: {
            $add: ["$totalIncome", "$totalPackageFees", "$totalAdmissionFees"],
          },
          totalPackageFees: "$totalPackageFees",
          totalAdmissionFees: "$totalAdmissionFees",
          expense: "$totalExpense",
          totalDiscount: "$totalDiscount",
        },
      },
    ]);
    const method_summary = await Transaction.aggregate([
      {
        $match: {
          ...filter,
        },
      },
      {
        $group: {
          _id: "$payment_method",
          method_name: { $first: "$payment_method" },
          totalIncome: {
            $sum: {
              $cond: [
                { $eq: ["$transaction_type", "income"] },
                { $toDouble: "$amount" }, // Convert amount to double (float)
                0,
              ],
            },
          },
          totalExpense: {
            $sum: {
              $cond: [
                { $eq: ["$transaction_type", "expense"] },
                { $toDouble: "$amount" }, // Convert amount to double (float)
                0,
              ],
            },
          },
          totalPackageFees: {
            $sum: { $toDouble: "$packageFee" }, // Summing package fees
          },
          totalAdmissionFees: {
            $sum: { $toDouble: "$admissionFee" }, // Summing admission fees
          },
          totalDiscount: {
            $sum: { $toDouble: "$discount" }, // Summing admission fees
          },
        },
      },
      {
        $project: {
          _id: 0,
          // expense: "$totalExpense",
          method_name: "$method_name",
          totalExpense: { $add: ["$totalExpense", "$totalDiscount"] },
          totalIncome: {
            $add: ["$totalIncome", "$totalPackageFees", "$totalAdmissionFees"],
          },
        },
      },
    ]);

    const receivers = await Transaction.aggregate([
      {
        $match: {
          transaction_date: {
            $gte: startDate,
            $lte: endDate,
          },
          branch: branch,
        },
      },
      {
        $group: {
          _id: null,
          receivers: {
            $addToSet: { name: "$login_name", email: "$login_email" },
          },
          totalReceiver: { $sum: 1 },
        },
      },
      {
        $unwind: "$receivers",
      },
      {
        $sort: {
          "receivers.name": 1,
        },
      },
      {
        $group: {
          _id: null,
          receivers: { $addToSet: "$receivers" },
          totalReceiver: { $first: "$totalReceiver" },
        },
      },
      {
        $project: {
          _id: 0,
          receivers: 1,
          totalReceiver: 1,
        },
      },
    ]);

    const zeroSummary = [
      [
        {
          totalAdmissionFees: 0,
          totalPackageFees: 0,
        },
      ],
    ];

    const cumulativeBalance = await Transaction.aggregate([
      {
        $match: {
          transaction_date: {
            $gte: currentStartEndDate.startDate,
            $lte: currentStartEndDate.endDate,
          },
          branch: branch,
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [
                { $eq: ["$transaction_type", "income"] },
                { $toDouble: "$amount" }, // Convert amount to double (float)
                0,
              ],
            },
          },
          totalExpense: {
            $sum: {
              $cond: [
                { $eq: ["$transaction_type", "expense"] },
                { $toDouble: "$amount" }, // Convert amount to double (float)
                0,
              ],
            },
          },
          totalPackageFees: {
            $sum: { $toDouble: "$packageFee" }, // Summing package fees
          },
          totalAdmissionFees: {
            $sum: { $toDouble: "$admissionFee" }, // Summing admission fees
          },
          totalDiscount: {
            $sum: { $toDouble: "$discount" }, // Summing admission fees
          },
        },
      },
      {
        $project: {
          _id: 0,
          total: {
            $subtract: [
              {
                $add: [
                  "$totalIncome",
                  "$totalPackageFees",
                  "$totalAdmissionFees",
                ],
              },
              { $add: ["$totalExpense", "$totalDiscount"] },
            ],
          },
          income: {
            $add: ["$totalIncome", "$totalPackageFees", "$totalAdmissionFees"],
          },
          expense: { $add: ["$totalExpense", "$totalDiscount"] },
        },
      },
    ]);

    // const cumulativeBalance =
    //   transactionMonthlyIncome[0]?.total + invoiceMonthlyBalance[0]?.total;
    console.log("cumulativeBalance", cumulativeBalance);

    res.status(200).json({
      data: time_frame === "daily" ? dailyReports : monthlyReports,
      summary: summary.length > 0 ? summary : zeroSummary,
      receivers,
      method_summary,
      cumulativeBalance: { cumulativeBalance: cumulativeBalance[0]?.total },
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function removeTransaction(req, res, next) {
  const id = req.params.id;
  try {
    const TransactionSingleData = await Transaction.findById(id);
    const InvoiceSingleData = await Invoice.findById(id);
    // if (!TransactionSingleData) {
    //   if (!InvoiceSingleData) {
    //     return { message: "Data is not Found" };
    //   }
    // }

    const result = await Transaction.findByIdAndDelete(id);

    if (InvoiceSingleData) {
      return next();
    }

    if (result) {
      res.status(200).json({
        data: result,
        message: "Data deleted successfully",
      });
    } else {
      res.status(400).json({ message: "Data not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getAllExpense(req, res) {
  const { branch, year, month } = req.query;

  let dailyReports;

  let filter = {
    branch: branch,
    transaction_type: "expense",
    transaction_date: {
      $gte: moment(new Date(year, month - 1, 1)).format("YYYY-MM-DD"),
      $lt: moment(new Date(year, month, 1)).format("YYYY-MM-DD"),
    },
  };

  try {
    console.log(filter, "dailyReports");
    const monthlyReports = await Transaction.aggregate([
      {
        $match: {
          ...filter,
        },
      },

      {
        $group: {
          _id: "$transaction_name",
          total: {
            $sum: {
              $toDouble: "$amount",
            },
          },
        },
      },
      {
        $project: {
          _id: "$_id",
          transaction_name: "$transaction_name",
          total: "$total",
          totalIncome: "$totalIncome",
          totalAdmissionFees: "$totalAdmissionFees",
          totalPackageFees: "$totalPackageFees",

          discount: "$discount",
        },
      },
    ]);
    res.status(200).json({
      data: monthlyReports,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}
