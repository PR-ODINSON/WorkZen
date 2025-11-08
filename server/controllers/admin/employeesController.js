const Employee = require('../../models/Employee');
const { success, error } = require('../../utils/response');

exports.list = async (req, res) => {
  try {
    const employees = await Employee.find().populate('userId', 'name email');
    return success(res, { employees });
  } catch (err) {
    console.error(err);
    return error(res);
  }
};

exports.create = async (req, res) => {
  try {
    const data = req.body;
    const emp = await Employee.create(data);
    return success(res, { employee: emp }, 201);
  } catch (err) {
    console.error(err);
    return error(res);
  }
};

exports.get = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id).populate('userId', 'name email');
    if (!emp) return error(res, 'Not found', 404);
    return success(res, { employee: emp });
  } catch (err) {
    console.error(err);
    return error(res);
  }
};

exports.update = async (req, res) => {
  try {
    const emp = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return success(res, { employee: emp });
  } catch (err) {
    console.error(err);
    return error(res);
  }
};

exports.remove = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    return success(res, { message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return error(res);
  }
};
