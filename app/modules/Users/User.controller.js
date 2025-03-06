import moment from "moment";
import FollowUp from "../Flowup/followup.model.js"; 
import Users from "./Users.model.js";
import { query } from "express";
import mongoose from "mongoose";
import Invoice from "../Invoice/Invoice.model.js";
import DoorAccess from "./UserModels/AcessDoorModel.js";
import { generateOTP } from "../../../utilities/helperFunction.js";
import bcrypt from "bcryptjs";
import admin from "firebase-admin";
export async function getAllUsers(req, res) {
  const branch = req.params.branch;
  try {
    const result = await Users.find();

    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // Format YYYY-MM-DD
};

export async function automatedreminders(req, res) {
  try {
    const today = moment().startOf('day');
    const expirationDate60Days = today.clone().subtract(59, 'days').toDate();
    const subscriptionRenewalDate = today.clone().subtract(1, 'days').toDate();
    const birthdayToday = today.format('MM-DD'); // Assuming MM-DD format in date_of_birth

    // Fetch users for each condition
    const expirationReminderUsers = await Users.find({ expiredate: expirationDate60Days }).select('email contact_no full_name');
    const birthdayUsers = await Users.find({ date_of_birth: { $regex: `-${birthdayToday}$` } }).select('email contact_no full_name');
    const subscriptionRenewalUsers = await Users.find({ expiredate: subscriptionRenewalDate }).select('email contact_no full_name');

    // Format each array of results with only required fields
    const expirationReminders = expirationReminderUsers.map(user => ({
      email: user.email,
      phone: user.contact_no,
      name: user.full_name,
    }));

    const birthdays = birthdayUsers.map(user => ({
      email: user.email,
      phone: user.contact_no,
      name: user.full_name,
    }));

    const subscriptionRenewals = subscriptionRenewalUsers.map(user => ({
      email: user.email,
      phone: user.contact_no,
      name: user.full_name,
    }));

    // Send each array individually in the response
    res.status(200).json({
      expirationReminders,
      birthdays,
      subscriptionRenewals,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}


export async function getAllUser(req, res) {
  const branch = req.query?.branch;
  try {
    const result = await Users.find({ branch: branch });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getUsersForTax(req, res) {
  const { branch } = req.query;

  const query = {
    role: "member",
    member_id: { $exists: true, $ne: "" }, // Ensures member_id exists and is not an empty string
  };

  if (branch) {
    query.branch = branch;
  }

  try {
    const users = await Users.find(query)
      .select("full_name contact_no member_id gender expiredate admission_date tax")
      .sort({ member_id: 1 }); // Sort by member_id in ascending order

    // Map users to add "yes" or "no" for the tax field
    const formattedUsers = users.map((user) => ({
      ...user.toObject(),
      tax: user.tax ? "yes" : "no",
    }));

    res.status(200).json({
      data: formattedUsers,
      totalItems: formattedUsers.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export async function updateTaxForUsers(req, res) {
  const updates = req.body;

  if (!Array.isArray(updates) || updates.length === 0) {
    return res.status(400).json({ message: "Invalid request data. Provide an array of _id and tax status pairs." });
  }

  try {
    const bulkOps = updates.map(({ _id, tax }) => ({
      updateOne: {
        filter: { _id },
        update: { tax: tax === "yes" },
      },
    }));

    const result = await Users.bulkWrite(bulkOps);
    res.status(200).json({
      message: "Tax field updated successfully for specified users.",
      result,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getAllUserBySearch(req, res) {
  const { branch, search } = req.query;

  const query = {
    role: "member",
  };

  if (branch) {
    query.branch = branch;
  }
  try {
    if (search) {
      query.$or = [
        { full_name: { $regex: new RegExp(search, "i") } },
        { email: { $regex: new RegExp(search, "i") } },
        { contact_no: { $regex: new RegExp(search, "i") } },
        { nickname: { $regex: new RegExp(search, "i") } },
        { card_no: { $regex: new RegExp(search, "i") } },
        { nid_number: { $regex: new RegExp(search, "i") } },
      ];

      const result = await Users.find(query).select({
        full_name: 1,
        email: 1,
        photourl: 1,
        role: 1,
      });
      res.status(200).json(result);
      return;
    }

    const result = await Users.find(query)
      .select({
        full_name: 1,
        email: 1,
        photourl: 1,
        role: 1,
      })
      .sort({ created_at: -1 })
      .limit(6);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function signedUpUser(req, res) {
  // console.log("api hitted")
  // console.log("req.body", req.body); 
  const branch = req?.query?.branch
  try {
    const existingUser = await Users.findOne({ email: req.body.email , branch });
    if (existingUser) {
      return res.status(201).json({ message: "User with this email already exists." });
    }
    const existingMobile = await Users.findOne({ contact_no: req.body.contact_no , branch});
    if (existingMobile) {
      return res.status(201).json({ message: "User with this mobile already exists." });
    }
    const UsersData = {
      ...req.body,
      role: 'member',
      card_no: "",
      member_id: "",
    };
    const newUser = await Users.create(UsersData);
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error creating user:", err.message);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
}


export async function getInactiveUsersBySearch(req, res) {
  const { branch, search, currentPage, limit } = req.query;

  const page = parseInt(currentPage) || 1;
  const limitation = parseInt(limit) || 10;

  // Build the base query for inactive users (users with null/empty card_no or member_id)
  let query = {
    $or: [
      { card_no: { $in: [null, "", undefined] } },
      { member_id: { $in: [null, "", undefined] } },
    ],
  };

  // Add branch filter if provided
  if (branch) {
    query.branch = branch;
  }

  // If a search term is provided, modify the query to search based on full_name, email, or contact_no
  if (search) {
    query = {
      $and: [
        query, // Include the original card_no/member_id check
        {
          $or: [
            { full_name: { $regex: new RegExp(search, "i") } },
            { email: { $regex: new RegExp(search, "i") } },
            { contact_no: { $regex: new RegExp(search, "i") } },
          ],
        },
      ],
    };
  }

  try {
    // Count total matching users for pagination
    const totalItems = await Users.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limitation);

    // Fetch the users with pagination
    const result = await Users.find(query)
      .select({
        full_name: 1,
        email: 1,
        contact_no: 1,
        card_no: 1,
        member_id: 1,
        branch: 1,
        photourl: 1,
        role: 1,
      })
      .sort({ created_at: -1 }) // Sort by creation date
      .skip((page - 1) * limitation) // Skip the previous pages
      .limit(limitation); // Limit to the specified number of items per page

    // Return the results along with pagination info
    res.status(200).json({
      totalItems,
      totalPages,
      data: result,
      currentPage: page,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getAllBySearch(req, res) {
  const { branch, search } = req.query;

  let query = {}; // Initialize query

  if (branch) {
    query.branch = branch;
  }

  try {
    if (search) {
      query.$or = [
        { full_name: { $regex: new RegExp(search, "i") } },
        { email: { $regex: new RegExp(search, "i") } },
        { contact_no: { $regex: new RegExp(search, "i") } },
        { member_id: { $regex: new RegExp(search, "i") } }, // Added member_id condition here
      ];
    }

    const result = await Users.find(query)
      .select({
        full_name: 1,
        email: 1,
        photourl: 1,
        role: 1,
      })
      .sort({ created_at: -1 })
      .limit(6);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}
export async function getAllStaffs(req, res) {
  const { branch, search } = req.query;

  const query = {
    role: { $ne: "member" },
  };

  if (branch) {
    query.branch = branch;
  }

  if (search) {
    query.$or = [
      { full_name: { $regex: new RegExp(search, "i") } },
      { email: { $regex: new RegExp(search, "i") } },
    ];
  }

  try {
    const result = await Users.find(query);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getAllUserByFilter(req, res) {
  const { branch, currentPage, limit } = req.query;
  const bodyData = req.body;

  const page = parseInt(currentPage) || 1;
  const limitation = parseInt(limit) || 15;

  let filter = { role: "member" };

  if (branch) {
    filter.branch = branch;
  }

  if (bodyData?.expiredate) {
    const { expiredate } = bodyData;
    const currentDate = moment().format("YYYY-MM-DD");

    switch (parseInt(expiredate)) {
      case 0:
        break;
      case 1:
        filter.expiredate = { $gte: currentDate };
        break;
      case 2:
        filter.expiredate = { $lt: currentDate };
        break;
      case 3:
        filter.expiredate = { $eq: currentDate };
        break;
      case 4:
        filter.expiredate = {
          $gte: currentDate,
          $lte: moment(currentDate).add(3, "days").format("YYYY-MM-DD"),
        };
        break;
      case 5:
        filter.expiredate = {
          $gte: currentDate,
          $lte: moment(currentDate).add(7, "days").format("YYYY-MM-DD"),
        };
        break;
      case 6:
        filter.expiredate = {
          $gte: currentDate,
          $lte: moment(currentDate).add(15, "days").format("YYYY-MM-DD"),
        };
        break;
      case 7:
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const lastDay = new Date(currentYear, currentMonth + 3, 0).getDate();

        filter.expiredate = {
          $gte: currentDate,
          $lte: moment(currentDate).add(lastDay, "days").format("YYYY-MM-DD"),
        };
        break;
      default:
        break;
    }

    delete bodyData?.expiredate;
  }

  let query = { ...filter, ...bodyData };

  if (bodyData?.nameCardPhone) {
    const { nameCardPhone } = bodyData;
    query.$or = [
      { full_name: { $regex: new RegExp(nameCardPhone, "i") } },
      // { card_no: { $regex: new RegExp(nameCardPhone, "i") } },
      { contact_no: { $regex: new RegExp(nameCardPhone, "i") } },
      { email: { $regex: new RegExp(nameCardPhone, "i") } },
    ];

    delete query?.nameCardPhone;
  }

  try {
    let totalItems;

    if (Object.keys(query).length > 2) {
      const userDoc = await Users.find(query);
      totalItems = userDoc.length;
    } else {
      totalItems = await Users.find({
        role: "member",
        branch: branch,
      }).countDocuments();
    }

    // console.log("query", { ...filter, ...bodyData });
    // Calculate total items and total pages
    // const totalItems = await Users;
    const totalPages = Math.ceil(totalItems / limitation);

    console.log(
      "query",
      { ...query },
      Object.keys(query).length,
      Object.keys(query).length > 2,
      totalItems
    );

    const result = await Users.find(query)
      // .sort({ created_at: -1 })
      .skip((page - 1) * limitation)
      .limit(limitation);

    res.status(200).json({
      totalItems,
      totalPages,
      data: result,
      currentPage: page,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getByIdUser(req, res) {
  const id = req.params.id;
  try {
    const result = await Users.findById(id);
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getByEmailUser(req, res) {
  const email = req.params?.email;
  try {
    const result = await Users.findOne({ email });

    if (result) {
      res.status(200).json({
        isExistUser: true,
        ...result?._doc,
      });
    } else {
      res.status(201).json({ message: "Data not found", isExistUser: false });
    }
  } catch (err) {
    res.status(500).send({ error: err.message, isExistUser: false });
  }
}

export async function createJsonUser(req, res) {
  try {
    const usersData = req.body;
    console.log(usersData);
    const newUser = await Users.create(usersData);

    res.json(newUser);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}

// export async function createUser(req, res) {
//   console.log("req.body", req.body);
//   try {
//     const existingUser = await Users.findOne({
//       $or: [{ email: req.body.email }],
//     });
    
//     const existingMobile = await Users.findOne()
//     console.log("existingUser", existingUser);

//     if (existingUser) {
//       let errorMessage = "User with ";
//       if (existingUser.email === req.body.email) {
//         errorMessage += "this email already exists.";
//       }
//       return res.status(201).json({ message: errorMessage });
//     }

//     const UsersData = req.body;
//     const newUser = await Users.create(UsersData);

//     res.json(newUser);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Internal server error", error: err.message });
//   }
// }

export async function registrationUser(req, res) {
  console.log("req.body", req.body);

  try {
    const { email, contact_no, branch, expiredate, member_id,admission_date } = req.body;

    if (!branch) {
      return res.status(400).json({ message: "Branch cannot be empty." });
    }

    if (member_id) {
      const existingMemberId = await Users.findOne({ member_id });
      if (existingMemberId) {
        return res.status(401).json({ message: "Member ID already exists." });
      }
    }

    const existingEmail = await Users.findOne({ email, branch });
    const existingMobile = await Users.findOne({ contact_no, branch });

    if (existingEmail && existingMobile) {
      return res.status(402).json({ message: "Both email and mobile number already exist for this branch." });
    }

    if (existingEmail) {
      return res.status(403).json({ message: "This email already exists for this branch." });
    }

    if (existingMobile) {
      return res.status(404).json({ message: "This mobile number already exists for this branch." });
    }

    const UsersData = {
      ...req.body,
      role: "member",
      card_no: req.body.card_no || "",
      member_id: member_id || "", 
      expiredate: expiredate || new Date().toISOString().split('T')[0], 
      admission_date:admission_date || new Date().toISOString().split('T')[0], 
    };

    const newUser = await Users.create(UsersData);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
}


export async function createUser(req, res) {
  console.log("req.body", req.body);

  try {
    const { email, contact_no, branch, expiredate, member_id } = req.body;

    // Ensure branch is not empty
    if (!branch) {
      return res.status(400).json({ message: "Branch cannot be empty." });
    }

    // Check if member_id is unique across all branches
    if (member_id) {
      const existingMemberId = await Users.findOne({ member_id });
      if (existingMemberId) {
        return res.status(401).json({ message: "Member ID already exists." });
      }
    }

    // Check if a user with the same email and branch exists
    const existingEmail = await Users.findOne({ email, branch });
    const existingMobile = await Users.findOne({ contact_no, branch });

    // Handle conflicts based on existing data
    if (existingEmail && existingMobile) {
      return res.status(409).json({ message: "Both email and mobile number already exist for this branch." });
    }

    if (existingEmail) {
      return res.status(409).json({ message: "This email already exists for this branch." });
    }

    if (existingMobile) {
      return res.status(409).json({ message: "This mobile number already exists for this branch." });
    }

    const UsersData = {
      ...req.body,
      role: "member",
      card_no: req.body.card_no || "",
      member_id: member_id || "", // Only set if provided in request
      expiredate: expiredate || new Date().toISOString().split('T')[0], // Set expiredate to today's date if not provided
    };

    const newUser = await Users.create(UsersData);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
}


export async function createStaff(req, res) {
  try {
    const { email, contact_no, card_no, member_id, role } = req.body;

    // Validate required fields
    if (!card_no || !member_id || !role) {
      return res.status(411).json({ 
        message: "Missing required fields: card_no, member_id, or role."
      });
    }

    // Check if the role is set to "admin"
    if (role.toLowerCase() === "admin") {
      return res.status(500).json({ 
        message: "Internal server error: Role cannot be set to 'admin'."
      });
    }

    // Check if email or mobile number already exists
    const existingEmail = await Users.findOne({ email });
    const existingMobile = await Users.findOne({ contact_no });

    if (existingEmail && existingMobile) {
      return res.status(409).json({ message: "Both email and mobile number already exist." });
    }

    if (existingEmail) {
      return res.status(409).json({ message: "This email already exists." });
    }

    if (existingMobile) {
      return res.status(409).json({ message: "This mobile number already exists." });
    }

    const UsersData = {
      ...req.body,
      role,          
      card_no,          
      member_id 
    };

    const newUser = await Users.create(UsersData);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
}


// export async function checkMobileNumberAndEmail(req, res) {
//   try {
//     const { contact_no , email } = req.body;
//     const existingPhone = await Users.findOne({contact_no });
//     const existingEmail = await Users.findOne({email });

//     if (existingEmail) {
//       return res.status(406).json({ message: "Email adress already in use" });
//     }
//     if (existingPhone) {
//       return res.status(409).json({ message: "Mobile number already in use" });
//     }

//     return res.status(200).json({ message: "Mobile number and email adress is available" });
//   } catch (err) {
//     return res.status(500).json({ message: "Internal server error", error: err.message });
//   }
// }
export async function checkMobileNumberAndEmail(req, res) {
  try {
    const { contact_no , email } = req.body;
    const existingMobile = await Users.findOne({contact_no });
    const existingEmail = await Users.findOne({email });
    
    if (existingEmail && existingMobile) {
      return res.status(409).json({ message: "Both email and mobile number already exist." });
    }

    if (existingEmail) {
      return res.status(409).json({ message: "This email already exists." });
    }

    if (existingMobile) {
      return res.status(409).json({ message: "This mobile number already exists." });
    }
    return res.status(200).json({ message: "Mobile number and email adress is available" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}


const deleteUserFirebase = async (email) =>{
  try{
    const userRecord = await admin.auth().getUserByEmail(email);
    const uid = userRecord.uid ;

    await admin.auth().deleteUser(uid);
    console.log(`Successfully deleted user with email: ${email}`);

    return {success : true , message :"User deleted from firebase"}
  } catch (error){
    console.error("Error deleting user:", error);

    return {success : false , message : "Error deleting user form firebase"}
  }

}

export async function removeUser(req, res) {
  const id = req.params.id;
  try {
    const foundUser = await Users.findById(id);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const firebaseDeletion = await deleteUserFirebase(foundUser.email);

    const result = await Users.findByIdAndDelete(id);


    if (result && firebaseDeletion.success) {
      return res.status(200).json({
        message: "User and Login data deleted successfully.",
      });
    } else if (result) {
      return res.status(201).json({
        message: "User deleted, but Login data not deleted",
        firebaseError: firebaseDeletion.message,
      });
    } else {
      return res.status(404).json({ message: "User data not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}





export async function updateUser(req, res) {
  const id = req.params.id;
  const UsersData = req.body;

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: "Invalid ID format" });
  }

  try {

    const user = await Users.findById(id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const oldEmail = user.email;
    console.log("Old email:", oldEmail);

    const needsUpdate = (
      UsersData.email && UsersData.email !== oldEmail ||
      UsersData.full_name && UsersData.full_name !== user.full_name ||
      UsersData.contact_no && UsersData.contact_no !== user.contact_no ||
      UsersData.photoURL && UsersData.photoURL !== user.photoURL
    );

    if (needsUpdate) {
      try {
        const firebaseUser = await admin.auth().getUserByEmail(oldEmail);
        
        if (firebaseUser) {
          const uid = firebaseUser.uid;


          await admin.auth().updateUser(uid, {
            email: UsersData.email || oldEmail,
            displayName: UsersData.full_name || firebaseUser.displayName,
            photoURL: UsersData.photoURL || firebaseUser.photoURL,
          });
        }
      } catch (firebaseError) {

        console.error("Firebase update error or UID not found:", firebaseError);
      }
    }


    const result = await Users.findByIdAndUpdate(id, UsersData, { new: true });
    res.json(result);

  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function updateUsercode(req, res) {
  const { id } = req.params;
  const updateData = req.body;

  // Validate ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: "Invalid ID format" });
  }

  try {
    // Check for existing card_no in the same branch
    if (updateData.card_no) {
      const existingMember = await Users.findOne({
        _id: { $ne: id }, // Exclude the current user
        card_no: updateData.card_no,
        branch: updateData.branch
      });
      if (existingMember) {
        return res.status(401).send({ error: "Card_no already exists in this branch" });
      }
    }

    // Check for existing member_id
    if (updateData.member_id) {
      const existingMember = await Users.findOne({
        _id: { $ne: id }, // Exclude the current user
        member_id: updateData.member_id
      });
      if (existingMember) {
        return res.status(402).send({ error: "Member ID already exists" });
      }
    }

    // Update the user data if no conflicts are found
    const updatedUser = await Users.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).send({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

export const getUsersByStatusAndRole = async (req, res) => {
  try {
    const { status, role } = req.params;
    const branch = req.query?.branch;

    const today = moment().startOf("day");
    let filter = {};

    if (role !== "All") {
      filter.role =  role === "member" ? "member" : { $ne: "member" };
    }
    if(branch){
      filter.branch = branch;
    }

    let users = await Users.find(filter);

    if (status !== "All") {
      users = users.map((user) => {
        const expireDate = moment(user.expiredate);
        user.isActive = expireDate.isSameOrAfter(today);
        return user;
      });

      if (status === "active") {
        users = users.filter((user) => user.isActive);
      } else if (status === "inactive") {
        users = users.filter((user) => !user.isActive);
      } else {
        return res.status(400).json({ message: "Invalid status parameter" });
      }
    } else {
      users = users.map((user) => {
        const expireDate = moment(user.expiredate);
        user.isActive = expireDate.isSameOrAfter(today);
        return user;
      });
    }

    res.status(200).json(users);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

export async function loginUser(req, res) {
  const UsersData = req.body;

  // Validate the id format
  // if (
  //   UsersData.login_method !== "google" ||
  //   UsersData.login_method !== "facebook"
  // ) {
  //   return res.status(400).send({ error: "Invalid Login Method" });
  // }

  try {
    const result = await Users.findOne({ email: UsersData.email });
    if (!result) {
      return res.status(401).send({ error: "User not found" });
    }

    res.status(200).json({ ...result?._doc, isExistUser: true });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}



export async function getStats(req, res) {
  const { branch } = req.params; // Get the branch parameter from the request URL

  try {
    const salesData = await Users.aggregate([
      {
        $facet: {
          totalMembers: [
            {
              $match: {
                role: "member",
                branch: branch, // Filter by branch
              },
            },
            {
              $group: {
                _id: null,
                totalCount: { $sum: 1 },
                maleCount: { $sum: { $cond: [{ $eq: ["$gender", "Male"] }, 1, 0] } },
                femaleCount: { $sum: { $cond: [{ $eq: ["$gender", "Female"] }, 1, 0] } },
              },
            },
          ],
          activeMembers: [
            {
              $match: {
                expiredate: {
                  $gte: moment(new Date()).format("YYYY-MM-DD"),
                },
                role: "member",
                branch: branch, // Filter by branch
              },
            },
            {
              $group: {
                _id: null,
                activeUsersCount: { $sum: 1 },
                maleCount: { $sum: { $cond: [{ $eq: ["$gender", "Male"] }, 1, 0] } },
                femaleCount: { $sum: { $cond: [{ $eq: ["$gender", "Female"] }, 1, 0] } },
              },
            },
          ],
          totalStaffs: [
            {
              $match: {
                role: { $ne: "member" },
                branch: branch, // Filter by branch
              },
            },
            {
              $group: {
                _id: null,
                totalCount: { $sum: 1 },
                maleCount: { $sum: { $cond: [{ $eq: ["$gender", "Male"] }, 1, 0] } },
                femaleCount: { $sum: { $cond: [{ $eq: ["$gender", "Female"] }, 1, 0] } },
              },
            },
          ],
        },
      },
      {
        $unwind: "$totalMembers", // Unwind the totalMembers array
      },
      {
        $unwind: {
          path: "$activeMembers",
          preserveNullAndEmptyArrays: true, // Preserve documents with no active users
        },
      },
      {
        $unwind: {
          path: "$totalStaffs",
          preserveNullAndEmptyArrays: true, // Preserve documents with no active users
        },
      },
      {
        $addFields: {
          totalMembers: {
            totalCount: "$totalMembers.totalCount",
            maleCount: "$totalMembers.maleCount",
            femaleCount: "$totalMembers.femaleCount",
          },
          activeMembers: {
            activeUsersCount: { $ifNull: ["$activeMembers.activeUsersCount", 0] },
            maleCount: { $ifNull: ["$activeMembers.maleCount", 0] },
            femaleCount: { $ifNull: ["$activeMembers.femaleCount", 0] },
          },
          totalStaffs: {
            totalCount: { $ifNull: ["$totalStaffs.totalCount", 0] },
            maleCount: { $ifNull: ["$totalStaffs.maleCount", 0] },
            femaleCount: { $ifNull: ["$totalStaffs.femaleCount", 0] },
          },
        },
      },
    ]);

    res.status(200).json(salesData);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// User.controller.js
export async function getUserWithFollowUp(req, res) {
  const { branch } = req.params;
  const { status, days, page = 1, search = "" } = req.query;
  const pageSize = 10;

  try {
    let query = { role: "member", branch: branch };
    const today = moment().startOf('day');

    if (status) {
      if (status === "active") {
        query.expiredate = { $gte: today.format("YYYY-MM-DD") };
      } else if (status === "expired") {
        query.expiredate = { $lt: today.format("YYYY-MM-DD") };
      }
    }

    if (search) {
      query.$or = [
        { full_name: { $regex: search, $options: "i" } },
        { contact_no: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { member_id: { $regex: search, $options: "i" } }
      ];
    }

    let users = await Users.find(query)
      .select("full_name email contact_no member_id gender branch expiredate admission_date")
      .lean();

    if (days) {
      const daysFilter = parseInt(days.replace("+", ""));
      users = users.filter((user) => {
        const expireDate = moment(user.expiredate, "YYYY-MM-DD").startOf('day');
        const difference = expireDate.diff(today, 'days');
        return (
          (status === "active" && difference >= daysFilter) ||
          (status === "expired" && -difference >= daysFilter)
        );
      });
    }

    users = users.map((user) => {
      const expireDate = moment(user.expiredate, "YYYY-MM-DD").startOf('day');
      let expireMessage = "";

      const difference = expireDate.diff(today, 'days');

      if (difference > 0) {
        expireMessage = `+${difference}`;
      } else if (difference < 0) {
        expireMessage = `${difference}`;
      } else {
        expireMessage = "Today";
      }

      return {
        ...user,
        expiredate: expireMessage,
        admission_date: moment(user.admission_date).format("YYYY-MM-DD"),
        daysUntilExpiration: Math.abs(difference),
      };
    });

    users.sort((a, b) => a.daysUntilExpiration - b.daysUntilExpiration);

    const totalItems = users.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginatedUsers = users.slice((page - 1) * pageSize, page * pageSize);

    const usersWithFollowUps = await Promise.all(
      paginatedUsers.map(async (user) => {
        const followUps = await FollowUp.find({ userId: user._id }).lean();
        const formattedFollowUps = followUps.map((followUp) => ({
          ...followUp,
          nextFollowUpDate: moment(followUp.nextFollowUpDate).format("YYYY-MM-DD"),
          followUp: followUp.followUp
            .map((entry) => ({
              ...entry,
              date: moment(entry.date).format("YYYY-MM-DD"),
            }))
            .sort((a, b) => (b._id > a._id ? 1 : -1)), // Sort follow-up entries by `_id` in descending order to ensure latest entry is first
        }));

        return {
          ...user,
          followUps: formattedFollowUps,
        };
      })
    );

    res.status(200).json({
      totalItems,
      totalPages,
      currentPage: page,
      pageSize,
      data: usersWithFollowUps,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}


export async function getUpcomingBirthday(req, res) {
  try {
    const today = moment().startOf("day"); // Starting at midnight for accurate comparison
    const endDate = moment().add(40, "days").endOf("day"); // Up to the end of the 40th day
    const { branch } = req.query; // Assuming branch is sent as a query parameter

    const matchStage = {
      $match: {
        date_of_birth: { $regex: /^\d{4}-\d{2}-\d{2}$/ }, // Matches 'YYYY-MM-DD' format
      },
    };

    // Add branch filter if provided
    if (branch) {
      matchStage.$match.branch = branch;
    }

    const result = await Users.aggregate([
      matchStage,
      {
        $addFields: {
          birthDate: { $dateFromString: { dateString: "$date_of_birth", format: "%Y-%m-%d" } },
        },
      },
      {
        $addFields: {
          nextBirthday: {
            $dateFromParts: {
              year: today.year(),
              month: { $month: "$birthDate" },
              day: { $dayOfMonth: "$birthDate" },
            },
          },
          age: {
            $subtract: [{ $year: today.toDate() }, { $year: "$birthDate" }],
          },
        },
      },
      {
        $addFields: {
          nextBirthday: {
            $cond: [
              { $lt: ["$nextBirthday", today.toDate()] },
              { $dateFromParts: { year: today.year() + 1, month: { $month: "$birthDate" }, day: { $dayOfMonth: "$birthDate" } } },
              "$nextBirthday",
            ],
          },
        },
      },
      {
        $addFields: {
          daysUntilBirthday: {
            $trunc: {
              $divide: [
                { $subtract: ["$nextBirthday", today.toDate()] },
                1000 * 60 * 60 * 24,
              ],
            },
          },
        },
      },
      {
        $match: {
          daysUntilBirthday: { $gte: 0, $lte: 40 }, // Include today (0 days)
        },
      },
      {
        $project: {
          _id: 0,
          full_name: 1,
          date_of_birth: {
            $dateToString: { format: "%B %d, %Y", date: "$birthDate" },
          },
          age: 1,
          daysUntilBirthday: 1,
        },
      },
      { $sort: { daysUntilBirthday: 1 } }, // Sort by daysUntilBirthday in ascending order
      { $limit: 30 }, // Limit to 30 upcoming birthdays
    ]);

    // console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).send({ error: err.message });
  }
}



// Route to request an OTP
export const requestOTP = async (req, res) => {
  const { email, contact_no } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email not found!" });
  }

  // Generate the OTP
  const otp = generateOTP();

  const message = "Your OTP code is " + otp + ". It will expire in 5 minutes.";

  // Hash OTP before storing (for security purposes)
  const salt = await bcrypt.genSalt(10);
  const hashedOTP = await bcrypt.hash(otp, salt);

  // Store OTP and expiration time (5 minutes) in the user's data

  const otp_expiration_time = process.env.OTP_EXPIRATION_TIME || 5;
  const updateReport = await Users.updateOne(
    { email },
    {
      otp: hashedOTP,
      expiresAt: Date.now() + otp_expiration_time * 60000,
      isVerified: false,
    }
  );

  try {
    // Send OTP via email
    // const sendOTPResult = await sendOTPSMS(contact_no, message);

    // console.log("sendOTPResult", sendOTPResult);

    console.log("updateReport", {
      message: message,
      otp_expiration_time,
      user: updateReport,
      otp: otp,
    });
    res.status(200).json({
      message: message,
      otp_expiration_time,
      user: updateReport,
      otp: otp,
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
};

// Route to verify OTP
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const user = await Users.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or OTP" });
  }

  // Check if OTP has expired
  if (Date.now() > user.expiresAt) {
    return res.status(400).json({ message: "OTP has expired" });
  }

  // Compare the provided OTP with the hashed OTP
  const isMatch = await bcrypt.compare(otp, user.otp);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  const updateReport = await Users.updateOne(
    { email },
    {
      isVerified: true,
    },
    { new: true }
  );

  // OTP is valid, proceed with authentication

  if (updateReport.acknowledged) {
    user.isVerified = true;
  }
  res
    .status(200)
    .json({ message: "OTP verified successfully", user, updateReport });
};

export async function createUserByFirebase(req, res) {
  const {email , password} = req.body
  try {
    const user = await admin.auth().createUser({
      email: email,
      password: password,
    });
    
    return res.status(201).json({ message: 'User created successfully', user });
  
  } catch (error) {
    // console.log(error);
    switch (error.code) {
      case 'auth/invalid-email':
        return res.status(400).json({ message: 'Invalid email format' ,error });
      
      case 'auth/email-already-exists':
        return res.status(409).json({ message: 'Email already in use' ,error });

      default:
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }
}