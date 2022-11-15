import Joi from "joi";

//register validation
export const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(6).max(50).required().email(),
    password: Joi.string().min(6).max(255).required(),
    role: Joi.string().required().valid("admin", "readonly"),
  });
  return schema.validate(data);
};

export const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(50).required().email(),
    password: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(data);
};

export const machineValidation = (data) => {
  const schema = Joi.object({
    machinename: Joi.string().min(3).max(50).required(),
    machinegroup: Joi.string().min(3).max(50).required(),
  });
  return schema.validate(data);
};
