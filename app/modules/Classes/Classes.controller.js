import Classes from "./Classes.model.js"


export async function getAllClasses(req, res) {
    const branch = req.params.branch;
    try {
        const result = await Classes.find();
        res.json(result);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}
export async function getAllClass(req, res) {
    const branch = req.params.branch;
    try {
        // Set currentDate to the start of today (00:00:00)
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const result = await Classes.find({
            branch: branch,
        });

        // Filter for classes with the same or future dates
        const futureClasses = result.filter((classItem) => {
            const classDate = new Date(classItem.date);
            classDate.setHours(0, 0, 0, 0);  // Normalize classDate to start of the day
            return classDate >= currentDate;
        });

        res.json(futureClasses);
    } catch (err) {
        console.error('Error fetching classes:', err);
        res.status(500).send({ error: err.message });
    }
}


// export async function getAllClass(req, res) {
//     const branch = req.params.branch;
//     try {
//         const result = await Classes.find({ branch: branch });
//         res.json(result);
//     } catch (err) {
//         res.status(500).send({ error: err.message });
//     }
// }
export async function getByIdClass(req, res) {
    const id = req.params.id;
    try {
        const result = await Classes.findById(id);;
        res.json(result);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

export async function createClass(req, res) {
    try {
        const ClassesData = req.body;
        const result = await Classes.create(ClassesData);
        res.json(result);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

export async function removeClass(req, res) {
    const id = req.params.id;
    try {
        const result = await Classes.findByIdAndDelete(id);
        if (result) {
            res.status(200).json({ message: "Data delted successfully" });
        } else {
            res.status(404).json({ message: "Data not found" });
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

export async function updateClass(req, res) {
    const id = req.params.id;
    const ClassesData = req.body;
    try {
        const result = await Classes.findByIdAndUpdate(id, ClassesData, {
            new: true,
        })
        res.json(result);
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
}


export async function registerClass(req, res) {
    const { classId } = req.params;
    const { name, email, photo } = req.body;

    try {
        const classToUpdate = await Classes.findById(classId);
        if (!classToUpdate) {
            return res.status(404).json({ message: "Class not found" });
        }

        classToUpdate.registered.push({ name, email, photo });

        await classToUpdate.save();

        res.status(200).json({ message: "Registration successful", class: classToUpdate });
    } catch (error) {
        res.status(500).json({ message: "Error registering", error: error.message });
    }
}


export async function updateAttendence(req, res) {
    const { classId } = req.params;
    const { email, status } = req.body;

    try {
        // Find the class by ID and update the status of the specific registered user
        const updatedClass = await Classes.findOneAndUpdate(
            { _id: classId, "registered.email": email },
            {
                $set: { "registered.$.status": status },
            },
            { new: true } // Return the updated document
        );

        if (!updatedClass) {
            return res.status(404).json({ message: "Class or user not found" });
        }

        res.status(200).json({ message: "Attendance status updated", updatedClass });
    } catch (error) {
        console.error("Error updating attendance status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}