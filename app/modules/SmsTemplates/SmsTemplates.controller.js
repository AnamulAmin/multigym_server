import SmsTemplates from "./SmsTemplates.model.js";

export async function getAllSmsTemplates(req, res) {
  try {
    const { branch } = req.query;
    const filter = branch ? { branch } : {};
    const result = await SmsTemplates.find(filter);
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getSmsTemplateById(req, res) {
  const id = req.params.id;
  try {
    const result = await SmsTemplates.findById(id);
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function createSmsTemplate(req, res) {
  try {
    const smsTemplateData = req.body;
    const result = await SmsTemplates.create(smsTemplateData);
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function updateSmsTemplate(req, res) {
  const id = req.params.id;
  const smsTemplateData = req.body;
  try {
    const result = await SmsTemplates.findByIdAndUpdate(id, smsTemplateData, {
      new: true,
    });
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function deleteSmsTemplate(req, res) {
  const id = req.params.id;
  try {
    const result = await SmsTemplates.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: "Data deleted successfully" });
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}
