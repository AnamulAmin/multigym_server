import moment from "moment";
import Users from "../Users/Users.model.js";
import Invoice from "./Invoice.model.js";
import { convertDateData } from "../../helpers/generateDates.js";
import { generateMonthlyData } from "../../helpers/generateDailyAndMonthlyData.js";
import currentMonthlyDate from "../../helpers/currentMonthlyDate.js";
import { GetCumulativeBalance } from "../../helpers/GetCumulativeBalance.js";
import Transaction from "../Transaction/Transaction.model.js";
import mongoose from "mongoose";
import sendInvoiceEmail from "../../../config/email/sendInvoiceEmail.js";
import { sendPackageEmail } from "../Emails/Email.controller.js";

export async function getAllInvoices(req, res) {
  const branch = req.params.branch;
  try {
    const result = await Invoice.find().sort({ transaction_date: 1 });
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getAllInvoice(req, res) {
  const branch = req.query;
  console.log(branch, "branch");

  try {
    const result = await Invoice.find({ branch: branch }).sort({
      transaction_date: -1,
    });
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}
export async function getAllInvoiceByFilter(req, res) {
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
      { member_email: { $regex: new RegExp(search, "i") } },
      { member_name: { $regex: new RegExp(search, "i") } },
      {
        login_name: { $regex: new RegExp(search, "i") },
      },
      {
        receipt_no: { $regex: new RegExp(search, "i") },
      },
      {
        member_id: { $regex: new RegExp(search, "i") },
      },
    ];
  }
  // console.log(
  //   branch,
  //   "branch",
  //   start_date,
  //   end_date,
  //   time_frame,
  //   receiver,
  //   search,
  //   isAddFilterWithSearch
  // );

  try {
    if (time_frame === "daily") {
      dailyReports = await Invoice.find({
        ...filter,
      }).sort({
        created_at: -1,
      });
    } else if (time_frame === "monthly") {
      const invoiceMonthlyData = await Invoice.aggregate([
        {
          $match: {
            transaction_date: {
              $gte: startDate,
              $lte: endDate,
            },
            ...filter,
          },
        },

        {
          $group: {
            _id: "$transaction_date",
            totalPackageFees: {
              $sum: { $toDouble: "$packageFee" }, // Summing package fees
            },
            totalAdmissionFees: {
              $sum: { $toDouble: "$admissionFee" }, // Summing admission fees
            },
            discount: {
              $sum: { $toDouble: "$discount" }, // Summing admission fees
            },
            receiver_names: { $addToSet: "$login_name" }, // Collecting names

            totalReceiver: { $sum: 1 }, // Counting the total number of documents (invoices)
          },
        },
        {
          $project: {
            _id: "$_id",
            totalAdmissionFees: "$totalAdmissionFees",
            totalPackageFees: "$totalPackageFees",
            totalReceiver: "$totalReceiver",
            receiver_names: "$receiver_names",

            discount: "$discount",
            transaction_date: "$transaction_date",
          },
        },
      ]);

      monthlyReports = invoiceMonthlyData
        ? generateMonthlyData({
            data: invoiceMonthlyData,
            startDate,
            endDate,
          })
        : [];
    }

    const summary = await Invoice.aggregate([
      {
        $match: {
          ...filter,
        },
      },
      {
        $group: {
          _id: null, // Grouping by email
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
          totalAdmissionFees: "$totalAdmissionFees",
          totalPackageFees: "$totalPackageFees",
          totalDiscount: "$totalDiscount",
          total: {
            $subtract: [
              { $add: ["$totalAdmissionFees", "$totalPackageFees"] },
              "$totalDiscount",
            ],
          },
        },
      },
    ]);
    const method_summary = await Invoice.aggregate([
      {
        $match: {
          ...filter,
        },
      },
      {
        $group: {
          _id: "$payment_method",
          method_name: { $first: "$payment_method" },
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
          totalPackageFees: "$totalPackageFees",
          totalAdmissionFees: "$totalAdmissionFees",
          totalDiscount: "$totalDiscount",
        },
      },
    ]);

    const receivers = await Invoice.aggregate([
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
          totalDiscount: 0,
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
export async function getMonthlySalesReport(req, res) {
  const { year, month, branch } = req.query;
  console.log(
    branch,
    "branch",
    month,
    moment(new Date(year, month - 1, 1)).format("YYYY-MM-DD"),
    "year",
    moment(new Date(year, month, 1)).format("YYYY-MM-DD")
  );

  // const yearInt = parseInt(year, 10);
  // const monthInt = parseInt(monthNumber, 10);

  try {
    const salesData = await Invoice.aggregate([
      {
        $addFields: {
          day: "$transaction_date",
          amount: { $toDouble: "$amount" },
          count: 1,
        },
      },
      {
        $match: {
          transaction_date: {
            $gte: moment(new Date(year, month - 1, 1)).format("YYYY-MM-DD"),
            $lt: moment(new Date(year, month, 1)).format("YYYY-MM-DD"),
          },
          branch: branch,
        },
      },
      {
        $group: {
          _id: "$day",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    console.log(salesData, "salesData");

    const reportData = convertDateData(year, month, salesData);

    res.status(200).json(reportData);
  } catch (err) {
    console.error("Error generating report:", err);
  }
}

export async function getByIdInvoice(req, res) {
  const id = req.params.id;
  try {
    const result = await Invoice.findById(id);
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getInvoiceByFilter(req, res) {
  const id = req.params.id;
  const branch = req.query.branch;
  try {
    const query = {
      $or: [
        { _id: id },
        { login_email: id },
        { member_email: id },
        { login_name: id },
        { member_doc_id: id },
      ],
      end_date: {
        $gte: moment(new Date()).format("YYYY-MM-DD"),
      },
    };

    // Add branch filter only if it is provided and not empty
    if (branch) {
      query.branch = branch;
    }

    // Fetch and sort results by createdAt in descending order
    const result = await Invoice.find(query).sort({ createdAt: -1 });
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function createInvoice(req, res) {
  try {
    const InvoiceData = req.body;

    const memberData = await Users.findById(InvoiceData.member_doc_id);
    if (!memberData) {
      return res.status(404).send({ error: "Member not found" });
    }

    const currentTime = new Date().getTime();
    const expireTime = new Date(memberData.expiredate).getTime();
    let expireDate = "";
    if (expireTime > currentTime) {
      expireDate = moment(new Date(memberData.expiredate))
        .add(parseInt(InvoiceData?.duration), "days")
        .format("YYYY-MM-DD");
    } else {
      expireDate = moment(new Date())
        .add(parseInt(InvoiceData?.duration), "days")
        .format("YYYY-MM-DD");
    }

    console.log(expireDate, "expireDate", memberData.expiredate);
    // console.log(InvoiceData, "InvoiceData");

    const result = await Invoice.create(InvoiceData);
    const userResult = await Users.findByIdAndUpdate(
      InvoiceData.member_doc_id,
      {
        $set: {
          expiredate: expireDate,
        },
      }
    );
    const margeResult = await Invoice.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(result._id),
        },
      },
      {
        $merge: {
          into: "transactions", // Target collection
          whenMatched: "merge", // Specify how to handle matching documents (e.g., merge, keepExisting)
          whenNotMatched: "insert", // Insert new documents if not matched
        },
      },
    ]);
    const responseMessage = await sendPackageEmail({
      // recipients: result.member_email,
      data: result,
    });
    res.json({ result, margeResult, email_message: responseMessage });
  } catch (err) {
    console.log(err, "error");
    res.status(500).send({ error: err.message });
  }
}

export async function removeInvoice(req, res) {
  const id = req.params.id;

  try {
    const invoiceSingleData = await Invoice.findById(id);
    if (!invoiceSingleData) {
      return res.status(400).json({ message: "Invoice is not Found" });
    }

    const invoiceData = await Invoice.find({
      member_doc_id: invoiceSingleData.member_doc_id,
    }).sort({ transaction_date: -1 });

    let userResult;

    if (invoiceData.length > 1) {
      userResult = await Users.findByIdAndUpdate(
        invoiceSingleData.member_doc_id,
        {
          $set: {
            expiredate: invoiceData[0].end_date,
          },
        }
      );
    } else {
      const userData = await Users.findById(invoiceSingleData.member_doc_id);
      // userResult = await Users.findByIdAndUpdate(
      //   invoiceSingleData.member_doc_id,
      //   {
      //     $set: {
      //       expiredate: userData?.admission_date,
      //     },
      //   }
      // );

      userData.expiredate = userData?.admission_date;

      userResult = await userData.save();
    }

    console.log(userResult, "userResult");

    const result = await Invoice.findByIdAndDelete(id);
    const transactionResult = await Transaction.findByIdAndDelete(id);

    console.log(result, "result");
    if (result) {
      return res.status(200).json({
        data: { ...userResult, ...result },
        message: "Data deleted successfully",
      });
      // if (userResult) {
      // } else {
      //   res.status(400).json({ message: "Data not found" });
      // }
    } else {
      res.status(400).json({ message: "Data not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function updateInvoice(req, res) {
  const id = req.params.id;
  const InvoiceData = req.body;
  try {
    const result = await Invoice.findByIdAndUpdate(id, InvoiceData, {
      new: true,
    });
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}
