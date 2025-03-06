import Locker from "./Locker.model.js";
import User from "../Users/Users.model.js"; 


export async function getAllLockers(req, res) {
  const branch = req.params.branch.toLowerCase(); 
  try {
    const result = await Locker.find({ branch: branch })
      .populate("member_id", "full_name email member_id"); 

    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getlockerssByFilter(req, res) {
  const { branch, group, gender, status } = req.params;

  try {
    const query = {
      branch: new RegExp(branch, "i"),
      group: new RegExp(group, "i"),   
      gender: new RegExp(gender, "i"), 
    };

    if (status.toLowerCase() !== "all") {
      query.status = new RegExp(status, "i"); 
    }

    const result = await Locker.find(query).populate("member_id", "full_name email member_id");


    res.status(200).json(result.length > 0 ? result : []);
    
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function unassignLocker(req, res) {
  const { locker_id } = req.params;

  try {
    const result = await Locker.findByIdAndUpdate(
      locker_id,
      { member_id: null, status: 'available' }, 
      { new: true } 
    );

    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: "Locker not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getByIdLocker(req, res) {
  const id = req.params.id;
  try {
    const result = await Locker.findById(id)
      .populate("member_id", "full_name email member_id"); 

    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: "Locker not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}


export async function createLocker(req, res) {
  try {
    const lockerData = req.body;

    if (lockerData.member_id === "") {
      lockerData.member_id = null;
    }
    const result = await Locker.create(lockerData);
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function removeLocker(req, res) {
  const id = req.params.id;
  try {
    const result = await Locker.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: "Locker deleted successfully" });
    } else {
      res.status(404).json({ message: "Locker not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}


export async function updateLocker(req, res) {
  const id = req.params.id;
  const lockerData = req.body;
  try {
    const result = await Locker.findByIdAndUpdate(id, lockerData, { new: true });

    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function assignLockerToUser(req, res) {
  const { locker_id } = req.params;
  const { member_id } = req.body;

  try {
    // Find the user by member_id
    const user = await User.findById(member_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the locker with the new member_id and status "reserved"
    const locker = await Locker.findByIdAndUpdate(
      locker_id,
      { member_id, status: "reserved" },
      { new: true }
    ).populate("member_id", "full_name email member_id");

    if (!locker) {
      return res.status(404).json({ message: "Locker not found" });
    }

    // Update the user's Locker_id with the provided locker_id
    user.Locker_id = locker_id;
    const updatedUser = await user.save();

    res.status(200).json({ locker, updatedUser });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}
export async function unassignLockerFromUser(req, res) {
  const { locker_id } = req.params;
  const { member_id } = req.body;

  console.log(req.body);

  try {
    // Find the user by member_id
    const user = await User.findById(member_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Reset the user's Locker_id to null
    user.Locker_id = null;
    const updatedUser = await user.save();

    // Update the locker to set member_id to null and status to "available"
    const locker = await Locker.findByIdAndUpdate(
      locker_id,
      { member_id: null, status: "available" },
      { new: true }
    );

    if (!locker) {
      return res.status(404).json({ message: "Locker not found" });
    }

    res.status(200).json({ message: "Locker unassigned successfully", locker, updatedUser });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function updateLockerMemberAndStatus(req, res) {
  const { locker_id } = req.params;  
  const { member_id, status } = req.body;  

  try {
   
    const allowedStatuses = ["occupied", "available", "reserved"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

   
    const result = await Locker.findByIdAndUpdate(
      locker_id,
      { member_id, status },  
      { new: true }  
    ).populate("member_id", "full_name email member_id");  

    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: "Locker not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}